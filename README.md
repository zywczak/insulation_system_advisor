# Insulation System Advisor

## Opis projektu

Insulation System Advisor to interaktywna aplikacja webowa zaprojektowana do pomocy w wyborze optymalnego systemu izolacji dla budynków. Aplikacja prowadzi użytkownika przez wieloetapowy proces oceny potrzeb, analizuje wymagania i rekomenduje najlepsze rozwiązania izolacyjne.

## Główne funkcjonalności

- **Interaktywny wizard** - krok po kroku przewodnik przez proces wyboru systemu izolacji
- **Dynamiczne formularze** - inteligentne pytania dostosowane do kontekstu
- **Analiza wymagań** - ocena priorytetów wydajności, ograniczeń fizycznych i warunków wilgotności
- **System rekomendacji** - mechanizm oceniania i dopasowywania systemów izolacyjnych
- **Generowanie wyników** - szczegółowe rekomendacje z kartami produktów
- **Eksport PDF** - możliwość wygenerowania raportu z rekomendacjami
- **Formularz ofertowy** - bezpośrednie przekazywanie zapytań ofertowych
- **Osadzalność** - możliwość integracji z innymi stronami internetowymi

## Struktura projektu

```
src/
├── components/          # Komponenty React UI
│   ├── DynamicSteps/   # Komponenty dla dynamicznych kroków wizarda
│   ├── Results/        # Komponenty wyświetlania wyników
│   └── StartView/      # Widok początkowy
├── data/               # Dane konfiguracyjne systemów i kroków
│   └── steps/          # Definicje kroków wizarda
├── engine/             # Logika biznesowa oceny i rekomendacji
├── lib/                # Funkcje pomocnicze i utils
├── pages/              # Strony aplikacji
└── types/              # Definicje typów TypeScript
```

## Technologie

- **React** + **TypeScript** - framework UI
- **Vite** - bundler i narzędzie deweloperskie
- **Tailwind CSS** - stylowanie
- **Vitest** - testy jednostkowe
- **ESLint** - linting kodu

## Instalacja

```bash
# Instalacja zależności
npm install

# Uruchomienie w trybie deweloperskim
npm run dev

# Budowanie wersji produkcyjnej
npm run build

# Uruchomienie testów
npm run test
```

## Rozwój

Projekt wykorzystuje React 18+ z TypeScript i nowoczesny stack frontendowy. Aplikacja jest zbudowana w oparciu o architekturę komponentową z wyraźnym podziałem odpowiedzialności:

- **Components** - odpowiedzialne za prezentację
- **Engine** - logika biznesowa i algorytmy oceny
- **Data** - konfiguracja i dane statyczne
- **Types** - bezpieczeństwo typów

## Licencja

[Określ typ licencji]
