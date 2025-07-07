export interface AudioButtonConfig {
  id: string
  name: string
  endpoint: string
  color: string
  createdAt: string
}

export interface RecordingState {
  isRecording: boolean
  hasRecording: boolean
  recordingTime: number
  audioUrl: string | null
  audioBlob: Blob | null
  canRecord: boolean
  error: string
}

export interface AudioRecordingComposable {
  isRecording: Ref<boolean>
  hasRecording: Ref<boolean>
  recordingTime: Ref<number>
  audioUrl: Ref<string | null>
  audioBlob: Ref<Blob | null>
  canRecord: Ref<boolean>
  error: Ref<string>
  startRecording: () => Promise<void>
  stopRecording: () => void
  discardRecording: () => void
}

export interface LocalStorageComposable {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

import type { Ref } from 'vue'
