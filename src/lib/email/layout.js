// Bulletproof HTML email design system, built on Umbra Electric's own brand
// tokens (see src/app/globals.css :root) so every transactional email reads
// as an extension of the site, not a generic template. Every template is
// built exclusively from table()/td()/row() so the one rule that matters
// can't be forgotten cell-by-cell: every <table> and every <td> carries
// BOTH a bgcolor attribute AND a background-color inline style. Outlook
// (desktop, Windows) and Apple Mail paint an unstyled nested table opaque
// white regardless of its parent's background -- skip this and a dark
// header/footer goes white-box in exactly the two clients most business
// email arrives in.
export function table(bg, inner, extra = '', width = '100%') {
  const w = width === '100%' ? '100%' : `${width}px`;
  return `<table role="presentation" width="${width}" cellpadding="0" cellspacing="0" border="0" bgcolor="${bg}" style="width:${w};border-collapse:collapse;background-color:${bg};${extra}">${inner}</table>`;
}

export function td(bg, style, inner, attrs = '') {
  return `<td bgcolor="${bg}" ${attrs} style="background-color:${bg};${style}">${inner}</td>`;
}

export function row(bg, style, inner, attrs = '') {
  return `<tr>${td(bg, style, inner, attrs)}</tr>`;
}

// Escapes user-supplied/dynamic text before interpolation. Static template
// strings are escaped too for consistency -- cheap insurance. Never run
// this on a value that's already been entity-encoded on purpose.
export function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Umbra Electric's real design tokens (src/app/globals.css :root), carried
// into the one surface CSS custom properties can't reach.
export const COLORS = {
  ink: '#141210',
  inkSoft: '#4A463F',
  line: '#E4DDCF',
  ivory: '#F5F1E9', // page ground, matches body background sitewide
  paper: '#FBF9F4', // slightly-lifted panel tone
  card: '#FFFFFF', // white content surface
  accent: '#5B82D6', // "bronze" token -- the site's real accent blue
  accentDark: '#2C468C',
  ok: '#1f7a3d',
  // legacy aliases so existing template code keeps working
  surface: '#FFFFFF',
  surfaceAlt: '#FBF9F4',
};

const SERIF = "Georgia,'Iowan Old Style','Times New Roman',serif";
const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";

// Pill CTA button matching .btn-primary on the site (ink fill, ivory text,
// fully rounded). Real anchor buttons render reliably in Outlook; a styled
// <div onclick> does not, since email clients don't run JS. Known wart:
// table()'s width arg appends 'px' unconditionally unless it's exactly
// '100%', so an 'auto'-width inline button needs a string patch after.
export function button(href, label, opts = {}) {
  const { bg = COLORS.ink, color = COLORS.ivory, full = false } = opts;
  const inner = td(
    bg,
    `background-color:${bg};border-radius:999px;text-align:center;`,
    `<a href="${esc(href)}" style="display:block;padding:15px 30px;font-family:${SANS};font-size:15px;font-weight:700;letter-spacing:.01em;color:${color};text-decoration:none;background-color:${bg};border-radius:999px;">${esc(label)}</a>`
  );
  if (full) return table(bg, `<tr>${inner}</tr>`, 'border-radius:999px;');
  return table(bg, `<tr>${inner}</tr>`, 'border-radius:999px;', 'auto').replace('width:autopx', 'width:auto');
}

// Small uppercase, letter-spaced pill badge with a solid dot -- the same
// device used for order-status chips in the admin portal, re-tuned to
// email-safe pastel/solid pairs. CSS @keyframes on the dot are gated so it
// degrades to a static dot wherever keyframes aren't supported.
export function statusBadge(text, opts = {}) {
  const { bg = '#EEF2FB', color = COLORS.accentDark, dot = COLORS.accent } = opts;
  return `<span style="display:inline-block;padding:6px 14px;border-radius:999px;background-color:${bg};color:${color};font-family:${SANS};font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;">
    <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background-color:${dot};margin-right:7px;vertical-align:middle;"></span>${esc(text)}
  </span>`;
}

// A certificate-style seal for "PAID IN FULL" -- a double-ruled box rather
// than a rotated rubber-stamp graphic, since CSS transforms are not
// reliably supported across email clients (Outlook ignores them outright).
export function seal(text, opts = {}) {
  const { color = COLORS.ok, bg = '#EAF5EE' } = opts;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" bgcolor="${bg}" style="background-color:${bg};border-radius:10px;border:1.5px solid ${color};">
    <tr><td bgcolor="${bg}" style="background-color:${bg};padding:10px 18px;text-align:center;font-family:${SANS};font-size:12.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:${color};">${esc(text)}</td></tr>
  </table>`;
}

// Label/value row for structured info blocks (order lines, receipt meta,
// invoice details). opts.mono for monospace values (refs, account
// numbers), opts.strong for emphasis, opts.size 'lg' for the hero total row.
export function kv(label, value, opts = {}) {
  const { mono = false, strong = false, size = 'md', bg = COLORS.card } = opts;
  const fontSize = size === 'lg' ? '19px' : '14.5px';
  const valStyle = `font-family:${mono ? "'SF Mono',Consolas,monospace" : SANS};font-size:${fontSize};color:${COLORS.ink};${strong ? 'font-weight:700;' : 'font-weight:500;'}font-variant-numeric:tabular-nums;`;
  return row(
    bg,
    `padding:9px 0;border-bottom:1px solid ${COLORS.line};`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${bg}" style="background-color:${bg};"><tr>
      <td bgcolor="${bg}" style="background-color:${bg};font-family:${SANS};font-size:13.5px;color:${COLORS.inkSoft};padding-right:14px;white-space:nowrap;vertical-align:top;">${esc(label)}</td>
      <td bgcolor="${bg}" style="background-color:${bg};${valStyle}text-align:right;">${esc(value)}</td>
    </tr></table>`
  );
}

// Slim ink-on-ivory strip echoing the site's own top announcement bar --
// the same visual device, reused as a footer bookend so the email reads as
// unmistakably Umbra Electric even scrolled past the header.
export function tagBar(text) {
  return row(
    COLORS.ink,
    'padding:13px 24px;text-align:center;',
    `<span style="font-family:${SANS};font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:${COLORS.ivory};">${esc(text)}</span>`
  );
}

// Brand header: ink bar, centred wordmark. A raster logo would need an
// externally-hosted image (fine in principle, but WebP -- the site's only
// exported logo format -- is not reliably supported in Outlook desktop);
// a styled text wordmark with the accent-coloured bolt glyph renders
// identically everywhere and matches the site's own nav lockup.
function brandBar(siteName) {
  return row(
    COLORS.ink,
    'padding:26px 24px;text-align:center;',
    `<span style="font-family:${SANS};font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:${COLORS.accent};">&#9889;</span>
     <span style="font-family:${SERIF};font-size:17px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:${COLORS.ivory};margin-left:8px;">${esc(siteName)}</span>`
  );
}

// Full structural shell: XHTML transitional doctype, color-scheme metas
// (belt and suspenders across clients that read one or the other), an
// iOS-reformatting guard, a hidden preheader with invisible padding
// characters so the inbox preview doesn't leak visible body text, a 600px
// centred content card sitting on the site's own ivory ground, and a
// 620px responsive breakpoint.
export function emailShell({ preheader, bodyHtml, siteName, siteTagline, siteDomain, siteEmail, siteAddress, legalEntity, taxpayerNumber, verifyUrl }) {
  const hiddenPad = '&#847;&zwnj;&nbsp;'.repeat(20);
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en-US">
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light dark" />
<meta name="supported-color-schemes" content="light dark" />
<meta name="x-apple-disable-message-reformatting" />
<title>${esc(siteName)}</title>
<style>
  :root { color-scheme: light dark; }
  body,table,td,a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table,td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
  img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; }
  body { margin:0; padding:0; width:100% !important; }
  .be-container { width:600px; max-width:600px; }
  .be-pad { padding-left:40px; padding-right:40px; }
  .be-h1 { font-size:27px; line-height:1.22; }
  @media (max-width:620px) {
    .be-container { width:100% !important; }
    .be-pad { padding-left:22px !important; padding-right:22px !important; }
    .be-h1 { font-size:23px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.ivory};background:${COLORS.ivory};">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${esc(preheader)}${hiddenPad}</div>
${table(
  COLORS.ivory,
  row(
    COLORS.ivory,
    'padding:36px 16px;',
    `<!--[if mso]>
    <table role="presentation" align="center" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLORS.ivory}" style="width:600px;background-color:${COLORS.ivory};"><tr><td bgcolor="${COLORS.ivory}" style="background-color:${COLORS.ivory};">
    <![endif]-->
    <div class="be-container" style="margin:0 auto;">
      ${table(
        COLORS.card,
        brandBar(siteName) + row(COLORS.card, 'padding:0;', bodyHtml),
        'border-radius:16px;overflow:hidden;border:1px solid ' + COLORS.line + ';'
      )}
      ${table(
        COLORS.ivory,
        row(
          COLORS.ivory,
          'padding:26px 20px 6px;text-align:center;font-family:' + SANS + ';font-size:12px;line-height:1.7;color:' + COLORS.inkSoft + ';',
          `<strong style="color:${COLORS.ink};">${esc(siteName)}</strong><br/>${esc(siteAddress)}<br/>${esc(siteDomain)} &middot; ${esc(siteEmail)}`
        )
      )}
      ${
        legalEntity && taxpayerNumber
          ? table(
              COLORS.ivory,
              row(
                COLORS.ivory,
                'padding:0 20px 6px;text-align:center;font-family:' + SANS + ';font-size:11px;line-height:1.7;color:' + COLORS.inkSoft + ';',
                `${esc(legalEntity)} &middot; TX Taxpayer #${esc(taxpayerNumber)}${verifyUrl ? ` &middot; <a href="${esc(verifyUrl)}" style="color:${COLORS.accentDark};">Verify</a>` : ''}`
              )
            )
          : ''
      }
      ${table(COLORS.ivory, row(COLORS.ivory, 'padding:18px 0 0;', ''))}
      ${table(
        COLORS.ink,
        tagBar(siteTagline || siteName),
        'border-radius:12px;overflow:hidden;margin-top:8px;'
      )}
    </div>
    <!--[if mso]>
    </td></tr></table>
    <![endif]-->`
  )
)}
</body>
</html>`;
}
