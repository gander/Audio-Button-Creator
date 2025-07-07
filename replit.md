# Audio Button Creator

## Overview

The Audio Button Creator is a Vue 3 application built with TypeScript and Vite that allows users to create interactive audio buttons. The application enables users to record audio through their browser's microphone and manage audio button configurations. The system is designed as a client-side application with modern web technologies and follows a component-based architecture.

## System Architecture

### Frontend Architecture
- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite for fast development and optimized builds
- **Language**: TypeScript for type safety and enhanced developer experience
- **Styling**: Custom CSS with modern system fonts and responsive design
- **Icons**: Font Awesome 6.4.0 for UI icons

### Key Design Decisions
- **Vue 3 Composition API**: Chosen for better code organization, reusability, and TypeScript integration
- **Vite**: Selected over webpack for faster development builds and hot module replacement
- **TypeScript**: Implemented for compile-time error checking and better code maintainability
- **Composables Pattern**: Used for sharing reactive logic across components

## Key Components

### Core Composables
1. **useAudioRecording**: Manages audio recording functionality including:
   - MediaRecorder API integration
   - Recording state management
   - Audio format optimization
   - Error handling for unsupported browsers

2. **useLocalStorage**: Provides safe localStorage operations with:
   - Error handling for storage limitations
   - Consistent API for data persistence
   - Graceful degradation when localStorage is unavailable

### Utility Functions
- **audioUtils.ts**: Contains helper functions for:
  - Browser compatibility checking
  - MIME type detection and optimization
  - Duration formatting
  - File extension determination

### Type Definitions
- **AudioButtonConfig**: Defines the structure for audio button configurations
- **RecordingState**: Manages audio recording state interface
- **AudioRecordingComposable**: Type-safe composable interface
- **LocalStorageComposable**: Storage operations interface

## Data Flow

1. **Recording Flow**:
   - User initiates recording through UI
   - useAudioRecording composable requests microphone access
   - MediaRecorder captures audio with optimized settings
   - Audio data is processed and stored as Blob
   - Recording state updates trigger UI changes

2. **Storage Flow**:
   - Audio button configurations stored in localStorage
   - useLocalStorage composable handles all storage operations
   - Error handling ensures graceful degradation

3. **Audio Processing**:
   - Best supported MIME type automatically detected
   - Audio recorded with enhanced quality settings (echo cancellation, noise suppression)
   - Duration tracking and formatting for user feedback

## External Dependencies

### Runtime Dependencies
- **Vue 3.5.17**: Core framework for reactive UI
- **TypeScript 5.8.3**: Type checking and compilation
- **Vite 6.3.5**: Build tool and development server
- **@vitejs/plugin-vue 5.2.4**: Vue support for Vite
- **vue-tsc 3.0.1**: TypeScript checking for Vue files

### CDN Dependencies
- **Font Awesome 6.4.0**: Icon library for UI elements

### Browser APIs
- **MediaDevices.getUserMedia()**: Microphone access
- **MediaRecorder API**: Audio recording functionality
- **localStorage**: Client-side data persistence
- **Blob API**: Audio data handling

## Deployment Strategy

### Build Configuration
- **Target**: ES2020 for modern browser support
- **Module System**: ESNext with bundler resolution
- **Path Mapping**: @ alias for src directory
- **Type Checking**: Strict TypeScript configuration

### Browser Compatibility
- Modern browsers supporting MediaRecorder API
- Graceful degradation for unsupported browsers
- Progressive enhancement approach

### Asset Optimization
- Vite handles code splitting and optimization
- TypeScript compilation for production builds
- CSS bundling and minification

## Changelog
- July 07, 2025: Initial setup
- July 07, 2025: Fixed relative asset paths for subdirectory deployment (base: './' in Vite config)

## User Preferences

Preferred communication style: Simple, everyday language.