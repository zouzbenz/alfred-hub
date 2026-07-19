// api/bien.js — Aperçus de partage (WhatsApp, Facebook, iMessage…) — v2
// La page physique s'appelle bien-app.html ; /immo-bien.html et /bien/:ref
// sont réécrits vers cette fonction (vercel.json).

const SUPABASE_URL = 'https://wxhlstificzqovfcumop.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4aGxzdGlmaWN6cW92ZmN1bW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNjcwOTAsImV4cCI6MjA4Njg0MzA5MH0.mt6v3SKPMhWpMw9PH7D8k3ubrR1kJNIFHw0aloLmQiQ';

const TYPE_LABELS = { studio: 'Studio', appartement: 'Appartement', villa: 'Villa', terrain: 'Terrain', local_commercial: 'Local commercial', bureau: 'Bureau' };
const ZONE_LABELS = { anfa: 'Anfa', ain_diab: 'Ain Diab', cfc: 'CFC', bourgogne: 'Bourgogne', bouskoura: 'Bouskoura' };

const escHtml = v => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function sb(path) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` }
    });
    return r.ok ? r.json() : [];
  } catch { return []; }
}

export default async function handler(req, res) {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const base = `${proto}://${host}`;
  const ref = (req.query.ref || '').toString().trim();

  let html;
  try {
    const pageResp = await fetch(`${base}/bien-app.html`);
    if (!pageResp.ok) throw new Error('page introuvable');
    html = await pageResp.text();
  } catch {
    res.setHeader('Location', `/bien-app.html${ref ? '?ref=' + encodeURIComponent(ref) : ''}`);
    return res.status(302).end();
  }

  if (ref) {
    const biens = await sb(`immo_biens?reference=ilike.${encodeURIComponent(ref)}&select=id,reference,titre,type_bien,zone,quartier,surface_m2,chambres,prix&limit=1`);
    const bien = biens[0];

    if (bien) {
      const photos = await sb(`immo_bien_photos?bien_id=eq.${bien.id}&section=eq.hero&select=storage_path&order=ordre&limit=1`);
      let imgTags = '';
      if (photos[0]) {
        const raw = `${SUPABASE_URL}/storage/v1/object/public/immo-photos/${photos[0].storage_path}`;
        const img = `https://wsrv.nl/?url=${encodeURIComponent(raw)}&w=1100&h=580&fit=cover&q=78&output=jpg`;
        imgTags = `\n    <meta property="og:image" content="${escHtml(img)}">` +
                  `\n    <meta property="og:image:width" content="1100">` +
                  `\n    <meta property="og:image:height" content="580">` +
                  `\n    <meta name="twitter:card" content="summary_large_image">` +
                  `\n    <meta name="twitter:image" content="${escHtml(img)}">`;
      }

      const prix = new Intl.NumberFormat('fr-MA').format(bien.prix || 0);
      const title = `${bien.titre} · ${prix} MAD — Insta Immo`;
      const desc = `${TYPE_LABELS[bien.type_bien] || 'Bien'} à ${ZONE_LABELS[bien.zone] || bien.zone}` +
        `${bien.quartier ? ' (' + bien.quartier + ')' : ''}` +
        `${bien.surface_m2 ? ' · ' + bien.surface_m2 + ' m²' : ''}` +
        `${bien.chambres ? ' · ' + bien.chambres + ' ch.' : ''} · Insta Immo Casablanca`;
      const pageUrl = `${base}/bien/${encodeURIComponent(bien.reference)}`;

      html = html
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${escHtml(title)}</title>`)
        .replace(/(<meta name="description" content=")[^"]*(")/, `$1${escHtml(desc)}$2`)
        .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${escHtml(title)}$2`)
        .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${escHtml(desc)}$2`)
        .replace('</title>', `</title>\n    <meta property="og:url" content="${escHtml(pageUrl)}">${imgTags}`);
    }
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
  return res.status(200).send(html);
}
