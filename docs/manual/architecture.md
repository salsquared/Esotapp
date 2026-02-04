# Architecture Overview

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: JavaScript/TypeScript
- **Styling**: NativeWind (TailwindCSS for React Native)
- **Navigation**: React Navigation
- **State Management**: React Hooks (Context API / Local State)
- **Storage**: AsyncStorage (Offline capability)

## Project Structure

- `app.js` / `index.js`: Entry point.
- `src/`: Source code directory.
  - `components/`: Reusable UI components.
  - `screens/`: Main application screens (Home, Quiz, Dictionary, etc.).
  - `utils/`: Helper functions and logic.
  - `assets/`: Static capabilities like images and fonts.

## Key Features

- **Dictionary**: Lookup and save words using an external API.
- **Quiz System**: Review vocabulary through various quiz modes.
- **Offline First**: All user data is persisted locally.
