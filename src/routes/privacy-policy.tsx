import { redirect } from 'react-router';

// Alias for the store-console-friendly slug. Vercel 308s this path on the
// deployed domains; this route covers dev, client-side nav, and the native
// WebView, where no server redirect runs.
export function clientLoader() {
  return redirect('/privacy');
}

export default function PrivacyPolicyRedirect() {
  return null;
}
