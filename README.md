# Audio Button Creator

Aplikacja frontendowa w Vue.js TypeScript umożliwiająca tworzenie niestandardowych przycisków do nagrywania dźwięku, które wysyłają nagrania do konfigurowalnych endpointów.

## Opis

Audio Button Creator to nowoczesna aplikacja webowa pozwalająca na:

- 🎙️ **Nagrywanie audio** - wykorzystanie mikrofonu przeglądarki do nagrywania dźwięku
- 🎯 **Niestandardowe endpointy** - konfiguracja docelowych adresów URL (n8n, Make, Zapier, IFTTT)
- 🎨 **Personalizacja** - wybór nazwy, koloru i endpointu dla każdego przycisku
- 💾 **Trwałe przechowywanie** - konfiguracje przycisków zapisywane w localStorage
- 📱 **Responsywność** - interfejs dostosowany do urządzeń mobilnych
- ⚡ **Szybkość** - zbudowana na Vite dla optymalnej wydajności

## Technologie

- **Vue.js 3** - framework frontendowy z Composition API
- **TypeScript** - bezpieczność typów i lepsza experience deweloperska
- **Vite** - szybkie budowanie i hot module replacement
- **CSS3** - nowoczesne stylowanie z gradientami i animacjami
- **Web APIs** - MediaRecorder, getUserMedia, localStorage

## Instalacja i uruchomienie

### Wymagania
- Node.js 18+ lub nowszy
- npm lub yarn

### Rozwój lokalny

```bash
# Klonowanie repozytorium
git clone <repository-url>
cd audio-button-creator

# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego
npx vite --config vite.config.js --host 0.0.0.0 --port 5000
```

Aplikacja będzie dostępna pod adresem: `http://localhost:5000`

### Budowanie do produkcji

```bash
# Zbudowanie aplikacji
npx vite build --config vite.config.js

# Podgląd wersji produkcyjnej
npx vite preview
```

Gotowe pliki znajdą się w folderze `dist/` i są przygotowane do wdrożenia na dowolnej platformie hostingu statycznego.

## Struktura projektu

```
src/
├── components/           # Komponenty Vue
│   ├── AudioButton.vue   # Komponent przycisku audio
│   ├── AudioRecorder.vue # Modal nagrywania
│   └── ButtonCreator.vue # Formularz tworzenia przycisku
├── composables/          # Logika Vue Composition API
│   ├── useAudioRecording.ts  # Obsługa nagrywania
│   └── useLocalStorage.ts    # Zarządzanie localStorage
├── types/               # Definicje typów TypeScript
├── utils/               # Funkcje pomocnicze
├── styles/              # Style CSS
├── App.vue              # Główny komponent aplikacji
└── main.ts              # Punkt wejścia aplikacji
```

## Funkcje

### Tworzenie przycisków audio
1. Wprowadź nazwę przycisku
2. Podaj endpoint URL (webhook, API)
3. Wybierz kolor przycisku
4. Kliknij "Create Button"

### Nagrywanie i wysyłanie
1. Kliknij przycisk audio
2. Zezwól na dostęp do mikrofonu
3. Nagrywaj audio (Start/Stop Recording)
4. Odtwórz nagranie (opcjonalnie)
5. Wyślij nagranie do endpointu

### Format wysyłanych danych
Nagrania są wysyłane jako `FormData` z następującymi polami:
- `audio` - plik audio (format WebM/OGG)
- `buttonName` - nazwa przycisku
- `timestamp` - znacznik czasu nagrania

## Kompatybilność przeglądarek

- Chrome 47+
- Firefox 25+
- Safari 14.1+
- Edge 79+

*Wymaga obsługi MediaRecorder API i getUserMedia*

## Wdrożenie

Aplikacja jest w pełni statyczna i może być wdrożona na:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting
- Dowolny serwer HTTP

Pliki z folderu `dist/` skopiuj na serwer - aplikacja działa w podkatalogach dzięki relatywnym ścieżkom assetów.

## Licencja

MIT License - szczegóły w pliku [LICENSE](LICENSE)

## Autor

© 2025 Adam Gąsowski. Wszystkie prawa zastrzeżone.