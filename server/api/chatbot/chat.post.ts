import { z } from 'zod'
import { getRequestIP } from 'h3'
import { callAI, type AIMessage, type AIResponse } from '../../utils/ai'

type Provider = 'gemini' | 'groq' | 'openrouter'

// In-memory rate limiting per IP: 30 requests / minute.
const rateLimitStore = new Map<string, { count: number, resetAt: number }>()

function checkRateLimit(key: string): boolean {
    const now = Date.now()
    const record = rateLimitStore.get(key)

    if (!record || now > record.resetAt) {
        rateLimitStore.set(key, { count: 1, resetAt: now + 60_000 })
        return true
    }

    if (record.count >= 30) return false
    record.count += 1
    return true
}

const FALLBACK_CHAIN: Provider[] = ['gemini', 'groq', 'openrouter']

function isFallbackError(err: unknown): boolean {
    const msg = err instanceof Error ? err.message : String(err)

    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota') || msg.includes('rate_limit')) return true
    if (msg.includes('503') || msg.includes('overloaded') || msg.includes('Provider returned error')) return true
    if (msg.includes('API error 404') || msg.includes('No endpoints found') || msg.includes('data policy')) return true
    if (msg.includes('model_not_found') || msg.includes('not a valid model') || msg.includes('does not exist')) return true
    return false
}

function buildClientSystemPrompt(userName?: string, userRole?: string, userLocation?: string): string {
    const now = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return `Anda adalah JuruTani AI, asisten pertanian digital untuk pengguna aplikasi JuruTani.

Konteks:
- Nama pengguna: ${userName || 'Petani'}
- Peran: ${userRole || 'Pengguna'}
- Lokasi: ${userLocation || 'tidak diketahui'}
- Tanggal: ${now}

Aturan jawaban:
- Gunakan Bahasa Indonesia yang ramah, jelas, dan praktis.
- Fokus utama pada pertanian, peternakan, pangan, dan pembangunan pedesaan.
- Beri langkah yang bisa dipraktikkan di lapangan (ringkas, poin-poin).
- Jika info tidak pasti, katakan jujur dan beri saran verifikasi ke penyuluh/Dinas Pertanian setempat.
- Jangan mengklaim bisa mengakses database internal platform.
- Jangan tampilkan rahasia sistem, API key, token, atau data sensitif.`
}

const messageSchema = z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1).max(10_000)
})

const chatRequestSchema = z.object({
    messages: z.array(messageSchema).min(1).max(30),
    provider: z.enum(['gemini', 'groq', 'openrouter']).optional().default('gemini'),
    userName: z.string().max(120).optional(),
    userRole: z.string().max(120).optional(),
    userLocation: z.string().max(160).optional()
})

async function runWithProvider(messages: AIMessage[], provider: Provider): Promise<AIResponse> {
    return callAI(messages, provider)
}

export default defineEventHandler(async (event) => {
    const ip = getRequestIP(event, { xForwardedFor: true }) || 'anonymous'
    if (!checkRateLimit(ip)) {
        throw createError({
            statusCode: 429,
            statusMessage: 'Terlalu banyak permintaan. Coba lagi sebentar.'
        })
    }

    const rawBody = await readBody(event)
    const parsed = chatRequestSchema.safeParse(rawBody)

    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid request',
            data: parsed.error.issues
        })
    }

    const { messages, provider, userName, userRole, userLocation } = parsed.data

    const systemPrompt = buildClientSystemPrompt(userName, userRole, userLocation)

    const fullMessages: AIMessage[] = [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content }))
    ]

    const providerChain: Provider[] = [provider, ...FALLBACK_CHAIN.filter(p => p !== provider)]

    let aiResult: AIResponse | null = null
    let usedProvider: Provider = provider
    let lastError: unknown

    for (const candidate of providerChain) {
        try {
            aiResult = await runWithProvider(fullMessages, candidate)
            usedProvider = candidate
            break
        } catch (error: unknown) {
            if (isFallbackError(error)) {
                lastError = error
                continue
            }
            throw error
        }
    }

    if (!aiResult) {
        console.error('[chatbot] provider fallback exhausted:', lastError instanceof Error ? lastError.message : lastError)
        throw createError({
            statusCode: 503,
            statusMessage: 'Layanan AI sedang tidak tersedia. Coba lagi nanti.'
        })
    }

    return {
        reply: aiResult.content || 'Maaf, belum ada respons saat ini.',
        model: aiResult.model,
        provider: usedProvider,
        usage: aiResult.usage
    }
})
