// composables/useClientChatbot.ts
// State management chatbot client-side:
//   - Riwayat sesi (localStorage)
//   - Profil user dari Pinia auth store
//   - Kirim pesan ke server API chatbot

import { type AIProvider } from '~/utils/ai'

// --- Types -------------------------------------------------------------------

export interface ChatMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    provider?: string
    model?: string
    error?: boolean
}

export interface ChatSession {
    id: string
    title: string
    date: string // ISO string
    messages: ChatMessage[]
}

interface ServerChatResponse {
    reply: string
    model: string
    provider: AIProvider
    usage?: {
        prompt_tokens: number
        completion_tokens: number
        total_tokens: number
    }
}

// --- Constants ---------------------------------------------------------------

const STORAGE_KEY = 'jurutani_chat_sessions'
const MAX_SESSIONS = 30
const MAX_MESSAGES_PER_SESSION = 100

// --- System prompt -----------------------------------------------------------

function buildSystemPrompt(userName: string, userRole: string, userLocation: string): string {
    const now = new Date().toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })

    return `Anda adalah JuruTani AI, asisten penyuluh pertanian cerdas dari platform JuruTani.

## Identitas
- Nama: JuruTani AI
- Peran: Asisten penyuluh pertanian, peternakan, dan pembangunan pedesaan
- Bahasa: Indonesia (gunakan bahasa yang ramah, sopan, dan mudah dipahami petani)
- Tanggal hari ini: ${now}

## Informasi Pengguna
- Nama: ${userName}
- Peran: ${userRole}
- Lokasi: ${userLocation || 'tidak diketahui'}

## Kemampuan Anda
Anda dapat membantu dengan:
1. **Teknik budidaya** - tanaman pangan, hortikultura, perkebunan
2. **Peternakan** - sapi, kambing, ayam, ikan, lebah, dll
3. **Pengendalian hama & penyakit** - identifikasi, pencegahan, penanganan organik/kimia
4. **Pupuk & nutrisi** - rekomendasi jenis, dosis, waktu pemupukan
5. **Irigasi & pengelolaan air** - teknik irigasi tetes, pompa, embung
6. **Teknologi pertanian** - alat mesin pertanian, precision farming, IoT
7. **Pasca panen & pemasaran** - pengolahan, pengemasan, akses pasar digital
8. **Program pemerintah** - KUR, subsidi pupuk, asuransi pertanian, AUTP
9. **Pembangunan pedesaan** - infrastruktur, BUMDes, ketahanan pangan
10. **Analisis lahan** - jenis tanah, pH, kesesuaian komoditas

## Panduan Menjawab
- Sapa pengguna dengan namanya jika relevan: "${userName}"
- Berikan jawaban **terstruktur** dengan heading, bullet, tabel jika diperlukan
- Sertakan **sumber atau referensi** di akhir jawaban bila memungkinkan (contoh: Kementan RI, Balitbangtan, FAO, BPTP, dll)
- Format sumber: > 📚 **Sumber:** [nama sumber] - [judul/topik singkat]
- Jika tidak tahu, katakan dengan jujur dan sarankan ke penyuluh lapangan atau Dinas Pertanian setempat
- Gunakan emoji secukupnya agar lebih menarik dan ramah
- Untuk pertanyaan di luar pertanian/peternakan/pembangunan, tetap bantu tapi ingatkan fokus utama Anda

## Format Markdown
Gunakan markdown penuh:
- **Bold** untuk istilah penting
- *Italic* untuk nama ilmiah atau penekanan
- \`code\` untuk dosis/ukuran spesifik
- Tabel untuk perbandingan
- > Blockquote untuk sumber referensi
- --- untuk pemisah bagian`
}

// --- localStorage helpers ----------------------------------------------------

function loadSessions(): ChatSession[] {
    if (!import.meta.client) return []
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw) as ChatSession[]
        return parsed.map(s => ({
            ...s,
            messages: s.messages.map(m => ({
                ...m,
                timestamp: new Date(m.timestamp),
            })),
        }))
    }
    catch {
        return []
    }
}

function saveSessions(sessions: ChatSession[]): void {
    if (!import.meta.client) return
    try {
        const toSave = sessions.slice(0, MAX_SESSIONS)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    }
    catch (e) {
        console.warn('[chatbot] Gagal menyimpan sesi:', e)
    }
}

function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function buildSessionTitle(messages: ChatMessage[]): string {
    const first = messages.find(m => m.role === 'user')
    if (!first) return 'Percakapan baru'
    return first.content.slice(0, 50) + (first.content.length > 50 ? '...' : '')
}

// --- Composable --------------------------------------------------------------

export const useClientChatbot = () => {
    const authStore = useAuthStore()

    const isOpen = ref(false)
    const isLoading = ref(false)
    const isExpanded = ref(false)
    const hasSeenSplash = ref(false)
    const showSplash = computed(() => isOpen.value && !hasSeenSplash.value)

    const provider = ref<AIProvider>('gemini')

    const sessions = ref<ChatSession[]>(loadSessions())
    const activeSessionId = ref<string | null>(null)

    const activeSession = computed<ChatSession | null>(
        () => sessions.value.find(s => s.id === activeSessionId.value) ?? null,
    )

    const messages = computed<ChatMessage[]>(
        () => activeSession.value?.messages ?? [],
    )

    const userProfile = computed(() => ({
        name: authStore.displayName ?? 'Petani',
        role: authStore.roleLabel ?? 'Pengguna',
        location: authStore.computedProfile?.location ?? '',
        avatar: authStore.avatarUrl ?? '/profile.png',
        isAuthenticated: authStore.isAuthenticated,
    }))

    function newChat(): void {
        const session: ChatSession = {
            id: generateId(),
            title: 'Percakapan baru',
            date: new Date().toISOString(),
            messages: [],
        }
        sessions.value.unshift(session)
        activeSessionId.value = session.id
        saveSessions(sessions.value)
    }

    function loadSession(id: string): void {
        const found = sessions.value.find(s => s.id === id)
        if (found) activeSessionId.value = found.id
    }

    function deleteSession(id: string): void {
        sessions.value = sessions.value.filter(s => s.id !== id)
        if (activeSessionId.value === id) {
            activeSessionId.value = sessions.value[0]?.id ?? null
        }
        saveSessions(sessions.value)
    }

    function clearAllSessions(): void {
        sessions.value = []
        activeSessionId.value = null
        if (import.meta.client) localStorage.removeItem(STORAGE_KEY)
    }

    function pushMessage(msg: ChatMessage): void {
        const idx = sessions.value.findIndex(s => s.id === activeSessionId.value)
        if (idx === -1) return

        const session = sessions.value[idx]!
        const updated: ChatSession = {
            ...session,
            messages: [...session.messages, msg].slice(-MAX_MESSAGES_PER_SESSION),
            title: session.messages.length === 0 && msg.role === 'user'
                ? buildSessionTitle([msg])
                : session.title,
        }

        sessions.value = [
            updated,
            ...sessions.value.filter(s => s.id !== activeSessionId.value),
        ]
        saveSessions(sessions.value)
    }

    function buildAIHistory() {
        return messages.value.map(m => ({
            role: m.role,
            content: m.content,
        }))
    }

    async function sendMessage(text: string): Promise<void> {
        if (!text.trim() || isLoading.value) return

        if (!activeSessionId.value) newChat()

        const userMsg: ChatMessage = {
            id: generateId(),
            role: 'user',
            content: text.trim(),
            timestamp: new Date(),
        }
        pushMessage(userMsg)
        isLoading.value = true

        try {
            const history = buildAIHistory()
            const { name, role, location } = userProfile.value
            const response = await $fetch<ServerChatResponse>('/api/chatbot/chat', {
                method: 'POST',
                body: {
                    messages: history,
                    provider: provider.value,
                    userName: name,
                    userRole: role,
                    userLocation: location,
                    localSystemPrompt: buildSystemPrompt(name, role, location),
                },
            })

            const botMsg: ChatMessage = {
                id: generateId(),
                role: 'assistant',
                content: response.reply,
                timestamp: new Date(),
                provider: response.provider,
                model: response.model,
            }
            pushMessage(botMsg)
        }
        catch (e: unknown) {
            const errMsg: ChatMessage = {
                id: generateId(),
                role: 'assistant',
                content: `❌ **Gagal mendapatkan respons.**\n\n${e instanceof Error ? e.message : 'Terjadi kesalahan tidak diketahui.'}\n\nSilakan coba lagi atau ganti provider AI.`,
                timestamp: new Date(),
                error: true,
            }
            pushMessage(errMsg)
        }
        finally {
            isLoading.value = false
        }
    }

    function open(): void {
        isOpen.value = true
    }

    function close(): void {
        isOpen.value = false
    }

    function startChat(): void {
        hasSeenSplash.value = true
        if (!activeSessionId.value) newChat()
    }

    function toggleExpand(): void {
        isExpanded.value = !isExpanded.value
    }

    if (import.meta.client && sessions.value.length === 0) {
        newChat()
    }
    else if (sessions.value.length > 0 && !activeSessionId.value) {
        activeSessionId.value = sessions.value[0]!.id
    }

    return {
        isOpen,
        isLoading,
        isExpanded,
        showSplash,
        hasSeenSplash,

        provider,

        sessions,
        messages,
        activeSession,
        activeSessionId,
        userProfile,

        newChat,
        loadSession,
        deleteSession,
        clearAllSessions,

        sendMessage,

        open,
        close,
        startChat,
        toggleExpand,
    }
}
