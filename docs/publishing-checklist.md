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
- ⏸ **RevenueCat**: production iOS (`appl_…`) + Android (`goog_…`) public keys
  → wire `VITE_RC_IOS_KEY` / `VITE_RC_ANDROID_KEY` from local/prod env 🤝 — DEFERRED (2026-07-06): tip jar stays dormant without keys (code no-ops)
- ☐ Confirm prod builds do **not** set `VITE_RC_TEST_KEY` (test-only) 🤖

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
- ☐ Install **Android Studio** + SDK + **JDK 21**
- ✅ `npx cap add android` — `android/` project generated + icons/splash 🤖
- ☐ Signing: enroll in **Play App Signing** (recommended) or generate an upload keystore

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
- ☐ Rotate to landscape on iPhone — Info.plist allows it; either verify the UI
  holds up or restrict to portrait before review

---

## 7. iOS submission 🤝
- ✅ Release **archive builds and signs** (verified 2026-07-06):
  `xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Release -destination 'generic/platform=iOS' -archivePath ios/App/output/App.xcarchive archive DEVELOPMENT_TEAM=<team> -allowProvisioningUpdates` 🤖
- ☐ **⛔ BLOCKER: accept the updated Program License Agreement** at
  developer.apple.com / App Store Connect — export fails with "PLA Update
  available" until you do 👤
- ☐ After PLA: distribution cert + profile (Xcode creates them on first
  Distribute; make sure your Apple ID is signed into Xcode → Settings → Accounts)
- ☐ Create the app record in App Store Connect (bundle `com.improvtoolbox.app`)
- ☐ Export + upload: Xcode Organizer → Distribute App, or
  `xcodebuild -exportArchive -archivePath ios/App/output/App.xcarchive -exportPath ios/App/output/export -exportOptionsPlist ios/App/output/exportOptions.plist -allowProvisioningUpdates`
- ☐ **TestFlight** smoke test → submit for review (~1–3 days)
- Version 1.0 (build 1) already set; 1.0 ships without RevenueCat/Aptabase keys (deferred)

---

## 8. Google Play submission ⏰
- ☐ Build signed **AAB**
- ☐ Internal testing track (quick smoke)
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
