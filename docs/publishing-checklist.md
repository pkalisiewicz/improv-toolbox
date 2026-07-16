# Publishing Checklist — Improv Toolbox Native App

Tracks everything left to ship the Capacitor App to the **App Store** + **Google Play**.
See `docs/adr/0002` / `0003` for the architecture decisions behind this.

**Legend:** ✅ done · 🔄 in progress · ☐ todo — 👤 you · 🤖 me (code) · 🤝 together
**⏰ = critical path** (Google's tester gate is the long pole — start it first).

---

## 0. Done (code + assets) ✅
- ✅ Capacitor 8 foundation, iOS project, bundle id `com.improvtoolbox.app`
- ✅ One bilingual binary (device-locale default, in-app toggle, persisted)
- ✅ Native layer: haptics, Timer local notification, status bar / safe-area, splash
- ✅ RevenueCat tip jar wiring (dynamic tiers) + Aptabase analytics hooks
- ✅ Service worker + PWA-install UI disabled on native
- ✅ App icon + splash generated (`npm run assets:native`)
- ✅ Store screenshots: iOS 6.9" + Android 9:16, EN + PL (`tmp/store-screenshots/`)
- ✅ Committed on branch `feat/native-capacitor-app`

---

## 1. Accounts & keys 👤
- ✅ **Apple Developer Program** enrollment ($99/yr, Individual, ~1–3 days)
- ☐ **Google Play Console** account ($25 one-time, Individual)
- ⏸ **Aptabase** account → app key → add `VITE_APTABASE_KEY` to `.env.local` + prod env; never commit real `.env*` files 🤝 — DEFERRED (2026-07-06): ship 1.0 without analytics
- ✅ **Formspree** free account → contact form created 2026-07-16, public form ID `xdaqeoqa`
  set as `VITE_FORMSPREE_FORM_ID` in `.env.local` (and needed in every production build env —
  Vite inlines `VITE_*` at build time, so a missing ID means the form degrades to
  "temporarily unavailable" with an email fallback). Free tier is 50 submissions/month
- ⏸ **RevenueCat**: production iOS (`appl_…`) + Android (`goog_…`) public keys
  → wire `VITE_RC_IOS_KEY` / `VITE_RC_ANDROID_KEY` from local/prod env 🤝 — DEFERRED (2026-07-06): tip jar stays dormant without keys (code no-ops)
- ✅ Confirm prod builds do **not** set `VITE_RC_TEST_KEY` (test-only) 🤖 — verified 2026-07-12:
  `.env.local` holds only non-`VITE_` Tolgee keys; RC keys exist only (empty) in `.env.example`

---

## 2. In-app purchases (tip jar) 🤝 — DEFERRED (2026-07-06)
Ship 1.0 without live IAP; the tip jar no-ops when no RevenueCat key is set.
Revisit post-launch.
- ✅ App Store Connect: **Paid Applications Agreement** signed + **banking & tax** filled in
  — required even for a free app *because it has IAP* (easy to miss)
- ⏸ App Store Connect: create 3 **consumable** IAP products (e.g. coffee / round / jam) + prices
- ⏸ Play Console: create matching consumables (after Android is set up)
- ⏸ RevenueCat: add the products → create an **Offering** → mark it **current**
- ⏸ Enable the **In-App Purchase capability** on the App ID (Xcode → Signing &
  Capabilities, or developer.apple.com → Identifiers) — required for the tip jar
- ⏸ Verify a live (sandbox/Test Store) purchase reaches the "Thank you!" state 🤖

---

## 3. Android toolchain 👤
- ✅ Install **Android Studio** + SDK + **JDK 21** — verified: signed release AAB built 2026-07-06
- ✅ `npx cap add android` — `android/` project generated + icons/splash 🤖
- ✅ Signing: upload keystore at `~/keystores/improv-toolbox-upload.jks`, wired via
  gitignored `android/key.properties` (enroll in Play App Signing when creating the app in Play Console)

---

## 4. Store listings (EN + PL, both stores) 🤝
- 🔄 App name + subtitle (App Store) / short description (Play) — drafted in `docs/store-listing-draft.md`; needs final review + store entry
- 🔄 Full description (EN + PL) — drafted in `docs/store-listing-draft.md`; needs final review + store entry
- 🔄 Keywords (App Store) · category (**Entertainment** or **Education**) — drafted in `docs/store-listing-draft.md`; needs final review + store entry
- 🔄 Promotional text / "What's new" — drafted in `docs/store-listing-draft.md`; needs final review + store entry
- ☐ Support URL + marketing URL
- ☐ Upload screenshots (already generated) · 1024² marketing icon (have it)

---

## 5. Compliance 🤝
- 🔄 **Privacy policy page** exists at `/privacy`; deploy EN+PL and use URLs from `docs/privacy-compliance.md`
- 🔄 Apple **App Privacy** labels drafted in `docs/privacy-compliance.md`; needs store-console entry
  — NOTE (2026-07-06): with Aptabase + RevenueCat both deferred (no keys in the
  1.0 build), the app collects nothing; you may declare "Data Not Collected"
  for 1.0, but MUST update labels + Data Safety when either key ships. The
  committed `PrivacyInfo.xcprivacy` keeps the fuller declaration so adding the
  keys later needs no manifest change (over-declaring is allowed; under isn't)
- 🔄 Google **Data Safety** form drafted in `docs/privacy-compliance.md`; needs store-console entry
- 🔄 Age rating questionnaire answers drafted in `docs/privacy-compliance.md`; likely 9+ / Everyone 10+ if stores count text-only horror/fear prompts
- ✅ iOS **export compliance**: added `ITSAppUsesNonExemptEncryption = false` to `Info.plist`
  (app only uses standard HTTPS) → skips the per-upload prompt 🤖
- ✅ iOS **privacy manifest** (`PrivacyInfo.xcprivacy`) in the app target —
  declares UserDefaults use (via `@capacitor/preferences`), no tracking 🤖
- ✅ Confirmed `https://www.improv-toolbox.com/privacy` returns 200 with the
  Privacy Policy page for an anonymous client (checked 2026-07-06) 🤖
- 🔄 Account deletion requirement: **N/A** (no accounts) — drafted in `docs/privacy-compliance.md`; needs store-console entry

---

## 6. Pre-submit QA on a real device 🤝
(haptics + IAP can't be verified in the simulator)
- ☐ Haptics fire on wheel spin/land + draws
- ☐ Timer notification fires when the app is backgrounded / phone locked
- ☐ Tip purchase completes (sandbox) → "Thank you!"
- ☐ Language defaults to device locale; toggle persists across relaunch
- ☐ Fully offline (airplane mode)
- ✅ Rotate to landscape on iPhone — RESOLVED 2026-07-12: restricted to **portrait-only**
  in Info.plist (landscape UI was never verified). Also set `TARGETED_DEVICE_FAMILY = 1`
  (**iPhone-only**) — formally targeting iPad would make iPad screenshots mandatory in
  App Store Connect and we only have iPhone 6.9" ones. Both are one-line reverts if
  iPad/landscape support is wanted later

---

## 7. iOS submission 🤝
- ✅ Release **archive builds and signs** (verified 2026-07-06):
  `xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Release -destination 'generic/platform=iOS' -archivePath ios/App/output/App.xcarchive archive DEVELOPMENT_TEAM=<team> -allowProvisioningUpdates` 🤖
- ✅ **Accept the updated Program License Agreement** — done 2026-07-12 (propagation took a few minutes)
- ✅ Distribution cert + profile — created automatically (cloud-managed signing) during export 2026-07-12
- ✅ Export: `App.ipa` at `ios/App/output/export/` (52 MB, signed, iPhone-only/portrait) 2026-07-12
- ✅ Create the app record in App Store Connect — done 2026-07-12 (app ID 6790120737)
- ✅ Upload: 1.0 (1) uploaded 2026-07-12 via `xcodebuild -exportArchive` with
  `destination: upload` (`ios/App/output/exportOptions-upload.plist`) — processing
- ☐ **TestFlight** smoke test → submit for review (~1–3 days)
- Version 1.0 (build 1) already set; 1.0 ships without RevenueCat/Aptabase keys (deferred)

---

## 8. Google Play submission ⏰
- ✅ Build signed **AAB** — rebuilt fresh 2026-07-15 with current code
  (`android/app/build/outputs/bundle/release/app-release.aab`, 50 MB, upload-key signed,
  versionCode 1 / versionName 1.0, JDK 21 + Gradle 8.14.3 `clean bundleRelease`)
- ✅ **Portrait-locked** on Android to match iOS 1.0 — added `android:screenOrientation="portrait"`
  to `MainActivity` (landscape UI was never verified); confirmed compiled into the AAB manifest.
  One-line revert if landscape support is wanted later
- ✅ Internal testing track — AAB + bilingual listing uploaded 2026-07-15 via
  `cd android && fastlane internal` (draft release). Publish path is **fastlane supply**;
  scaffold in `android/fastlane/` (Appfile, Fastfile, EN+PL metadata). Service-account key
  at `~/keystores/play-service-account.json` (gitignored, `PLAY_JSON_KEY`); project
  `woven-diorama-332711`, SA `service@woven-diorama-332711.iam.gserviceaccount.com`
- 🔄 versionCode bumped 1 → 2 (Play dedupes versionCode across ALL tracks; 1 was spent on
  Internal). versionCode 2 staged as a **draft** on the closed (`alpha`) track 2026-07-15 via
  `fastlane closed status:draft`. App is still in Play **"draft" status**, so a completed
  rollout is blocked until app-content declarations are finished in the console (Data Safety,
  content rating, target audience, privacy policy) — console-only, not scriptable. After that:
  `fastlane closed` (completed) rolls out to testers and **starts the 14-consecutive-day clock**
- 🔄 versionCode 3 (2026-07-16): Formspree form ID `xdaqeoqa` wired via `VITE_FORMSPREE_FORM_ID`
  in `.env.local` (gitignored; public endpoint id, not a secret) — Vite inlines `VITE_*` at BUILD
  time, so the contact form needed a rebuild, not a config flip. Verified baked into the shipped
  assets. Existing hand-rolled `fetch` integration kept (do NOT add `@formspree/react` — it would
  drop the i18n validation codes, `_subject`, language/source tagging and the 429 branch).
  vc3 staged as a draft on the closed (`alpha`) track. **⚠️ Data Safety must now declare
  Personal info → Name + Email address, and Messages → Other in-app messages (all Optional,
  App functionality, not shared, encrypted in transit)** — "No data collected" is NO LONGER true
- ☐ **⏰ Closed testing: ≥12 testers opted-in for 14 consecutive days** — REQUIRED before
  production for personal accounts. **Start this ASAP; it gates the launch by ≥2 weeks.**
- ☐ Apply for production access → submit

---

### Suggested order
1. Enroll both accounts + **start recruiting 12 Android testers now** (⏰).
2. RevenueCat + Aptabase keys → I wire them, you create IAP products.
3. Privacy page live → fill App Privacy / Data Safety.
4. iOS: TestFlight → submit (can go live in days).
5. Android: closed test runs in parallel → production once the 14 days clear.
