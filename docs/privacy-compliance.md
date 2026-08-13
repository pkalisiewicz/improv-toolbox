# Privacy & Compliance Answers

Native App submission answers for App Store Connect and Google Play Console.

Checked against official Apple/Google guidance and SDK docs on 2026-06-20:
- Apple App Privacy Details: https://developer.apple.com/app-store/app-privacy-details/
- Apple User Privacy and Data Use: https://developer.apple.com/app-store/user-privacy-and-data-use/
- Apple Age Ratings: https://developer.apple.com/help/app-store-connect/reference/app-information/age-ratings-values-and-definitions/
- Google Play Data Safety: https://support.google.com/googleplay/android-developer/answer/10787469
- Google Play account deletion: https://support.google.com/googleplay/android-developer/answer/13327111
- Aptabase Apple App Privacy guide: https://aptabase.com/docs/apple-app-privacy
- Aptabase Privacy Policy: https://aptabase.com/legal/privacy
- RevenueCat Apple App Privacy guide: https://www.revenuecat.com/docs/platform-resources/apple-platform-resources/apple-app-privacy
- RevenueCat Google Play Data Safety guide: https://www.revenuecat.com/docs/platform-resources/google-platform-resources/google-plays-data-safety

## Privacy Policy URLs

Use the deployed public privacy page:

- English: `https://www.improv-toolbox.com/privacy`
- Polish: `https://www.skrzynka-improwizatora.pl/privacy`

If a store console allows localized privacy policy URLs, use the matching language URL. If it only allows one app-level URL, use the English URL and keep the Polish URL in the localized listing/support notes where available.
The Czech store listing uses the English privacy URL because there is no Czech public website.

## Apple App Privacy

Question: Do you or your third-party partners collect data from this app?

Answer: Yes.

### Usage Data

Select:

- Usage Data > Product Interaction

Because:

- Aptabase records anonymous usage events such as `app_opened`.

Answers for Product Interaction:

- Purpose: Analytics
- Linked to user identity: No
- Used for tracking: No

Do not select:

- Identifiers > User ID
- Identifiers > Device ID

Rationale:

- Aptabase does not collect device-specific identifiers.
- The App does not send an email, account ID, advertising ID, or custom user ID.

### Purchases

Select:

- Purchases > Purchase History

Because:

- RevenueCat collects purchase history for in-app tips.

Answers for Purchase History:

- Purposes: App Functionality, Analytics
- Linked to user identity: No
- Used for tracking: No

Rationale:

- RevenueCat validates receipts and powers purchase/dashboard functionality.
- The App uses RevenueCat anonymous app user IDs and has no account/email identity to link purchases to.
- There is no ad tracking, IDFA use, data broker sharing, or cross-app tracking.

### Contact Info and User Content

Select:

- Contact Info > Name
- Contact Info > Email Address
- User Content > Other User Content

Because:

- A user may voluntarily send their name, reply email, topic, and message through the in-app contact form.
- Formspree processes the submission and delivers it to the support inbox.

Answers for all three data types:

- Purpose: App Functionality
- Linked to user identity: Yes
- Used for tracking: No
- Collection is optional: the app works without using the contact form

Update this if:

- We later set a custom RevenueCat app user ID tied to an email/account.
- We enable RevenueCat integrations that share purchase data with non-service-provider third parties.
- We add any ad, attribution, or tracking SDK.

## Google Play Data Safety

Question: Does your app collect or share any required user data types?

Answer: Yes.

Security practices:

- Data encrypted in transit: Yes.
- Users can request data deletion: Yes, via the privacy contact email for purchase records where identifiable from receipt/order details.
- Independent security review: No, unless one is completed before submission.

Sharing:

- Shared: No, assuming Aptabase and RevenueCat are used only as service providers for this app under their service terms.
- If we later send data to non-service-provider integrations, exports, ads, attribution, or webhooks, update this answer.

### App Activity

Select:

- App activity > App interactions

Because:

- Aptabase receives anonymous usage events such as app opens.

Answers:

- Collected: Yes
- Shared: No, service-provider assumption above
- Processed ephemerally: No
- Required or optional: Required, because there is no in-app opt-out in v1
- Purposes: Analytics

### Financial Info

Select:

- Financial info > Purchase history

Because:

- RevenueCat receives purchase history for in-app tips.

Answers:

- Collected: Yes
- Shared: No, service-provider assumption above
- Processed ephemerally: No
- Required or optional: Required for users who choose to make an in-app tip purchase
- Purposes: App functionality, Analytics

### Personal Info

Select:

- Personal info > Name
- Personal info > Email address

Answers for both:

- Collected: Yes
- Shared: No, treating Formspree as a service provider that processes submissions for the app
- Processed ephemerally: No
- Required or optional: Optional
- Purposes: App functionality

### Messages

Select:

- Messages > Other in-app messages

Answers:

- Collected: Yes
- Shared: No, under the same service-provider assumption
- Processed ephemerally: No
- Required or optional: Optional
- Purposes: App functionality

Do not select:

- Location
- Photos and videos
- Audio files
- Files and docs
- Calendar
- Contacts
- Web browsing
- App info and performance
- Device or other IDs

Update this if:

- Android crash reporting/diagnostics are added.
- RevenueCat is configured with advertising identifiers or custom IDs.
- More analytics events collect user-entered content or identifiers.

## Google Account Deletion

Question: Does the app allow users to create an account?

Answer: No.

Rationale:

- There is no sign-up, login, username, email identity, password, SSO, 2FA, or account profile.

Account deletion requirement:

- N/A for account deletion, because there are no app accounts.

Data deletion:

- The privacy page tells users how to remove local data.
- The privacy page provides an email path for RevenueCat purchase-data deletion requests where a purchase can be identified.
- Anonymous Aptabase analytics cannot be individually exported/deleted because Aptabase cannot map the anonymous daily-salted data back to a person.

## Age Rating

Conservative answer set based on current app content.

### Apple

Set:

- In-App Purchases: Yes
- User-generated content: No
- Messaging / chat: No
- Advertising: No
- Unrestricted web access: No
- Gambling or contests: No
- Simulated gambling: No
- Loot boxes: No
- Medical / wellness: No
- Sexual content or nudity: No
- Profanity or crude humor: No
- Alcohol, tobacco, or drug use/references: Infrequent/Mild if the questionnaire treats bar/bartender prompts as alcohol references
- Horror or fear themes: Infrequent/Mild
- Violence / violent themes: No graphic violence; if the updated questionnaire asks about violent themes rather than depictions, choose Infrequent/Mild

Expected result:

- Likely 9+ or a region-specific equivalent if Apple counts the horror/fear prompts.
- The earlier checklist expectation of 4+ is possible only if Apple treats the text-only genre prompts as educational/reference material, but 9+ is the safer self-classification.

Content that drives this:

- Genre cards include Horror and Action guidance.
- Scene/story prompts include haunted, prison, funeral, wartime, fear, death, and life-or-death wording.

### Google Play / IARC

Set:

- Digital purchases / in-app purchases: Yes
- Users interact / shares user info / shares location: No
- Ads: No
- Gambling mechanics or simulated gambling: No
- Sexual content: No
- Profanity: No
- Controlled substances: No use or encouragement; at most mild/infrequent bar/bartender references if asked
- Fear / horror: Mild or infrequent text-only references
- Violence: No graphic violence; at most mild/infrequent text-only dramatic themes if asked

Expected result:

- Likely Everyone 10+ or a local equivalent if IARC counts horror/fear themes.
- It may remain Everyone in some regions because there are no images, no gameplay violence, no gambling mechanics, and no user interaction.
