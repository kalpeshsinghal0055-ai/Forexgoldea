/* Access gate - ForexGoldEA.
 *
 * Every "get the EA" link used to open the request form straight away, even for someone
 * who had not opened a broker account yet - and the account is what makes the EA free.
 * This asks that question first and sends them the right way.
 *
 * It intercepts the links rather than replacing them, so the hero, the nav button on all
 * 59 pages and every in-article call to action behave the same, and the plain link still
 * works if this script never runs.
 */
(function () {
  'use strict';
  var FORM = 'https://get.forexgoldea.com/get/forexgoldea';
  var XS = 'https://my.xs.com/links/go/5382';
  var box = null;

  function build() {
    if (box) return box;
    box = document.createElement('div');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-labelledby', 'ag-title');
    box.style.cssText =
      'position:fixed;inset:0;z-index:2147483000;display:none;align-items:center;justify-content:center;' +
      'padding:20px;background:rgba(8,9,7,.8);backdrop-filter:blur(4px)';
    box.innerHTML =
      '<div style="max-width:450px;width:100%;background:#171916;border:1px solid #34382f;border-radius:14px;' +
      'padding:30px 28px;font-family:\'DM Sans\',sans-serif;color:#f4f1e9;' +
      'box-shadow:0 26px 64px -22px rgba(0,0,0,.85)">' +
      '<div style="font-size:11.5px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;' +
      'color:#ddba76;margin-bottom:12px">Before the form</div>' +
      '<div id="ag-title" role="heading" aria-level="2" style="margin:0 0 11px;font-size:25px!important;' +
      'font-weight:600;letter-spacing:-.03em;line-height:1.22;color:#f4f1e9">Have you opened an XS account yet?</div>' +
      '<p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#b5b9ad">' +
      'The EA is paid for by partner commission rather than by you, so access is tied to an account ' +
      'opened through our link. Your deposit stays in your own account.</p>' +
      '<div style="display:flex;flex-direction:column;gap:11px">' +
      '<a class="ag-yes" data-no-gate href="' + FORM + '" target="_blank" rel="noopener" ' +
      'style="display:block;text-align:center;padding:14px 20px;border-radius:10px;font-weight:600;font-size:15px;' +
      'text-decoration:none;background:#ddba76;color:#161910">Yes &mdash; open the request form</a>' +
      '<a class="ag-no" href="' + XS + '" target="_blank" rel="sponsored nofollow noopener" ' +
      'style="display:block;text-align:center;padding:14px 20px;border-radius:10px;font-weight:600;font-size:15px;' +
      'text-decoration:none;background:#10120f;border:1px solid #ddba76;color:#ddba76">' +
      'Not yet &mdash; open an XS account &#8599;</a>' +
      '</div>' +
      '<button class="ag-close" type="button" aria-label="Close" ' +
      'style="margin:19px auto 0;display:block;background:none;border:0;color:#868c7c;font-size:13px;cursor:pointer">' +
      'Close</button>' +
      '</div>';
    document.body.appendChild(box);
    box.addEventListener('click', function (e) {
      if (e.target === box || (e.target.className || '').toString().indexOf('ag-close') > -1) close();
    });
    box.querySelector('.ag-yes').addEventListener('click', close);
    box.querySelector('.ag-no').addEventListener('click', close);
    return box;
  }

  function open() {
    build().style.display = 'flex';
    document.documentElement.style.overflow = 'hidden';
    var first = box.querySelector('.ag-yes');
    if (first) first.focus();
  }

  function close() {
    if (box) box.style.display = 'none';
    document.documentElement.style.overflow = '';
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    if (a.href.indexOf('get.forexgoldea.com') === -1) return;
    if (a.hasAttribute('data-no-gate')) return;
    if (box && box.contains(a)) return;          // the dialog's own buttons must pass through
    e.preventDefault();
    open();
  }, true);

  window.FGEAccessGate = { open: open, close: close };
})();
