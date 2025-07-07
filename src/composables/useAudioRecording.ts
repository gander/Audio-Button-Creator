import { ref, onUnmounted } from 'vue'
import type { AudioRecordingComposable } from '../types/index.ts'

export function useAudioRecording(): AudioRecordingComposable {
  const isRecording = ref(false)
  const hasRecording = ref(false)
  const recordingTime = ref(0)
  const audioUrl = ref<string | null>(null)
  const audioBlob = ref<Blob | null>(null)
  const canRecord = ref(false)
  const error = ref('')

  let mediaRecorder: MediaRecorder | null = null
  let mediaStream: MediaStream | null = null
  let recordingTimer: number | null = null
  let audioChunks: Blob[] = []

  // Check if audio recording is supported
  const checkRecordingSupport = () => {
    canRecord.value = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder)
    if (!canRecord.value) {
      error.value = 'Audio recording is not supported in this browser'
    }
  }

  // Initialize recording support check
  checkRecordingSupport()

  const startRecording = async (): Promise<void> => {
    if (!canRecord.value) {
      error.value = 'Audio recording is not supported'
      return
    }

    try {
      error.value = ''
      audioChunks = []

      // Request microphone access
      mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      })

      // Create MediaRecorder instance
      const options: MediaRecorderOptions = {
        mimeType: getSupportedMimeType(),
        audioBitsPerSecond: 128000
      }

      mediaRecorder = new MediaRecorder(mediaStream, options)

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: mediaRecorder?.mimeType || 'audio/webm' })
        audioBlob.value = blob
        audioUrl.value = URL.createObjectURL(blob)
        hasRecording.value = true
        
        // Clean up stream
        if (mediaStream) {
          mediaStream.getTracks().forEach(track => track.stop())
          mediaStream = null
        }
      }

      mediaRecorder.onerror = (event) => {
        error.value = 'Recording failed: ' + (event as any).error?.message || 'Unknown error'
        stopRecording()
      }

      // Start recording
      mediaRecorder.start(100) // Collect data every 100ms
      isRecording.value = true
      recordingTime.value = 0

      // Start timer
      recordingTimer = window.setInterval(() => {
        recordingTime.value++
      }, 1000)

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      
      if (message.includes('Permission denied') || message.includes('NotAllowedError')) {
        error.value = 'Microphone access denied. Please allow microphone access and try again.'
      } else if (message.includes('NotFoundError')) {
        error.value = 'No microphone found. Please check your audio devices.'
      } else {
        error.value = `Failed to start recording: ${message}`
      }
      
      console.error('Recording error:', err)
    }
  }

  const stopRecording = (): void => {
    if (mediaRecorder && isRecording.value) {
      mediaRecorder.stop()
      isRecording.value = false
      
      if (recordingTimer) {
        clearInterval(recordingTimer)
        recordingTimer = null
      }
    }
  }

  const discardRecording = (): void => {
    hasRecording.value = false
    recordingTime.value = 0
    
    if (audioUrl.value) {
      URL.revokeObjectURL(audioUrl.value)
      audioUrl.value = null
    }
    
    audioBlob.value = null
    audioChunks = []
    error.value = ''
  }

  // Get supported MIME type for recording
  const getSupportedMimeType = (): string => {
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

  // Cleanup on unmount
  onUnmounted(() => {
    if (isRecording.value) {
      stopRecording()
    }
    
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop())
    }
    
    if (recordingTimer) {
      clearInterval(recordingTimer)
    }
    
    if (audioUrl.value) {
      URL.revokeObjectURL(audioUrl.value)
    }
  })

  return {
    isRecording,
    hasRecording,
    recordingTime,
    audioUrl,
    audioBlob,
    canRecord,
    error,
    startRecording,
    stopRecording,
    discardRecording
  }
}
