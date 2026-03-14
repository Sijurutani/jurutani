import { toastStore } from './useJuruTaniToast'

export interface FileUploadOptions {
    bucket: string
    folder: string
    maxSizeMB?: number
    allowedTypes?: string[]
}

export interface FileUploadResult {
    path: string
    url: string
}

/**
 * Composable for handling file uploads to Supabase Storage
 * Provides reusable file upload, validation, and preview functionality
 */
export const useAppFileUpload = () => {
    const supabase = useSupabaseClient()

    /**
     * Generate a unique file path with timestamp
     */
    const generateFilePath = (id: string, fileName: string, folder: string): string => {
        const timestamp = Date.now()
        const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
        return `${folder}/${id}/${timestamp}_${cleanFileName}`
    }

    /**
     * Validate file type
     */
    const validateFileType = (file: File, allowedTypes: string[]): boolean => {
        if (allowedTypes.length === 0) return true

        return allowedTypes.some(type => {
            if (type.endsWith('/*')) {
                const category = type.split('/')[0]
                return file.type.startsWith(`${category}/`)
            }
            return file.type === type
        })
    }

    /**
     * Validate file size
     */
    const validateFileSize = (file: File, maxSizeMB: number): boolean => {
        const maxSizeBytes = maxSizeMB * 1024 * 1024
        return file.size <= maxSizeBytes
    }

    /**
     * Validate file before upload
     */
    const validateFile = (
        file: File,
        options: { maxSizeMB?: number; allowedTypes?: string[] }
    ): { valid: boolean; error?: string } => {
        const { maxSizeMB = 10, allowedTypes = [] } = options

        // Validate file type
        if (allowedTypes.length > 0 && !validateFileType(file, allowedTypes)) {
            return {
                valid: false,
                error: `Tipe file tidak didukung. Hanya ${allowedTypes.join(', ')} yang diperbolehkan`
            }
        }

        // Validate file size
        if (!validateFileSize(file, maxSizeMB)) {
            return {
                valid: false,
                error: `Ukuran file maksimal ${maxSizeMB}MB`
            }
        }

        return { valid: true }
    }

    /**
     * Upload file to Supabase Storage
     */
    const uploadFile = async (
        file: File,
        options: FileUploadOptions
    ): Promise<FileUploadResult> => {
        const { bucket, folder, maxSizeMB = 10, allowedTypes = [] } = options

        // Validate file
        const validation = validateFile(file, { maxSizeMB, allowedTypes })
        if (!validation.valid) {
            throw new Error(validation.error)
        }

        // Generate unique ID and path
        const fileId = crypto.randomUUID()
        const filePath = generateFilePath(fileId, file.name, folder)

        // Upload to Supabase Storage
        const { error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            })

        if (error) throw error

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath)

        return {
            path: filePath,
            url: urlData.publicUrl
        }
    }

    /**
     * Create image preview from file
     */
    const createImagePreview = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                resolve(e.target?.result as string)
            }
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }

    /**
     * Handle image file selection with validation and preview
     */
    const handleImageSelection = async (
        file: File | null,
        options: { maxSizeMB?: number } = {}
    ): Promise<{ file: File; preview: string } | null> => {
        if (!file) return null

        const { maxSizeMB = 5 } = options

        // Validate image type
        if (!file.type.startsWith('image/')) {
            toastStore.error('File harus berupa gambar')
            return null
        }

        // Validate size
        if (!validateFileSize(file, maxSizeMB)) {
            toastStore.error(`Ukuran gambar maksimal ${maxSizeMB}MB`)
            return null
        }

        // Create preview
        try {
            const preview = await createImagePreview(file)
            return { file, preview }
        } catch (error) {
            toastStore.error('Gagal membuat preview gambar')
            return null
        }
    }

    /**
     * Delete file from Supabase Storage
     */
    const deleteFile = async (bucket: string, path: string): Promise<void> => {
        const { error } = await supabase.storage
            .from(bucket)
            .remove([path])

        if (error) throw error
    }

    return {
        generateFilePath,
        validateFile,
        validateFileType,
        validateFileSize,
        uploadFile,
        createImagePreview,
        handleImageSelection,
        deleteFile
    }
}
