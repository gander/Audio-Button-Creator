/**
 * Audio utility functions for the Audio Button Creator application
 */

/**
 * Check if the browser supports audio recording
 */
export function isAudioRecordingSupported(): boolean {
  return !!(
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    window.MediaRecorder
  )
}

/**
 * Get the best supported audio MIME type for recording
 */
export function getBestAudioMimeType(): string {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/ogg',
    'audio/wav',
    'audio/mp4'
  ]

  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type
    }
  }

  return 'audio/webm' // fallback
}

/**
 * Format recording duration in MM:SS format
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Get audio file extension from MIME type
 */
export function getAudioFileExtension(mimeType: string): string {
  const mimeToExtension: Record<string, string> = {
    'audio/webm': 'webm',
    'audio/ogg': 'ogg',
    'audio/wav': 'wav',
    'audio/mp4': 'm4a',
    'audio/mpeg': 'mp3'
  }

  for (const [mime, ext] of Object.entries(mimeToExtension)) {
    if (mimeType.includes(mime)) {
      return ext
    }
  }

  return 'webm' // fallback
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Generate a unique filename for audio recordings
 */
export function generateAudioFilename(buttonName: string, mimeType: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const extension = getAudioFileExtension(mimeType)
  const safeName = buttonName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
  
  return `${safeName}_${timestamp}.${extension}`
}

/**
 * Create a blob URL from audio data
 */
export function createAudioBlobUrl(audioBlob: Blob): string {
  return URL.createObjectURL(audioBlob)
}

/**
 * Revoke a blob URL to free memory
 */
export function revokeBlobUrl(url: string): void {
  URL.revokeObjectURL(url)
}

/**
 * Convert blob to base64 string
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1]) // Remove data URL prefix
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * Get optimal recording constraints for different use cases
 */
export function getRecordingConstraints(quality: 'low' | 'medium' | 'high' = 'medium'): MediaStreamConstraints {
  const constraints: MediaStreamConstraints = {
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  }

  switch (quality) {
    case 'low':
      Object.assign(constraints.audio as MediaTrackConstraints, {
        sampleRate: 22050,
        channelCount: 1
      })
      break
    case 'high':
      Object.assign(constraints.audio as MediaTrackConstraints, {
        sampleRate: 48000,
        channelCount: 2
      })
      break
    default: // medium
      Object.assign(constraints.audio as MediaTrackConstraints, {
        sampleRate: 44100,
        channelCount: 1
      })
  }

  return constraints
}

/**
 * Estimate audio file size based on duration and quality
 */
export function estimateAudioFileSize(durationSeconds: number, quality: 'low' | 'medium' | 'high' = 'medium'): number {
  const bitRates = {
    low: 64000,    // 64 kbps
    medium: 128000, // 128 kbps
    high: 256000   // 256 kbps
  }

  const bitRate = bitRates[quality]
  return Math.ceil((durationSeconds * bitRate) / 8) // Convert bits to bytes
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  const sizes = ['B', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 B'
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}
