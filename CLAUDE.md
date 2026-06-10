# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Nudge is an Expo / React Native app (iOS, Android, web) for nudging friends. Built with Expo Router (file-based routing), React Native Paper for UI, Firebase for auth + Firestore, and Formik + Yup for forms.

## Commands

```bash
npm install            # install dependencies
npx expo start         # start the dev server (then open iOS / Android / web / Expo Go)
npm run ios            # start targeting iOS simulator
npm run android        # start targeting Android emulator
npm run web            # start targeting web
npm test               # jest in --watchAll mode (jest-expo preset)
npm run lint           # expo lint
```

Run a single test file or test:

```bash
npx jest app/__tests__/signup.test.tsx          # one file
npx jest -t "renders correctly"                  # by test name
```

## Setup

Firebase keys are required to run. Copy `.env.example` to `.env` and fill in the `EXPO_PUBLIC_*` values from the Firebase project. All keys use the `EXPO_PUBLIC_` prefix so they are inlined into the client bundle (read via `process.env.EXPO_PUBLIC_*`). `.env` is gitignored.

## Architecture

- **Routing** — Expo Router with typed routes (`app.json` `experiments.typedRoutes`). Files under `app/` are routes; `app/_layout.tsx` is the root `Stack` (headers hidden) and wraps the app in `PaperProvider` with the app theme (`primary: #83CBC1`, `secondary: #849491`). `app/index.tsx` is home. Screens live in `app/screens/*.tsx` and are referenced by path, e.g. `router.push("/screens/welcome")`. Non-route UI goes in `app/screens/components/`.
- **Firebase** — initialized once in `app/services/config.ts`, which exports `app`, `auth`, `db` (Firestore), and `analytics`. The app instance is named `"nudge-app"`. Import these singletons rather than calling `initializeApp`/`getAuth` again.
- **Auth + persistence** — email/password via Firebase Auth. Login uses `onAuthStateChanged` to redirect already-signed-in users to `/screens/welcome`. Persistence is `browserLocalPersistence`.
- **Firestore data model** — on signup a doc is created in the `Users` collection keyed by `user.uid` with shape `{ userName, friends, outgoingFriendRequests, incomingFriendRequests }`.
- **Forms** — Formik + Yup. Each `TextInput` has a sibling `HelperText` for validation errors, fields use `testID`s, and the submit button is `disabled` based on `errors`. Note: Firebase calls currently live inline in the screen's `onSubmit` — there are repeated `// TODO: Move firebase functions into another file` markers; prefer extracting new data logic out of components.

## Testing conventions

- `@testing-library/react-native`; tests live in `app/__tests__/`.
- Mock Firebase with `jest.mock("firebase/auth")` and mock `expo-font` (`isLoaded: () => true`) to avoid font-loading errors.
- `jest.useFakeTimers()` is used at the top of test files; wrap interactions in `act(...)` inside `waitFor(...)`.
- Assert against elements by `testID`.

## Path alias

`@/*` maps to the repo root (`tsconfig.json`). TypeScript runs in `strict` mode.
