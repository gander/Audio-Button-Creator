<template>
  <div class="app">
    <header class="app-header">
      <h1><i class="fas fa-microphone"></i> Audio Button Creator</h1>
      <p>Create custom audio recording buttons that send recordings to your endpoints</p>
    </header>

    <main class="app-main">
      <!-- Button Creator Section -->
      <section class="creator-section">
        <h2>Create New Audio Button</h2>
        <ButtonCreator @button-created="handleButtonCreated" />
      </section>

      <!-- Buttons List Section -->
      <section class="buttons-section">
        <h2>Your Audio Buttons</h2>
        <div v-if="audioButtons.length === 0" class="empty-state">
          <i class="fas fa-plus-circle"></i>
          <p>No audio buttons yet. Create your first button above!</p>
        </div>
        <div v-else class="buttons-grid">
          <AudioButton
            v-for="button in audioButtons"
            :key="button.id"
            :button="button"
            @edit="handleEditButton"
            @delete="handleDeleteButton"
          />
        </div>
      </section>
    </main>

    <!-- Audio Recorder Modal -->
    <AudioRecorder
      v-if="activeButton"
      :button="activeButton"
      @close="activeButton = null"
      @recording-sent="handleRecordingSent"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ButtonCreator from './components/ButtonCreator.vue'
import AudioButton from './components/AudioButton.vue'
import AudioRecorder from './components/AudioRecorder.vue'
import { useLocalStorage } from './composables/useLocalStorage.ts'
import type { AudioButtonConfig } from './types/index.ts'

const { getItem, setItem } = useLocalStorage()
const audioButtons = ref<AudioButtonConfig[]>([])
const activeButton = ref<AudioButtonConfig | null>(null)

const STORAGE_KEY = 'audio-buttons'

// Load buttons from localStorage on mount
onMounted(() => {
  const stored = getItem(STORAGE_KEY)
  if (stored) {
    audioButtons.value = JSON.parse(stored)
  }
})

// Save buttons to localStorage
const saveButtons = () => {
  setItem(STORAGE_KEY, JSON.stringify(audioButtons.value))
}

// Handle new button creation
const handleButtonCreated = (button: AudioButtonConfig) => {
  audioButtons.value.push(button)
  saveButtons()
}

// Handle button edit
const handleEditButton = (button: AudioButtonConfig) => {
  const index = audioButtons.value.findIndex(b => b.id === button.id)
  if (index !== -1) {
    audioButtons.value[index] = button
    saveButtons()
  }
}

// Handle button deletion
const handleDeleteButton = (buttonId: string) => {
  audioButtons.value = audioButtons.value.filter(b => b.id !== buttonId)
  saveButtons()
}

// Handle recording sent successfully
const handleRecordingSent = () => {
  activeButton.value = null
}

// Expose method to start recording for a button
const startRecording = (button: AudioButtonConfig) => {
  activeButton.value = button
}

// Make startRecording available to child components
defineExpose({ startRecording })
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.app-header {
  text-align: center;
  color: white;
  margin-bottom: 3rem;
}

.app-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.app-header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.app-main {
  max-width: 1200px;
  margin: 0 auto;
}

.creator-section,
.buttons-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.creator-section h2,
.buttons-section h2 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.buttons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .app {
    padding: 1rem;
  }
  
  .creator-section,
  .buttons-section {
    padding: 1.5rem;
  }
  
  .buttons-grid {
    grid-template-columns: 1fr;
  }
}
</style>
