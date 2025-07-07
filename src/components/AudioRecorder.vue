<template>
  <div class="recorder-modal">
    <div class="modal-backdrop" @click="close"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ button.name }}</h2>
        <button @click="close" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="recorder-body">
        <div class="recording-status">
          <div class="status-indicator" :class="recordingState">
            <i :class="statusIcon"></i>
          </div>
          <p class="status-text">{{ statusText }}</p>
          <div v-if="isRecording" class="timer">
            {{ formatTime(recordingTime) }}
          </div>
        </div>

        <div class="controls">
          <button
            v-if="!isRecording && !hasRecording"
            @click="startRecording"
            class="control-btn start-btn"
            :disabled="!canRecord"
          >
            <i class="fas fa-microphone"></i>
            Start Recording
          </button>

          <button
            v-if="isRecording"
            @click="stopRecording"
            class="control-btn stop-btn"
          >
            <i class="fas fa-stop"></i>
            Stop Recording
          </button>

          <div v-if="hasRecording && !isRecording" class="recording-actions">
            <button @click="playRecording" class="control-btn play-btn">
              <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
              {{ isPlaying ? 'Pause' : 'Play' }}
            </button>
            <button @click="sendRecording" class="control-btn send-btn" :disabled="isSending">
              <i class="fas fa-paper-plane"></i>
              {{ isSending ? 'Sending...' : 'Send Recording' }}
            </button>
            <button @click="discardRecording" class="control-btn discard-btn">
              <i class="fas fa-trash"></i>
              Discard
            </button>
          </div>
        </div>

        <div v-if="error" class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          {{ error }}
        </div>

        <div v-if="successMessage" class="success-message">
          <i class="fas fa-check-circle"></i>
          {{ successMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAudioRecording } from '../composables/useAudioRecording.ts'
import type { AudioButtonConfig } from '../types/index.ts'

const props = defineProps<{
  button: AudioButtonConfig
}>()

const emit = defineEmits<{
  close: []
  recordingSent: []
}>()

const {
  isRecording,
  hasRecording,
  recordingTime,
  audioUrl,
  audioBlob,
  canRecord,
  error,
  startRecording: startRec,
  stopRecording: stopRec,
  discardRecording: discardRec
} = useAudioRecording()

const isPlaying = ref(false)
const isSending = ref(false)
const successMessage = ref('')
const audioElement = ref<HTMLAudioElement | null>(null)

const recordingState = computed(() => {
  if (isSending.value) return 'sending'
  if (successMessage.value) return 'success'
  if (error.value) return 'error'
  if (isRecording.value) return 'recording'
  if (hasRecording.value) return 'ready'
  return 'idle'
})

const statusIcon = computed(() => {
  switch (recordingState.value) {
    case 'recording': return 'fas fa-microphone pulse'
    case 'ready': return 'fas fa-check-circle'
    case 'sending': return 'fas fa-spinner fa-spin'
    case 'success': return 'fas fa-check-circle'
    case 'error': return 'fas fa-exclamation-triangle'
    default: return 'fas fa-microphone'
  }
})

const statusText = computed(() => {
  switch (recordingState.value) {
    case 'recording': return 'Recording in progress...'
    case 'ready': return 'Recording ready to send'
    case 'sending': return 'Sending recording...'
    case 'success': return 'Recording sent successfully!'
    case 'error': return 'Error occurred'
    default: return 'Ready to record'
  }
})

const startRecording = async () => {
  try {
    await startRec()
  } catch (err) {
    console.error('Failed to start recording:', err)
  }
}

const stopRecording = () => {
  stopRec()
}

const discardRecording = () => {
  if (audioElement.value) {
    audioElement.value.pause()
    isPlaying.value = false
  }
  discardRec()
  successMessage.value = ''
}

const playRecording = () => {
  if (!audioUrl.value) return

  if (!audioElement.value) {
    audioElement.value = new Audio(audioUrl.value)
    audioElement.value.addEventListener('ended', () => {
      isPlaying.value = false
    })
  }

  if (isPlaying.value) {
    audioElement.value.pause()
    isPlaying.value = false
  } else {
    audioElement.value.play()
    isPlaying.value = true
  }
}

const sendRecording = async () => {
  if (!audioBlob.value) return

  isSending.value = true
  error.value = ''
  successMessage.value = ''

  try {
    const formData = new FormData()
    const timestamp = new Date().toISOString()
    const filename = `audio_${timestamp.replace(/[:.]/g, '-')}.webm`
    
    formData.append('audio', audioBlob.value, filename)
    formData.append('buttonName', props.button.name)
    formData.append('timestamp', timestamp)

    const response = await fetch(props.button.endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json, */*'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    successMessage.value = 'Recording sent successfully!'
    
    // Auto-close after success
    setTimeout(() => {
      emit('recordingSent')
    }, 2000)

  } catch (err) {
    error.value = err instanceof Error 
      ? `Failed to send recording: ${err.message}` 
      : 'Failed to send recording. Please check your endpoint URL and try again.'
    console.error('Send recording error:', err)
  } finally {
    isSending.value = false
  }
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const close = () => {
  if (audioElement.value) {
    audioElement.value.pause()
  }
  emit('close')
}

// Handle keyboard shortcuts
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  if (audioElement.value) {
    audioElement.value.pause()
  }
})
</script>

<style scoped>
.recorder-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.modal-header h2 {
  color: #1f2937;
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.recorder-body {
  text-align: center;
}

.recording-status {
  margin-bottom: 2rem;
}

.status-indicator {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  transition: all 0.3s;
}

.status-indicator.idle {
  background: #f3f4f6;
  color: #6b7280;
}

.status-indicator.recording {
  background: #dc2626;
  color: white;
  animation: pulse 1.5s ease-in-out infinite;
}

.status-indicator.ready {
  background: #10b981;
  color: white;
}

.status-indicator.sending {
  background: #3b82f6;
  color: white;
}

.status-indicator.success {
  background: #10b981;
  color: white;
}

.status-indicator.error {
  background: #dc2626;
  color: white;
}

.status-text {
  font-size: 1.1rem;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.timer {
  font-size: 1.5rem;
  font-weight: 600;
  color: #dc2626;
  font-family: 'Courier New', monospace;
}

.controls {
  margin-bottom: 1.5rem;
}

.control-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  margin: 0.25rem;
}

.start-btn {
  background: #3b82f6;
  color: white;
}

.start-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}

.stop-btn {
  background: #dc2626;
  color: white;
}

.stop-btn:hover {
  background: #b91c1c;
  transform: translateY(-1px);
}

.recording-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.play-btn {
  background: #6b7280;
  color: white;
}

.play-btn:hover {
  background: #4b5563;
}

.send-btn {
  background: #10b981;
  color: white;
}

.send-btn:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
}

.discard-btn {
  background: #f3f4f6;
  color: #6b7280;
}

.discard-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.error-message,
.success-message {
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
}

.error-message {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.success-message {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

@media (max-width: 768px) {
  .modal-content {
    padding: 1.5rem;
  }
  
  .recording-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .control-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
