<template>
  <form @submit.prevent="createButton" class="button-creator">
    <div class="form-group">
      <label for="button-name">
        <i class="fas fa-tag"></i>
        Button Name
      </label>
      <input
        id="button-name"
        v-model="formData.name"
        type="text"
        placeholder="e.g., Voice Note, Quick Message"
        required
        maxlength="50"
      />
    </div>

    <div class="form-group">
      <label for="endpoint-url">
        <i class="fas fa-link"></i>
        Endpoint URL
      </label>
      <input
        id="endpoint-url"
        v-model="formData.endpoint"
        type="url"
        placeholder="https://your-endpoint.com/webhook"
        required
      />
      <small class="help-text">
        This URL will receive your audio recordings via POST request
      </small>
    </div>

    <div class="form-group">
      <label for="button-color">
        <i class="fas fa-palette"></i>
        Button Color
      </label>
      <select id="button-color" v-model="formData.color">
        <option value="#3b82f6">Blue</option>
        <option value="#10b981">Green</option>
        <option value="#f59e0b">Orange</option>
        <option value="#ef4444">Red</option>
        <option value="#8b5cf6">Purple</option>
        <option value="#06b6d4">Cyan</option>
      </select>
    </div>

    <button type="submit" class="create-btn" :disabled="!isFormValid">
      <i class="fas fa-plus"></i>
      Create Button
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AudioButtonConfig } from '../types/index.ts'

const emit = defineEmits<{
  buttonCreated: [button: AudioButtonConfig]
}>()

const formData = ref({
  name: '',
  endpoint: '',
  color: '#3b82f6'
})

const isFormValid = computed(() => {
  return formData.value.name.trim() !== '' && 
         formData.value.endpoint.trim() !== '' &&
         isValidUrl(formData.value.endpoint)
})

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const createButton = () => {
  if (!isFormValid.value) return

  const newButton: AudioButtonConfig = {
    id: Date.now().toString(),
    name: formData.value.name.trim(),
    endpoint: formData.value.endpoint.trim(),
    color: formData.value.color,
    createdAt: new Date().toISOString()
  }

  emit('buttonCreated', newButton)
  
  // Reset form
  formData.value = {
    name: '',
    endpoint: '',
    color: '#3b82f6'
  }
}
</script>

<style scoped>
.button-creator {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.help-text {
  color: #6b7280;
  font-size: 0.875rem;
}

.create-btn {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.create-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.create-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

@media (max-width: 768px) {
  .button-creator {
    gap: 1rem;
  }
}
</style>
