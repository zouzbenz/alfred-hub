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
const INTERET_LABELS = { tres_interesse: 'Très intéressé', interesse: 'Intéressé', bof: 'Mitigé', pas_interesse: 'Pas intéressé' };
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
  jardin: 'Jardin', piscine: 'Piscine', garage: 'Garage',
  refonte_ia: 'Projections IA'
};
/* Ordre d'affichage officiel des sections photos (album + lightbox) */
const SECTION_ORDER = ['hero','espaces_vie','cuisine','chambres','sdb','rdc','etage_1','etage_2','sous_sol','terrasse','exterieurs','jardin','piscine','garage','annexes','vues','immeuble','refonte_ia'];
function sectionRank(s){ const i = SECTION_ORDER.indexOf(s); return i === -1 ? 99 : i; }
function sortPhotos(photos){
  return [...photos].sort((a,b) => sectionRank(a.section) - sectionRank(b.section) || (a.ordre||0) - (b.ordre||0) || a.id - b.id);
}

/* ---- Divers ---- */
function getYouTubeId(url) {
  if (!url) return null;
  const m = String(url).match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]{6,20})/);
  return m ? m[1] : null;
}
function photoUrl(storagePath) { return STORAGE_URL + String(storagePath).split('/').map(encodeURIComponent).join('/'); }

/* ---- Icônes SVG traits fins (cartes biens) ---- */
const ICO = {
  surface: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#8A8578" stroke-width="1.3"><rect x="2" y="2" width="12" height="12"/><path d="M2 14 L14 2"/></svg>',
  chambre: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#8A8578" stroke-width="1.3"><path d="M2 12 V7 H14 V12"/><path d="M2 12 H14"/><path d="M4 7 V4 H12 V7"/></svg>',
  sdb: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#8A8578" stroke-width="1.3"><path d="M2 8 H14 V10 A3 3 0 0 1 11 13 H5 A3 3 0 0 1 2 10 Z"/><path d="M4 8 V4 A2 2 0 0 1 8 4"/></svg>',
  parking: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#8A8578" stroke-width="1.3"><path d="M3 10 L4.2 6 H11.8 L13 10"/><rect x="2.5" y="10" width="11" height="3" rx="1"/><circle cx="5" cy="13.6" r="1"/><circle cx="11" cy="13.6" r="1"/></svg>',
  terrasse: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#8A8578" stroke-width="1.3"><circle cx="8" cy="5" r="2.6"/><path d="M8 7.6 V13"/><path d="M5 13 H11"/><path d="M3.5 5 H12.5" opacity=".5"/></svg>',
  cle: '<svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="5.5" cy="5.5" r="3"/><path d="M7.8 7.8 L13.5 13.5"/><path d="M11 11 L13 9"/><path d="M12.5 12.5 L14 11"/></svg>',
  cadenas: '<svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="3" y="7" width="10" height="7" rx="1"/><path d="M5 7 V5 A3 3 0 0 1 11 5 V7"/><circle cx="8" cy="10.5" r="1"/></svg>',
  graphique: '<svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M2 14 H14"/><path d="M4 14 V9"/><path d="M8 14 V5"/><path d="M12 14 V7"/></svg>',
  calendrier: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2" y="3.5" width="12" height="10.5" rx="1"/><path d="M2 7 H14"/><path d="M5.5 2 V5"/><path d="M10.5 2 V5"/></svg>',
  piece: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="8" cy="8" r="5.6"/><path d="M8 5 V11 M6.2 6.5 C6.2 5.6 9.8 5.6 9.8 7 C9.8 8.5 6.2 7.6 6.2 9 C6.2 10.4 9.8 10.4 9.8 9.5"/></svg>',
  cible: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="8" cy="8" r="5.6"/><circle cx="8" cy="8" r="2.8"/><circle cx="8" cy="8" r=".5" fill="currentColor"/></svg>',
  etincelle: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 2 L9.4 6.6 L14 8 L9.4 9.4 L8 14 L6.6 9.4 L2 8 L6.6 6.6 Z"/></svg>',
  maison: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M2.5 7.5 L8 2.5 L13.5 7.5"/><path d="M4 6.5 V13.5 H12 V6.5"/><path d="M6.8 13.5 V9.5 H9.2 V13.5"/></svg>',
  personne: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="8" cy="5" r="2.6"/><path d="M2.8 14 C2.8 10.8 13.2 10.8 13.2 14"/></svg>',
  document: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M4 1.8 H9.5 L12.5 4.8 V14.2 H4 Z"/><path d="M9.5 1.8 V4.8 H12.5"/><path d="M6 8 H10.5 M6 10.5 H10.5"/></svg>',
  coche: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M3 8.5 L6.5 12 L13 4.5"/></svg>',
  plume: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M3 13 C3 8 7 3.5 13 3 C12.5 9 8 13 3 13 Z"/><path d="M3 13 L9 7"/></svg>',
  poignee: '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M2 9 L5.5 5.5 L8 8 M8 8 L10.5 5.5 L14 9 M8 8 L5.8 10.2 M8 8 L10.2 10.2"/></svg>'
};

/* ---- États d'interface ---- */
function uiLoading(target, message) {
  document.getElementById(target).innerHTML =
    `<div class="state"><div class="spinner" aria-hidden="true"></div><p>${esc(message || 'Chargement…')}</p></div>`;
}
function uiError(target, message, detail) {
  document.getElementById(target).innerHTML =
    `<div class="state state-error" role="alert"><p><strong>${esc(message)}</strong></p>${detail ? `<p class="state-detail">${esc(detail)}</p>` : ''}</div>`;
}
