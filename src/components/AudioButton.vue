<template>
  <div class="audio-button-card">
    <div class="card-header">
      <div class="button-info">
        <h3>{{ button.name }}</h3>
        <p class="endpoint">{{ truncateUrl(button.endpoint) }}</p>
        <small class="created-date">
          Created: {{ formatDate(button.createdAt) }}
        </small>
      </div>
      <div class="card-actions">
        <button @click="toggleEdit" class="action-btn edit-btn" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button @click="deleteButton" class="action-btn delete-btn" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>

    <!-- Edit Mode -->
    <div v-if="isEditing" class="edit-form">
      <div class="form-group">
        <input
          v-model="editData.name"
          type="text"
          placeholder="Button name"
          maxlength="50"
        />
      </div>
      <div class="form-group">
        <input
          v-model="editData.endpoint"
          type="url"
          placeholder="Endpoint URL"
        />
      </div>
      <div class="form-group">
        <select v-model="editData.color">
          <option value="#3b82f6">Blue</option>
          <option value="#10b981">Green</option>
          <option value="#f59e0b">Orange</option>
          <option value="#ef4444">Red</option>
          <option value="#8b5cf6">Purple</option>
          <option value="#06b6d4">Cyan</option>
        </select>
      </div>
      <div class="edit-actions">
        <button @click="saveEdit" class="save-btn">
          <i class="fas fa-check"></i> Save
        </button>
        <button @click="cancelEdit" class="cancel-btn">
          <i class="fas fa-times"></i> Cancel
        </button>
      </div>
    </div>

    <!-- Record Button -->
    <button
      v-else
      @click="startRecording"
      class="record-btn"
      :style="{ backgroundColor: button.color }"
      :disabled="isRecording"
    >
      <i class="fas fa-microphone"></i>
      <span>{{ isRecording ? 'Recording...' : 'Start Recording' }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AudioButtonConfig } from '../types/index.ts'

const props = defineProps<{
  button: AudioButtonConfig
}>()

const emit = defineEmits<{
  edit: [button: AudioButtonConfig]
  delete: [buttonId: string]
}>()

const isEditing = ref(false)
const isRecording = ref(false)
const editData = ref({
  name: props.button.name,
  endpoint: props.button.endpoint,
  color: props.button.color
})

const toggleEdit = () => {
  if (!isEditing.value) {
    editData.value = {
      name: props.button.name,
      endpoint: props.button.endpoint,
      color: props.button.color
    }
  }
  isEditing.value = !isEditing.value
}

const saveEdit = () => {
  if (editData.value.name.trim() === '' || editData.value.endpoint.trim() === '') {
    return
  }

  const updatedButton: AudioButtonConfig = {
    ...props.button,
    name: editData.value.name.trim(),
    endpoint: editData.value.endpoint.trim(),
    color: editData.value.color
  }

  emit('edit', updatedButton)
  isEditing.value = false
}

const cancelEdit = () => {
  isEditing.value = false
  editData.value = {
    name: props.button.name,
    endpoint: props.button.endpoint,
    color: props.button.color
  }
}

const deleteButton = () => {
  if (confirm(`Are you sure you want to delete "${props.button.name}"?`)) {
    emit('delete', props.button.id)
  }
}

const startRecording = () => {
  // Get the parent component's startRecording method
  const app = document.querySelector('#app').__vue__
  if (app && app.exposed?.startRecording) {
    app.exposed.startRecording(props.button)
  } else {
    // Fallback: dispatch custom event
    window.dispatchEvent(new CustomEvent('start-recording', { 
      detail: props.button 
    }))
  }
}

const truncateUrl = (url: string): string => {
  if (url.length > 40) {
    return url.substring(0, 37) + '...'
  }
  return url
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
.audio-button-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 0.2s;
}

.audio-button-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.button-info h3 {
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
}

.endpoint {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0 0 0.25rem 0;
  word-break: break-all;
}

.created-date {
  color: #9ca3af;
  font-size: 0.75rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.edit-btn {
  background: #f3f4f6;
  color: #6b7280;
}

.edit-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.delete-btn {
  background: #fef2f2;
  color: #dc2626;
}

.delete-btn:hover {
  background: #fecaca;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
}

.save-btn,
.cancel-btn {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.save-btn {
  background: #10b981;
  color: white;
}

.cancel-btn {
  background: #6b7280;
  color: white;
}

.record-btn {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.record-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.record-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .card-actions {
    justify-content: flex-end;
  }
}
</style>
