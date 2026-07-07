# Currency Exchange App

A mobile currency exchange app built with [Angular](https://angular.dev) 22 and [Ionic](https://ionicframework.com) 8, packaged for iOS and Android via [Capacitor](https://capacitorjs.com) 8.

This project uses **Yarn** (Berry, `node-modules` linker) as its package manager — see `.yarnrc.yml`.

## Prerequisites

- Node.js >= 22.22.3 (Angular CLI 22 requirement)
- Yarn (via corepack: `corepack enable && corepack prepare yarn@stable --activate`)
- For iOS builds: Xcode (full app, not just Command Line Tools)
- For Android builds: Android Studio + an Android SDK, and a JDK

## Development

Install dependencies:

```bash
yarn install
```

Run the web dev server:

```bash
yarn start
```

Open `http://localhost:4200/`. The app reloads automatically on source changes.

## Project structure

- `src/app/tabs` – root tab shell (`ion-tabs`)
- `src/app/home` – currency converter tab (placeholder)
- `src/app/settings` – settings tab (placeholder)

Routes are lazy-loaded standalone components under `/tabs/home` and `/tabs/settings` (see `src/app/app.routes.ts`).

## Building for web

```bash
yarn build
```

Output goes to `dist/currency-exchange-app/browser`, which is also the `webDir` Capacitor syncs from.

## Running on iOS / Android

Sync the latest web build into the native projects:

```bash
yarn cap:sync
```

Then open the native IDE to build/run on a device or simulator:

```bash
yarn cap:android   # opens android/ in Android Studio
yarn cap:ios       # opens ios/App/App.xcworkspace in Xcode
```

The `android/` and `ios/` folders are native Capacitor projects checked into this repo. After any change to `capacitor.config.ts` or native plugins, re-run `yarn cap:sync`.

## Running unit tests

```bash
yarn test
```

Tests run via Vitest (Angular's `@angular/build:unit-test` builder). `vitest-base.config.ts` inlines the `@ionic/*` and `ionicons` packages so their directory-style ESM exports resolve correctly under Vitest's Node environment.
