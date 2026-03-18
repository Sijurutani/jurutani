// utils/ai.ts
// Client-side AI caller — Groq, Gemini, OpenRouter
// Keys dari NUXT_PUBLIC_* runtimeConfig

export interface AIMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
}

export interface AIResponse {
    content: string
    model: string
    provider: string
    usage: {
        prompt_tokens: number
        completion_tokens: number
        total_tokens: number
    }
}

// ─── Model lists per provider (fallback ordered) ──────────────────────────────

export const PROVIDER_MODELS: Record<'groq' | 'gemini' | 'openrouter', string[]> = {
    groq: [
        'llama-3.3-70b-versatile',
        'llama3-70b-8192',
        'llama-3.1-8b-instant',
    ],
    gemini: [
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash',
        'gemini-1.5-flash-8b',
    ],
    openrouter: [
        'openai/gpt-oss-120b:free',
        'meta-llama/llama-3.3-70b-instruct:free',
        'google/gemma-3-27b-it:free',
        'qwen/qwen3-4b:free',
    ],
}

export type AIProvider = keyof typeof PROVIDER_MODELS

// ─── Internal: OpenAI-compatible fetch ────────────────────────────────────────

async function callOpenAICompatible(
    baseUrl: string,
    apiKey: string,
    messages: AIMessage[],
    model: string,
    extraHeaders: Record<string, string> = {},
    extraBody: Record<string, unknown> = {},
): Promise<AIResponse & { _model: string }> {
    const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            ...extraHeaders,
        },
        body: JSON.stringify({
            model,
            messages,
            max_tokens: 2048,
            temperature: 0.7,
            ...extraBody,
        }),
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API error ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    const message = data.choices?.[0]?.message

    return {
        content: message?.content ?? '',
        model: data.model ?? model,
        _model: model,
        provider: '',
        usage: data.usage ?? { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    }
}

// ─── Fallback error detection ─────────────────────────────────────────────────

function isFallbackError(err: unknown): boolean {
    const msg = err instanceof Error ? err.message : String(err)
    return (
        msg.includes('429')
        || msg.includes('RESOURCE_EXHAUSTED')
        || msg.includes('quota')
        || msg.includes('rate_limit')
        || msg.includes('503')
        || msg.includes('overloaded')
        || msg.includes('model_not_found')
        || msg.includes('not a valid model')
        || msg.includes('does not exist')
        || msg.includes('No endpoints found')
        || msg.includes('API error 404')
        || msg.includes('Provider returned error')
    )
}

// ─── Per-provider callers ─────────────────────────────────────────────────────

async function callGroq(messages: AIMessage[], model: string): Promise<AIResponse> {
    const config = useRuntimeConfig()
    const apiKey = config.public.groqApiKey as string
    if (!apiKey) throw new Error('NUXT_PUBLIC_GROQ_API_KEY tidak dikonfigurasi')

    const res = await callOpenAICompatible(
        'https://api.groq.com/openai/v1',
        apiKey,
        messages,
        model,
    )
    return { ...res, provider: 'groq' }
}

async function callGemini(messages: AIMessage[], model: string): Promise<AIResponse> {
    const config = useRuntimeConfig()
    const apiKey = config.public.geminiApiKey as string
    if (!apiKey) throw new Error('NUXT_PUBLIC_GEMINI_API_KEY tidak dikonfigurasi')

    const res = await callOpenAICompatible(
        'https://generativelanguage.googleapis.com/v1beta/openai',
        apiKey,
        messages,
        model,
    )
    return { ...res, provider: 'gemini' }
}

async function callOpenRouter(messages: AIMessage[], model: string): Promise<AIResponse> {
    const config = useRuntimeConfig()
    const apiKey = config.public.openrouterApiKey as string
    if (!apiKey) throw new Error('NUXT_PUBLIC_OPENROUTER_API_KEY tidak dikonfigurasi')

    const res = await callOpenAICompatible(
        'https://openrouter.ai/api/v1',
        apiKey,
        messages,
        model,
        {
            'HTTP-Referer': 'https://jurutani.com',
            'X-Title': 'JuruTani',
        },
        {
            provider: { allow_fallbacks: true },
        },
    )
    return { ...res, provider: 'openrouter' }
}

// ─── Main export: callAI dengan auto-fallback ─────────────────────────────────

export async function callAI(
    messages: AIMessage[],
    provider: AIProvider = 'gemini',
): Promise<AIResponse> {
    const models = PROVIDER_MODELS[provider]
    let lastError: unknown

    for (const model of models) {
        try {
            if (provider === 'groq') return await callGroq(messages, model)
            if (provider === 'gemini') return await callGemini(messages, model)
            if (provider === 'openrouter') return await callOpenRouter(messages, model)
        }
        catch (e: unknown) {
            if (isFallbackError(e)) {
                console.warn(
                    `[ai] ${provider}/${model} gagal (${e instanceof Error ? e.message.slice(0, 80) : 'unknown'}), mencoba model berikutnya...`,
                )
                lastError = e
                continue
            }
            throw e
        }
    }

    throw lastError ?? new Error(`Semua model habis untuk provider: ${provider}`)
}