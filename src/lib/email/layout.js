// Bulletproof HTML email design system. Every transactional email in the
// order module is built exclusively from table()/td()/row() so the one
// rule that matters can't be forgotten cell-by-cell: every <table> and
// every <td> carries BOTH a bgcolor attribute AND a background-color
// inline style. Outlook (desktop, Windows) and Apple Mail paint an
// unstyled nested table opaque white regardless of its parent's
// background -- skip this and a dark-themed template goes white-box in
// exactly the two clients most business email arrives in.
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

const INK = '#161616';
const INK_SOFT = '#5b6270';
const BORDER = '#e6e8ec';
const SURFACE = '#ffffff';
const SURFACE_ALT = '#f5f6f8';

export const COLORS = { ink: INK, inkSoft: INK_SOFT, border: BORDER, surface: SURFACE, surfaceAlt: SURFACE_ALT };

// Real anchor buttons render reliably in Outlook; a styled <div onclick>
// does not, since email clients don't run JS. Known wart: table()'s width
// arg appends 'px' unconditionally unless it's exactly '100%', so an
// 'auto'-width inline button needs a string patch after the fact.
export function button(href, label, opts = {}) {
  const { accent = '#5B82D6', full = false } = opts;
  const inner = td(
    accent,
    `background-color:${accent};border-radius:8px;text-align:center;`,
    `<a href="${esc(href)}" style="display:block;padding:14px 28px;font-family:Inter,Arial,sans-serif;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;background-color:${accent};border-radius:8px;">${esc(label)}</a>`
  );
  if (full) return table(accent, `<tr>${inner}</tr>`, 'border-radius:8px;');
  return table(accent, `<tr>${inner}</tr>`, 'border-radius:8px;', 'auto').replace('width:autopx', 'width:auto');
}

export function statusBadge(text, opts = {}) {
  const { bg = '#eef2fb', color = '#3552a6', dot = '#5B82D6' } = opts;
  return `<span style="display:inline-block;padding:5px 12px;border-radius:999px;background-color:${bg};color:${color};font-family:Inter,Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;">
    <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background-color:${dot};margin-right:6px;vertical-align:middle;"></span>${esc(text)}
  </span>`;
}

export function kv(label, value, opts = {}) {
  const { mono = false, strong = false } = opts;
  const valStyle = `font-family:${mono ? "'SF Mono',Consolas,monospace" : 'Inter,Arial,sans-serif'};font-size:14px;color:${INK};${strong ? 'font-weight:700;' : ''}`;
  return row(
    SURFACE,
    `padding:6px 0;border-bottom:1px solid ${BORDER};`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${SURFACE}" style="background-color:${SURFACE};"><tr>
      <td bgcolor="${SURFACE}" style="background-color:${SURFACE};font-family:Inter,Arial,sans-serif;font-size:13px;color:${INK_SOFT};padding-right:12px;white-space:nowrap;">${esc(label)}</td>
      <td bgcolor="${SURFACE}" style="background-color:${SURFACE};${valStyle}text-align:right;">${esc(value)}</td>
    </tr></table>`
  );
}

// Full structural shell: XHTML transitional doctype, color-scheme metas
// (belt and suspenders across clients that read one or the other), an
// iOS-reformatting guard, a hidden preheader with invisible padding
// characters so the inbox preview doesn't leak visible body text, a 600px
// centred content card, and a 620px responsive breakpoint.
export function emailShell({ preheader, bodyHtml, siteName, siteDomain, siteEmail, siteAddress }) {
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
  .be-h1 { font-size:26px; line-height:1.25; }
  @media (max-width:620px) {
    .be-container { width:100% !important; }
    .be-pad { padding-left:20px !important; padding-right:20px !important; }
    .be-h1 { font-size:22px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${SURFACE_ALT};background:${SURFACE_ALT};">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${esc(preheader)}${hiddenPad}</div>
${table(
  SURFACE_ALT,
  row(
    SURFACE_ALT,
    'padding:32px 16px;',
    `<!--[if mso]>
    <table role="presentation" align="center" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="${SURFACE_ALT}" style="width:600px;background-color:${SURFACE_ALT};"><tr><td bgcolor="${SURFACE_ALT}" style="background-color:${SURFACE_ALT};">
    <![endif]-->
    <div class="be-container" style="margin:0 auto;">
      ${table(
        SURFACE,
        row(SURFACE, 'padding:0;', bodyHtml),
        'border-radius:14px;overflow:hidden;border:1px solid ' + BORDER + ';'
      )}
      ${table(
        SURFACE_ALT,
        row(
          SURFACE_ALT,
          'padding:24px 20px;text-align:center;font-family:Inter,Arial,sans-serif;font-size:12px;line-height:1.6;color:' + INK_SOFT + ';',
          `${esc(siteName)}<br/>${esc(siteAddress)}<br/>${esc(siteDomain)} &middot; ${esc(siteEmail)}`
        )
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
