// api/bien.js — Aperçus de partage (WhatsApp, Facebook, iMessage…)
// Sert la page immo-bien.html en remplaçant les balises <title> et Open Graph
// par le vrai titre, la vraie description et la photo du bien demandé.
// Les robots de partage ne lisant pas le JavaScript, l'injection doit se faire côté serveur.

const SUPABASE_URL = 'https://wxhlstificzqovfcumop.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4aGxzdGlmaWN6cW92ZmN1bW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNjcwOTAsImV4cCI6MjA4Njg0MzA5MH0.mt6v3SKPMhWpMw9PH7D8k3ubrR1kJNIFHw0aloLmQiQ';

const TYPE_LABELS = { studio: 'Studio', appartement: 'Appartement', villa: 'Villa', terrain: 'Terrain', local_commercial: 'Local commercial', bureau: 'Bureau' };
const ZONE_LABELS = { anfa: 'Anfa', ain_diab: 'Ain Diab', cfc: 'CFC', bourgogne: 'Bourgogne', bouskoura: 'Bouskoura' };

const escHtml = v => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function sb(path) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` }
  });
  return r.ok ? r.json() : [];
}

export default async function handler(req, res) {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const base = `${proto}://${host}`;
  const ref = (req.query.ref || '').toString().trim();

  // 1. La page statique d'origine (nom interne, non réécrit)
  const pageResp = await fetch(`${base}/immo-bien.html?raw=1`, { headers: { 'x-og-bypass': '1' } });
  let html = await pageResp.text();
  if (!ref) { res.setHeader('Content-Type', 'text/html; charset=utf-8'); return res.status(200).send(html); }

  // 2. Le bien (RLS : seuls les biens publiés sont visibles avec la clé anon)
  const biens = await sb(`immo_biens?reference=eq.${encodeURIComponent(ref)}&select=id,reference,titre,type_bien,zone,quartier,surface_m2,chambres,prix&limit=1`);
  const bien = biens[0];

  if (bien) {
    const photos = await sb(`immo_bien_photos?bien_id=eq.${bien.id}&section=eq.hero&select=storage_path&order=ordre&limit=1`);
    const img = photos[0]
      ? `${SUPABASE_URL}/storage/v1/object/public/immo-photos/${photos[0].storage_path}`
      : null;

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
      .replace('</title>',
        `</title>\n    <meta property="og:url" content="${escHtml(pageUrl)}">` +
        (img ? `\n    <meta property="og:image" content="${escHtml(img)}">\n    <meta name="twitter:card" content="summary_large_image">` : ''));
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
  return res.status(200).send(html);
}
