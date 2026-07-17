/* ============================================================
   INSTA IMMO — Socle commun (immo-core.js)
   Config centralisée + helpers partagés par toutes les pages.
   ============================================================ */

/* ---- Configuration Supabase (clé anon publique, bridée par RLS) ---- */
const SUPABASE_URL = 'https://wxhlstificzqovfcumop.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4aGxzdGlmaWN6cW92ZmN1bW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNjcwOTAsImV4cCI6MjA4Njg0MzA5MH0.mt6v3SKPMhWpMw9PH7D8k3ubrR1kJNIFHw0aloLmQiQ';
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const STORAGE_URL = SUPABASE_URL + '/storage/v1/object/public/immo-photos/';

/* ---- Coordonnées agence ---- */
const AGENCE = {
  nom: 'Insta Immo',
  agent: 'Zouhair Benazzouz',
  ville: 'Casablanca',
  tel: '+212687842466',
  whatsapp: 'https://wa.me/212687842466'
};

/* ---- Sécurité : échappement HTML systématique (anti-XSS) ---- */
function esc(v) {
  if (v === null || v === undefined) return '';
  return String(v)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}
/* Échappe puis convertit les retours à la ligne (pour descriptions) */
function escMultiline(v) { return esc(v).replaceAll('\n', '<br>'); }
/* Pour insérer une valeur dans un attribut d'URL */
function escAttr(v) { return esc(v); }

/* ---- Formats ---- */
const _nf = new Intl.NumberFormat('fr-MA');
function formatMoney(n) { return _nf.format(Number(n) || 0); }
function formatDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return isNaN(dt) ? '—' : dt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}
function formatDateLong(d) {
  const dt = d ? new Date(d) : new Date();
  return dt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}
function formatDateTime(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return isNaN(dt) ? '—' : dt.toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/* ---- Référentiels ---- */
const TYPE_LABELS = { studio: 'Studio', appartement: 'Appartement', villa: 'Villa', terrain: 'Terrain', local_commercial: 'Local commercial', bureau: 'Bureau' };
const ZONE_LABELS = { anfa: 'Anfa', ain_diab: 'Ain Diab', cfc: 'CFC', bourgogne: 'Bourgogne', bouskoura: 'Bouskoura' };
const ETAT_LABELS = { neuf: 'Neuf', bon_etat: 'Bon état', a_renover: 'À rénover' };
const INTERET_LABELS = { tres_interesse: '🔥 Très intéressé', interesse: '👍 Intéressé', bof: '😐 Mitigé', pas_interesse: '👎 Pas intéressé' };
const STATUT_OFFRE = { en_attente: ['En attente', 'orange'], acceptee: ['Acceptée', 'green'], refusee: ['Refusée', 'red'], contre_offre: ['Contre-offre', 'blue'] };
const ETAPE_LABELS = {
  prise_contact: 'Prise de contact', premiere_visite: 'Première visite du bien',
  expertise: 'Expertise & estimation', photos_video: 'Photos & vidéo',
  signature_mandat: 'Signature du mandat', mise_en_ligne: 'Mise en ligne',
  visites: 'Visites acheteurs', offres: 'Réception des offres',
  negociation: 'Négociation', compromis: 'Compromis de vente',
  acte_definitif: 'Acte définitif', commission_encaissee: 'Commission encaissée'
};
const ETAPE_ORDER = Object.keys(ETAPE_LABELS);
const SECTION_LABELS = {
  hero: 'Photos principales', espaces_vie: 'Espaces de vie', chambres: 'Chambres', cuisine: 'Cuisine',
  sdb: 'Salles de bain', exterieurs: 'Extérieurs', annexes: 'Annexes', vues: 'Vues', immeuble: 'Immeuble',
  rdc: 'Rez-de-chaussée', etage_1: 'Étage 1', etage_2: 'Étage 2', sous_sol: 'Sous-sol',
  jardin: 'Jardin', piscine: 'Piscine', garage: 'Garage'
};

/* ---- Divers ---- */
function getYouTubeId(url) {
  if (!url) return null;
  const m = String(url).match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]{6,20})/);
  return m ? m[1] : null;
}
function photoUrl(storagePath) { return STORAGE_URL + String(storagePath).split('/').map(encodeURIComponent).join('/'); }

/* ---- États d'interface ---- */
function uiLoading(target, message) {
  document.getElementById(target).innerHTML =
    `<div class="state"><div class="spinner" aria-hidden="true"></div><p>${esc(message || 'Chargement…')}</p></div>`;
}
function uiError(target, message, detail) {
  document.getElementById(target).innerHTML =
    `<div class="state state-error" role="alert"><p><strong>${esc(message)}</strong></p>${detail ? `<p class="state-detail">${esc(detail)}</p>` : ''}</div>`;
}
