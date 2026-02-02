# Esotapp

Esotapp is a premium, offline-first vocabulary learning application designed to help users expand their lexicon with style. Built with React Native and Expo, and styled with NativeWind, it offers a sleek, dark-mode-first experience.

## Features

- **📚 Vocab Builder**: Easily add new words and definitions to your personal library.
- **🧠 Interactive Quizzes**: Challenge yourself with various quiz modes to test your retention.
- **🗂️ Word List**: Browse and review your collected words in a clean, organized interface.
- **✨ Premium UI**: A polished dark-themed design using Tailwind CSS for a modern aesthetic.
- **💾 Persistence**: Data is saved locally using Async Storage, ensuring your words are always with you.
- **📳 Haptic Feedback**: Tactile responses for interactions using Expo Haptics.
- **🌍 Multi-Language Support**: Built-in support for diverse languages with flag indicators.
  > **Note**: Full multilingual support is currently in development. The application is fully functional for English vocabulary.

## Part of Speech Color Legend

| Type | Color |
| :--- | :--- |
| **Noun** | 🔵 Blue |
| **Verb** | 🟢 Green |
| **Adjective** | 🟠 Orange |
| **Adverb** | 🔵 Cyan |
| **Pronoun** | 🩷 Pink |
| **Preposition** | 🧼 Teal |
| **Conjunction** | 🟣 Indigo |
| **Interjection/Exclamation** | 🟡 Yellow |
| **Determiner/Article** | ⚫ Gray |
| **Other** | 🔴 Rose |

## Tech Stack

- **Core**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
- **Navigation**: [React Navigation](https://reactnavigation.org/)
- **Storage**: Async Storage

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- [Expo Go](https://expo.dev/client) app installed on your physical device, or an Android Emulator/iOS Simulator.

### Installation

1. **Clone the repository** (or navigate to the directory):
   ```bash
   cd Esotapp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   *Note: This will install all necessary packages including Expo, NativeWind, and React Navigation.*

3. **Start the server**:
   ```bash
   npx expo start
   ```

### Usage

- **Run on Device**: Scan the QR code shown in the terminal with the Expo Go app (Android) or Camera app (iOS).
- **Run on Emulator**: Press `a` (Android) or `i` (iOS) in the terminal after starting the server.

## Project Structure

- `App.js`: Main entry point and navigation setup.
- `screens/`: Contains the main application screens:
  - `Home.js`: Dashboard and main menu.
  - `AddWord.js`: Interface for inputting new vocabulary.
  - `List.js`: Display of all saved words.
  - `Quiz.js`: Game logic for testing vocabulary.
- `utils/`: Helper functions (e.g., language utilities).
- `assets/`: Images and static resources.

## License

This project is open source and available under the [MIT License](LICENSE).
