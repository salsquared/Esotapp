# Project Setup Guide

## Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn
- Expo CLI (optional, can use `npx expo`)
- Mobile device with Expo Go, or verify Android/iOS Emulator setup.

## Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd argot
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

## Running the App

To start the development server:

```bash
npx expo start
```

- Press `a` to open in Android Emulator.
- Press `i` to open in iOS Simulator (macOS only).
- Scan the QR code with Expo Go on your physical device.

## Environment Variables

Create a `.env` file in the root directory if necessary (refer to `.env.example`).
