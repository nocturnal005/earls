// Shared customer-auth helper for the public pages. Keeps the header account
// button in sync with the Supabase session. The full sign-in / account UI
// lives in account.html; this only reflects logged-in state in the header.
(function () {
  var SUPABASE_URL = 'https://nytevdjawjoxqfkafwxg.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55dGV2ZGphd2pveHFma2Fmd3hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MDc3OTQsImV4cCI6MjA5NjQ4Mzc5NH0.wHh0rIioMpwtHWGnYeZn51IMCs5cK1Rohd7QXuc2DNY';

  if (!window.supabase || !window.supabase.createClient) {
    console.warn('[auth] supabase-js not loaded; account button disabled');
    return;
  }

  // One shared client per page (session is stored in localStorage and shared
  // across instances, so account.html can safely create its own too).
  var sb = window.earlsSupabase || window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  window.earlsSupabase = sb;

  async function renderAccountButton() {
    var btn = document.getElementById('header-account-btn');
    if (!btn) return;
    var label = btn.querySelector('.header__account-label');
    try {
      var res = await sb.auth.getSession();
      var session = res && res.data ? res.data.session : null;
      if (session && session.user) {
        var name = (session.user.user_metadata && session.user.user_metadata.first_name) || 'Account';
        if (label) label.textContent = name;
        btn.setAttribute('title', 'My Account');
      } else {
        if (label) label.textContent = 'Log in';
        btn.setAttribute('title', 'Log in / Sign up');
      }
    } catch (e) {
      if (label) label.textContent = 'Log in';
    }
  }

  document.addEventListener('DOMContentLoaded', renderAccountButton);
  sb.auth.onAuthStateChange(function () { renderAccountButton(); });
})();
