import { z } from 'zod'
import { getRequestIP } from 'h3'
import { callAI, type AIMessage } from '../../utils/ai'

function buildClientSystemPrompt(
  userName?: string,
  userRole?: string,
  userLocation?: string,
): string {
  const now = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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
  content: z.string().min(1).max(10_000),
})

const chatRequestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(30),
  provider: z
    .enum(['gemini', 'groq', 'openrouter'])
    .optional()
    .default('gemini'),
  userName: z.string().max(120).optional(),
  userRole: z.string().max(120).optional(),
  userLocation: z.string().max(160).optional(),
})

export default defineEventHandler(async (event) => {
  // Rate limiter sebaiknya ditangani di level middleware / server proxy (seperti Nginx/Cloudflare)
  // Menyimpan map di memori Nuxt bisa memicu memory leak di environment serverless / PM2 cluster.
  
  const rawBody = await readBody(event)
  const parsed = chatRequestSchema.safeParse(rawBody)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request',
      data: parsed.error.issues,
    })
  }

  const { messages, provider, userName, userRole, userLocation } = parsed.data
  const systemPrompt = buildClientSystemPrompt(userName, userRole, userLocation)

  const fullMessages: AIMessage[] = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ]

  try {
    // callAI sudah memiliki fallback internal untuk model di dalam file utils/ai.ts
    const aiResult = await callAI(fullMessages, provider)
    
    return {
      reply: aiResult.content || 'Maaf, belum ada respons saat ini.',
      model: aiResult.model,
      provider: provider,
      usage: aiResult.usage,
    }
  } catch (error: unknown) {
    console.error('[chatbot] API Error:', error instanceof Error ? error.message : error)
    throw createError({
      statusCode: 503,
      statusMessage: 'Layanan AI sedang tidak tersedia. Coba lagi nanti.',
    })
  }
})
