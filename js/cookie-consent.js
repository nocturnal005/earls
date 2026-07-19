/* Earl's Frames London — cookie consent banner.
 *
 * UK PECR/GDPR: strictly-necessary storage (login session, Stripe checkout) is
 * exempt and always allowed. Non-essential cookies (analytics/marketing) must
 * NOT load until the visitor opts in. This banner gates that: analytics only
 * runs after an explicit "Accept". The choice is remembered until changed.
 *
 * Wiring analytics later:
 *   define window.earlsLoadAnalytics = function () { ...inject GA, etc... };
 *   It is called automatically when consent is (or already was) "accepted".
 */
(function () {
  var KEY = 'earls_cookie_consent_v1';

  function getChoice() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw).choice || null) : null;
    } catch (e) { return null; }
  }

  function setChoice(choice) {
    try { localStorage.setItem(KEY, JSON.stringify({ choice: choice, ts: Date.now() })); } catch (e) {}
  }

  // Expose current consent so other scripts can check it.
  window.earlsConsent = window.earlsConsent || {};
  window.earlsConsent.analytics = false;

  function applyConsent(choice) {
    if (choice === 'accepted') {
      window.earlsConsent.analytics = true;
      if (typeof window.earlsLoadAnalytics === 'function') {
        try { window.earlsLoadAnalytics(); } catch (e) {}
      }
    } else {
      window.earlsConsent.analytics = false;
    }
  }

  function injectStyles() {
    if (document.getElementById('earls-cc-styles')) return;
    var css =
      '.earls-cc{position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#1A1A1A;color:#fff;' +
      'font-family:"Source Sans 3",system-ui,sans-serif;box-shadow:0 -4px 24px rgba(0,0,0,.25);padding:18px 20px}' +
      '.earls-cc__inner{max-width:1100px;margin:0 auto;display:flex;gap:18px;align-items:center;flex-wrap:wrap;justify-content:space-between}' +
      '.earls-cc__text{font-size:14px;line-height:1.5;flex:1;min-width:260px;color:#E8E4E0}' +
      '.earls-cc__text a{color:#fff;text-decoration:underline}' +
      '.earls-cc__actions{display:flex;gap:10px;flex-wrap:wrap}' +
      '.earls-cc__btn{padding:10px 18px;border-radius:8px;font-weight:600;font-size:14px;cursor:pointer;' +
      'font-family:inherit;border:1px solid transparent}' +
      '.earls-cc__btn--accept{background:#C41E1E;color:#fff}' +
      '.earls-cc__btn--accept:hover{background:#A31818}' +
      '.earls-cc__btn--reject{background:transparent;color:#fff;border-color:#5a5550}' +
      '.earls-cc__btn--reject:hover{background:#2a2725}' +
      '@media(max-width:640px){.earls-cc__actions{width:100%}.earls-cc__btn{flex:1}}';
    var s = document.createElement('style');
    s.id = 'earls-cc-styles';
    s.textContent = css;
    document.head.appendChild(s);
  }

  // Publish the banner's live height as --earls-cc-h so fixed/bottom-anchored
  // UI (e.g. the Our Work slider arrows) can ride above it while it's shown.
  function publishHeight() {
    var el = document.getElementById('earls-cc');
    var h = el ? el.offsetHeight : 0;
    document.documentElement.style.setProperty('--earls-cc-h', h + 'px');
  }

  function removeBanner() {
    var el = document.getElementById('earls-cc');
    if (el && el.parentNode) el.parentNode.removeChild(el);
    publishHeight();
  }

  function showBanner() {
    injectStyles();
    removeBanner();
    var bar = document.createElement('div');
    bar.className = 'earls-cc';
    bar.id = 'earls-cc';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Cookie consent');
    bar.innerHTML =
      '<div class="earls-cc__inner">' +
        '<div class="earls-cc__text">We use essential cookies to run the site and keep you logged in. ' +
        'With your consent we’d also use analytics cookies to understand how the site is used. ' +
        'See our <a href="cookies.html">Cookie Policy</a> and <a href="privacy.html">Privacy Policy</a>.</div>' +
        '<div class="earls-cc__actions">' +
          '<button type="button" class="earls-cc__btn earls-cc__btn--reject" id="earls-cc-reject">Reject non-essential</button>' +
          '<button type="button" class="earls-cc__btn earls-cc__btn--accept" id="earls-cc-accept">Accept all</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(bar);

    document.getElementById('earls-cc-accept').addEventListener('click', function () {
      setChoice('accepted');
      applyConsent('accepted');
      removeBanner();
    });
    document.getElementById('earls-cc-reject').addEventListener('click', function () {
      setChoice('rejected');
      applyConsent('rejected');
      removeBanner();
    });

    publishHeight();
    window.addEventListener('resize', publishHeight);
  }

  // Let a footer "Cookie settings" link reopen the banner to change the choice.
  window.earlsOpenCookieSettings = function () { showBanner(); };

  function init() {
    var choice = getChoice();
    if (choice) {
      applyConsent(choice); // honour the stored decision (loads analytics if accepted)
    } else {
      showBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
