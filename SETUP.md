# One-time setup for push notifications (Android)

The app code is ready to send and receive nudges, but a few steps must be
done by hand in the Firebase / Expo consoles before pushes work on a real
device.

## 1. Firebase: add an Android app

1. Firebase console → Project settings → **Add app** → Android.
2. Package name: `com.gabrieltu.nudge` (must match `android.package` in `app.json`).
3. Download **google-services.json** into the repo root (it is referenced by
   `app.json` → `android.googleServicesFile`). Commit it — it only contains
   public identifiers, not secrets.

## 2. Firestore: security rules

Firestore → Rules. The app's client-side architecture needs authed users to
read each other's docs (usernames, push tokens) and update each other's
request arrays / nudge timestamps:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /Users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && (
        request.auth.uid == userId ||
        // others may only touch friend-request arrays and nudge timestamps
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(
          ['incomingFriendRequests', 'outgoingFriendRequests', 'friends', 'nudgeTimes']
        )
      );
    }
    match /Nudges/{nudgeId} {
      allow read, create: if request.auth != null;
    }
  }
}
```

## 3. Firestore: composite index

The Activity tab queries `Nudges` by `participants` (array-contains) ordered
by `createdAt`. The first time the query runs, the console error/log includes
a link that creates the index with one click — or create it manually:
collection `Nudges`, fields `participants` (array-contains) + `createdAt`
(descending).

## 4. Expo/EAS: dev build + FCM credentials

```bash
npm install -g eas-cli      # or use npx eas-cli
eas login
eas init                    # links the project, writes extra.eas.projectId into app.json
eas credentials             # Android → push notifications → upload FCM V1 service account key
eas build --profile development --platform android
```

The FCM V1 service account key comes from Firebase console → Project
settings → **Service accounts** → Generate new private key.

When the build finishes, install the APK on your phone/emulator, then run:

```bash
npx expo start --dev-client
```

Notes:
- Push tokens are only fetched on real devices / Play-services emulators and
  never in Expo Go on Android. The app works without them; that device just
  can't receive nudges.
- Web (`npm run web`) supports everything except receiving push
  notifications, vibration, and the image picker permission flow.
