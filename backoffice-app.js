const SUPABASE_URL = 'https://wxhlstificzqovfcumop.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4aGxzdGlmaWN6cW92ZmN1bW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNjcwOTAsImV4cCI6MjA4Njg0MzA5MH0.mt6v3SKPMhWpMw9PH7D8k3ubrR1kJNIFHw0aloLmQiQ';
const PASSWORD = 'neo2026';
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const COMPANY = {
    name: 'INSTA IMMO', fullName: 'INSTA IMMO SARL', address: '10, rue ibnou Rifai 3 Appt gauche',
    tel: '0687842466', patente: '35700518', rc: '415075', identifiantFiscal: '26185321', ice: '002152608000044',
    bank: 'ATTIJARI, Agence PARANFA', rib: '007 780 0000277000000632 80'
};

let selectedImageFile = null, currentTasksProjectId = null, currentDocsProjectId = null;
let currentDocsProjectName = '', currentClientName = '', docLines = [];

if (sessionStorage.getItem('neo-backoffice-auth') === 'true') showBackoffice();

function checkPassword() {
    if (document.getElementById('password-input').value === PASSWORD) {
        sessionStorage.setItem('neo-backoffice-auth', 'true'); showBackoffice();
    } else document.getElementById('login-error').textContent = 'Mot de passe incorrect';
}

function showBackoffice() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('backoffice-content').classList.add('visible');
    loadProjects();
}

function showToast(msg) {
    const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('visible');
    setTimeout(() => t.classList.remove('visible'), 2000);
}

function esc(s) { return (s || '').replace(/'/g, "\\'").replace(/"/g, '\\"'); }

async function loadProjects() {
    const { data } = await db.from('neo_projects').select('*').order('created_at', { ascending: false });
    const { data: docs } = await db.from('project_documents').select('*');
    const docsMap = {}; (docs || []).forEach(d => { if (!docsMap[d.project_id]) docsMap[d.project_id] = []; docsMap[d.project_id].push(d); });
    const container = document.getElementById('projects-list');
    if (!data?.length) { container.innerHTML = '<div class="empty-state">Aucun projet</div>'; return; }
    container.innerHTML = data.map(p => {
        const pDocs = docsMap[p.id] || [], hasDevis = pDocs.some(d => d.type === 'devis'), hasFacture = pDocs.some(d => d.type === 'facture');
        return `<div class="project-row"><div class="project-row-top"><div class="project-row-info"><div class="project-row-name">${p.name}</div><div class="project-row-meta">${p.client_name || '-'} • <span class="status-badge status-${p.status}">${p.status.replace('_',' ')}</span>${hasDevis?' • 📋':''}${hasFacture?' • 📄':''}</div></div><div class="project-row-actions"><button class="btn btn-docs" onclick="openDocsModal(${p.id},'${esc(p.name)}','${esc(p.client_name)}')">📄 Docs</button><button class="btn btn-tasks" onclick="openTasksModal(${p.id},'${esc(p.name)}')">📋</button><button class="btn btn-edit" onclick="editProject(${p.id})">Modifier</button><button class="btn btn-delete" onclick="deleteProject(${p.id},'${esc(p.name)}')">×</button></div></div></div>`;
    }).join('');
}

function generatePassword() { const c = 'abcdefghijklmnopqrstuvwxyz0123456789'; let p = ''; for (let i = 0; i < 6; i++) p += c[Math.floor(Math.random() * c.length)]; document.getElementById('project_password').value = p; }

function previewImage(input) {
    if (input.files?.[0]) {
        selectedImageFile = input.files[0]; const r = new FileReader();
        r.onload = e => { document.getElementById('image-preview').src = e.target.result; document.getElementById('image-preview').style.display = 'block'; document.getElementById('image-upload-text').textContent = 'Changer'; document.getElementById('image-upload-container').classList.add('has-image'); };
        r.readAsDataURL(input.files[0]);
    }
}

async function compressImage(file) {
    return new Promise(resolve => {
        const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d'), img = new Image();
        img.onload = () => { let w = img.width, h = img.height; if (w > 800) { h = h * 800 / w; w = 800; } if (h > 600) { w = w * 600 / h; h = 600; } canvas.width = w; canvas.height = h; ctx.drawImage(img, 0, 0, w, h); canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.7); };
        img.src = URL.createObjectURL(file);
    });
}

async function uploadImage(file, pid) { const blob = await compressImage(file), name = `project-${pid}-${Date.now()}.jpg`; const { error } = await db.storage.from('project-covers').upload(name, blob, { contentType: 'image/jpeg', upsert: true }); return error ? null : name; }

function openProjectModal(p = null) {
    document.getElementById('project-modal-title').textContent = p ? 'Modifier Projet' : 'Nouveau Projet';
    document.getElementById('project-form').reset(); document.getElementById('project-id').value = p?.id || '';
    selectedImageFile = null; document.getElementById('image-preview').style.display = 'none';
    document.getElementById('image-upload-text').textContent = '📷 Cliquez pour ajouter'; document.getElementById('image-upload-container').classList.remove('has-image');
    if (p) {
        document.getElementById('name').value = p.name || ''; document.getElementById('client_name').value = p.client_name || '';
        document.getElementById('date_start').value = p.date_start || ''; document.getElementById('status').value = p.status || 'a_venir';
        document.getElementById('description').value = p.description || ''; document.getElementById('project_password').value = p.password || '';
        document.getElementById('drive_link').value = p.drive_link || ''; document.getElementById('client_notes').value = p.client_notes || '';
        document.getElementById('total_photos').value = p.total_photos || 0; document.getElementById('selected_photos').value = p.selected_photos || 0;
        document.getElementById('lightroom_total').value = p.lightroom_total || 0; document.getElementById('lightroom_done').value = p.lightroom_done || 0;
        document.getElementById('photoshop_total').value = p.photoshop_total || 0; document.getElementById('photoshop_done').value = p.photoshop_done || 0;
        document.getElementById('davinci_reels').value = p.davinci_reels || 0; document.getElementById('davinci_rendered').value = p.davinci_rendered || 0;
        document.getElementById('payment_percent').value = p.payment_percent || 0; document.getElementById('project_percent').value = p.project_percent || 0;
        if (p.cover_image_path) { const { data } = db.storage.from('project-covers').getPublicUrl(p.cover_image_path); document.getElementById('image-preview').src = data.publicUrl; document.getElementById('image-preview').style.display = 'block'; document.getElementById('image-upload-container').classList.add('has-image'); }
    }
    document.getElementById('project-modal').classList.add('visible');
}

function closeProjectModal() { document.getElementById('project-modal').classList.remove('visible'); }
async function editProject(id) { const { data } = await db.from('neo_projects').select('*').eq('id', id).single(); if (data) openProjectModal(data); }

async function saveProject(e) {
    e.preventDefault(); const btn = document.getElementById('save-btn'); btn.disabled = true; btn.textContent = '...';
    const id = document.getElementById('project-id').value;
    const d = { name: document.getElementById('name').value, client_name: document.getElementById('client_name').value || null, date_start: document.getElementById('date_start').value || null, status: document.getElementById('status').value, description: document.getElementById('description').value || null, password: document.getElementById('project_password').value || null, drive_link: document.getElementById('drive_link').value || null, client_notes: document.getElementById('client_notes').value || null, total_photos: +document.getElementById('total_photos').value || 0, selected_photos: +document.getElementById('selected_photos').value || 0, lightroom_total: +document.getElementById('lightroom_total').value || 0, lightroom_done: +document.getElementById('lightroom_done').value || 0, photoshop_total: +document.getElementById('photoshop_total').value || 0, photoshop_done: +document.getElementById('photoshop_done').value || 0, davinci_reels: +document.getElementById('davinci_reels').value || 0, davinci_rendered: +document.getElementById('davinci_rendered').value || 0, payment_percent: +document.getElementById('payment_percent').value || 0, project_percent: +document.getElementById('project_percent').value || 0 };
    let pid = id;
    if (id) { await db.from('neo_projects').update(d).eq('id', id); } else { const { data } = await db.from('neo_projects').insert([d]).select(); pid = data?.[0]?.id; }
    if (selectedImageFile && pid) { const path = await uploadImage(selectedImageFile, pid); if (path) await db.from('neo_projects').update({ cover_image_path: path }).eq('id', pid); }
    btn.disabled = false; btn.textContent = 'Enregistrer'; closeProjectModal(); loadProjects(); showToast('Projet enregistré');
}

async function deleteProject(id, name) {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    const { data: docIds } = await db.from('project_documents').select('id').eq('project_id', id);
    if (docIds?.length) await db.from('document_lines').delete().in('document_id', docIds.map(x => x.id));
    await db.from('project_documents').delete().eq('project_id', id);
    await db.from('project_tasks').delete().eq('project_id', id);
    await db.from('neo_projects').delete().eq('id', id);
    loadProjects(); showToast('Supprimé');
}

// TASKS
async function openTasksModal(pid, name) { currentTasksProjectId = pid; document.getElementById('tasks-project-name').textContent = name; document.getElementById('tasks-modal').classList.add('visible'); await loadTasks(); }
function closeTasksModal() { document.getElementById('tasks-modal').classList.remove('visible'); }

async function loadTasks() {
    const { data } = await db.from('project_tasks').select('*').eq('project_id', currentTasksProjectId).order('created_at');
    const pending = (data || []).filter(t => !t.done), done = (data || []).filter(t => t.done);
    document.getElementById('tasks-pending').innerHTML = pending.length ? pending.map(t => `<div class="task-item"><div class="task-checkbox" onclick="toggleTask(${t.id},true)"></div><span class="task-text">${t.text}</span><button class="task-delete" onclick="deleteTask(${t.id})">×</button></div>`).join('') : '<div style="padding:10px;color:var(--dim)">Aucune</div>';
    document.getElementById('tasks-completed').innerHTML = done.length ? done.map(t => `<div class="task-item done"><div class="task-checkbox checked" onclick="toggleTask(${t.id},false)"></div><span class="task-text">${t.text}</span><button class="task-delete" onclick="deleteTask(${t.id})">×</button></div>`).join('') : '<div style="padding:10px;color:var(--dim)">Aucune</div>';
}

async function addTask() { const inp = document.getElementById('new-task-input'); if (!inp.value.trim()) return; await db.from('project_tasks').insert([{ project_id: currentTasksProjectId, text: inp.value.trim(), done: false }]); inp.value = ''; loadTasks(); }
async function toggleTask(id, done) { await db.from('project_tasks').update({ done }).eq('id', id); loadTasks(); }
async function deleteTask(id) { await db.from('project_tasks').delete().eq('id', id); loadTasks(); }

// DOCUMENTS
async function openDocsModal(pid, pname, cname) { currentDocsProjectId = pid; currentDocsProjectName = pname; currentClientName = cname || ''; document.getElementById('docs-project-name').textContent = pname; document.getElementById('docs-modal').classList.add('visible'); await loadDocs(); }
function closeDocsModal() { document.getElementById('docs-modal').classList.remove('visible'); }

async function loadDocs() {
    const { data, error } = await db.from('project_documents').select('*').eq('project_id', currentDocsProjectId).order('created_at', { ascending: false });
    if (error) console.error('loadDocs error:', error);
    const c = document.getElementById('docs-list');
    if (!data?.length) { c.innerHTML = '<div class="empty-state">Aucun document</div>'; return; }
    c.innerHTML = data.map(d => {
        const isDevis = d.type === 'devis';
        return `<div class="doc-card"><div class="doc-card-icon">${isDevis ? '📋' : '📄'}</div><div class="doc-card-info"><div class="doc-card-title">${isDevis ? 'Devis' : 'Facture'} ${d.doc_number || ''} <span class="doc-status ${d.status}">${d.status === 'valide' ? 'Validé' : 'Brouillon'}</span></div><div class="doc-card-meta">${d.doc_date || ''}</div></div><div class="doc-card-actions">${d.status !== 'valide' ? `<button class="doc-card-btn btn-edit" onclick="editDoc(${d.id})">Modifier</button>` : ''}<button class="doc-card-btn btn-pdf" onclick="downloadPDF(${d.id})">PDF</button>${isDevis && d.status !== 'valide' ? `<button class="doc-card-btn btn-validate" onclick="validateDevis(${d.id})">✓ Valider</button>` : ''}<button class="doc-card-btn btn-delete" onclick="deleteDoc(${d.id})">×</button></div></div>`;
    }).join('');
}

function openDocEditor(type = 'devis', doc = null) {
    document.getElementById('doc-editor-title').textContent = doc ? 'Modifier ' + (type === 'devis' ? 'Devis' : 'Facture') : 'Nouveau Devis';
    document.getElementById('doc-form').reset();
    document.getElementById('doc-id').value = doc?.id || '';
    document.getElementById('doc-project-id').value = currentDocsProjectId;
    document.getElementById('doc-type').value = type;
    document.getElementById('doc-date').value = doc?.doc_date || new Date().toISOString().split('T')[0];
    document.getElementById('doc-number').value = doc?.doc_number || genDocNum(type);
    document.getElementById('doc-client-name').value = doc?.client_name || currentClientName;
    document.getElementById('doc-client-address').value = doc?.client_address || '';
    document.getElementById('doc-client-ice').value = doc?.client_ice || '';
    document.getElementById('doc-commande-ref').value = doc?.commande_ref || '';
    document.getElementById('doc-tva').value = doc?.tva_rate ?? 20;
    document.getElementById('doc-frais').value = doc?.frais_deplacement || 0;
    document.getElementById('doc-conditions').value = doc?.conditions || 'Intégralité de la facture à la livraison.';
    docLines = doc?.lines?.length ? doc.lines : [{ is_category: false, designation: '', detail: '', quantity: 1, unit_price: 0 }];
    renderDocLines();
    document.getElementById('doc-editor-modal').classList.add('visible');
}
function closeDocEditor() { document.getElementById('doc-editor-modal').classList.remove('visible'); }

function genDocNum(type) { return `${type === 'devis' ? 'DEV' : 'FAC'}-${new Date().getFullYear()}-${String(Math.floor(Math.random()*1000)).padStart(3,'0')}`; }

function renderDocLines() {
    document.getElementById('doc-lines').innerHTML = docLines.map((l, i) => `
        <div class="doc-line ${l.is_category ? 'is-category' : ''}">
            <div style="grid-column:1/-1;margin-bottom:5px"><label style="font-size:0.7rem;color:var(--dim);display:flex;align-items:center;gap:4px;cursor:pointer"><input type="checkbox" ${l.is_category ? 'checked' : ''} onchange="updateLine(${i},'is_category',this.checked)"> Catégorie</label></div>
            <div><input placeholder="${l.is_category ? 'Ex: PHOTOS HDR' : 'Désignation'}" value="${l.designation||''}" onchange="updateLine(${i},'designation',this.value)" style="font-weight:${l.is_category ? '700' : '400'}">${!l.is_category ? `<textarea placeholder="Détail" style="margin-top:5px" onchange="updateLine(${i},'detail',this.value)">${l.detail||''}</textarea>` : ''}</div>
            ${!l.is_category ? `<input type="number" value="${l.quantity||1}" min="1" onchange="updateLine(${i},'quantity',this.value)">` : '<div></div>'}
            ${!l.is_category ? `<input type="number" value="${l.unit_price||0}" min="0" step="0.01" onchange="updateLine(${i},'unit_price',this.value)">` : '<div></div>'}
            <div class="doc-line-total">${l.is_category ? '' : ((l.quantity||1)*(l.unit_price||0)).toFixed(2)}</div>
            <button type="button" class="doc-line-delete" onclick="removeLine(${i})">×</button>
        </div>`).join('');
    calcTotals();
}

function updateLine(i, f, v) { if (f === 'is_category') { docLines[i][f] = v; if (v) { docLines[i].quantity = 0; docLines[i].unit_price = 0; } } else if (f === 'quantity' || f === 'unit_price') docLines[i][f] = +v || 0; else docLines[i][f] = v; renderDocLines(); }
function addDocLine() { docLines.push({ is_category: false, designation: '', detail: '', quantity: 1, unit_price: 0 }); renderDocLines(); }
function removeLine(i) { docLines.splice(i, 1); if (!docLines.length) addDocLine(); renderDocLines(); }

function calcTotals() {
    const ht = docLines.filter(l => !l.is_category).reduce((s, l) => s + (l.quantity || 1) * (l.unit_price || 0), 0);
    const tvaRate = +document.getElementById('doc-tva').value || 20, tvaAmount = ht * tvaRate / 100, frais = +document.getElementById('doc-frais').value || 0;
    document.getElementById('total-ht').textContent = formatMoney(ht);
    document.getElementById('tva-rate').textContent = tvaRate;
    document.getElementById('total-tva').textContent = formatMoney(tvaAmount);
    document.getElementById('total-ttc').textContent = formatMoney(ht + tvaAmount + frais);
}
document.getElementById('doc-tva')?.addEventListener('input', calcTotals);
document.getElementById('doc-frais')?.addEventListener('input', calcTotals);

function formatMoney(n) { return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' MAD'; }

async function saveDocument(e) {
    e.preventDefault();
    const btn = document.getElementById('doc-save-btn');
    btn.disabled = true; btn.textContent = '...';
    
    const docId = document.getElementById('doc-id').value;
    const projectId = currentDocsProjectId;
    
    const docData = {
        project_id: Number(projectId),
        type: document.getElementById('doc-type').value,
        doc_number: document.getElementById('doc-number').value,
        doc_date: document.getElementById('doc-date').value,
        client_name: document.getElementById('doc-client-name').value || '',
        client_address: document.getElementById('doc-client-address').value || '',
        client_ice: document.getElementById('doc-client-ice').value || '',
        commande_ref: document.getElementById('doc-commande-ref').value || '',
        tva_rate: Number(document.getElementById('doc-tva').value) || 20,
        frais_deplacement: Number(document.getElementById('doc-frais').value) || 0,
        conditions: document.getElementById('doc-conditions').value || '',
        status: 'brouillon'
    };
    
    console.log('Saving doc:', docData);
    
    let savedId = docId ? Number(docId) : null;
    
    try {
        if (docId) {
            // Update existing
            const { error } = await db.from('project_documents').update(docData).eq('id', Number(docId));
            if (error) { console.error('Update error:', error); throw error; }
            // Delete old lines
            await db.from('document_lines').delete().eq('document_id', Number(docId));
        } else {
            // Insert new
            const { data, error } = await db.from('project_documents').insert([docData]).select();
            console.log('Insert result:', data, error);
            if (error) { console.error('Insert error:', error); throw error; }
            if (data && data[0]) savedId = data[0].id;
        }
        
        // Insert lines
        if (savedId && docLines.length > 0) {
            const linesToInsert = docLines.map((l, i) => ({
                document_id: Number(savedId),
                is_category: l.is_category === true,
                designation: l.designation || '',
                detail: l.detail || '',
                quantity: Number(l.quantity) || 1,
                unit_price: Number(l.unit_price) || 0,
                sort_order: i
            }));
            console.log('Inserting lines:', linesToInsert);
            const { error: linesError } = await db.from('document_lines').insert(linesToInsert);
            if (linesError) { console.error('Lines error:', linesError); throw linesError; }
        }
        
        showToast('Document enregistré !');
        closeDocEditor();
        loadDocs();
    } catch (err) {
        console.error('Save failed:', err);
        alert('Erreur: ' + (err.message || JSON.stringify(err)));
    }
    
    btn.disabled = false; btn.textContent = 'Enregistrer';
}

async function editDoc(id) { const { data: doc } = await db.from('project_documents').select('*').eq('id', id).single(); const { data: lines } = await db.from('document_lines').select('*').eq('document_id', id).order('sort_order'); if (doc) { doc.lines = lines || []; openDocEditor(doc.type, doc); } }

async function deleteDoc(id) { if (!confirm('Supprimer ?')) return; await db.from('document_lines').delete().eq('document_id', id); await db.from('project_documents').delete().eq('id', id); loadDocs(); showToast('Supprimé'); }

async function validateDevis(id) {
    if (!confirm('Valider ce devis et créer la facture ?')) return;
    const { data: devis } = await db.from('project_documents').select('*').eq('id', id).single();
    const { data: lines } = await db.from('document_lines').select('*').eq('document_id', id).order('sort_order');
    await db.from('project_documents').update({ status: 'valide' }).eq('id', id);
    const facture = { ...devis, type: 'facture', doc_number: genDocNum('facture'), doc_date: new Date().toISOString().split('T')[0], status: 'valide' };
    delete facture.id; delete facture.created_at;
    const { data: newFac } = await db.from('project_documents').insert([facture]).select();
    if (newFac?.[0]?.id && lines?.length) { await db.from('document_lines').insert(lines.map(l => ({ document_id: newFac[0].id, is_category: l.is_category, designation: l.designation, detail: l.detail, quantity: l.quantity, unit_price: l.unit_price, sort_order: l.sort_order }))); }
    loadDocs(); showToast('Devis validé, facture créée !');
}

async function downloadPDF(id) { const { data: doc } = await db.from('project_documents').select('*').eq('id', id).single(); const { data: lines } = await db.from('document_lines').select('*').eq('document_id', id).order('sort_order'); if (doc) generatePDFFromData(doc, lines || []); }

function generatePDF() { const doc = { type: document.getElementById('doc-type').value, doc_number: document.getElementById('doc-number').value, doc_date: document.getElementById('doc-date').value, client_name: document.getElementById('doc-client-name').value, client_address: document.getElementById('doc-client-address').value, client_ice: document.getElementById('doc-client-ice').value, commande_ref: document.getElementById('doc-commande-ref').value, tva_rate: +document.getElementById('doc-tva').value || 20, frais_deplacement: +document.getElementById('doc-frais').value || 0, conditions: document.getElementById('doc-conditions').value }; generatePDFFromData(doc, docLines); }

function generatePDFFromData(doc, lines) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageW = 210, m = 15;
    let y = 15;
    const isFacture = doc.type === 'facture', docLabel = isFacture ? 'FACTURE' : 'DEVIS';

    // Title
    pdf.setFontSize(14); pdf.setFont('helvetica', 'bold');
    pdf.text(`${docLabel} : ${currentDocsProjectName.toUpperCase()}`, pageW / 2, y, { align: 'center' });
    pdf.setLineWidth(0.5); pdf.line(m + 20, y + 2, pageW - m - 20, y + 2);
    y += 15;

    // INSTA IMMO
    pdf.setFontSize(28); pdf.text('INSTA IMMO', pageW / 2, y, { align: 'center' });
    y += 15;

    // Two columns: Client (left) | Doc info (right)
    const midX = pageW / 2;
    pdf.setFontSize(9);
    
    // Left column - Client
    pdf.setFont('helvetica', 'bold'); pdf.text(`${docLabel}É À :`, m, y);
    // Right column - Doc number
    pdf.text(`${docLabel} N° :`, midX + 5, y);
    pdf.setFont('helvetica', 'normal'); pdf.text(doc.doc_number || '', midX + 35, y);
    y += 5;

    // Client name | Date
    pdf.setFont('helvetica', 'normal'); pdf.text(doc.client_name || '', m, y);
    pdf.setFont('helvetica', 'bold'); pdf.text(`DATE ${isFacture ? 'DE LA FACTURE' : 'DU DEVIS'} :`, midX + 5, y);
    pdf.setFont('helvetica', 'normal'); pdf.text(formatDatePDF(doc.doc_date), midX + 50, y);
    y += 5;

    // ICE
    if (doc.client_ice) {
        pdf.setFont('helvetica', 'bold'); pdf.text('ICE :', m, y);
        pdf.setFont('helvetica', 'normal'); pdf.text(doc.client_ice, m + 10, y);
    }
    y += 5;

    // Address | Commande ref
    pdf.setFont('helvetica', 'bold'); pdf.text('Adresse :', m, y);
    pdf.setFont('helvetica', 'normal'); pdf.text(doc.client_address || '', m + 18, y);
    pdf.setFont('helvetica', 'bold'); pdf.text('Relative à la Commande :', midX + 5, y);
    pdf.setFont('helvetica', 'normal'); pdf.text(doc.commande_ref || '', midX + 50, y);
    y += 12;

    // TABLE - Wider columns
    const col1W = 95, col2W = 20, col3W = 25, col4W = 40;
    const tableW = col1W + col2W + col3W + col4W;
    const col1X = m, col2X = m + col1W, col3X = col2X + col2W, col4X = col3X + col3W;

    // Header
    pdf.setFillColor(30, 30, 30);
    pdf.rect(m, y, tableW, 12, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9); pdf.setFont('helvetica', 'bold');
    pdf.text('DÉSIGNATION', col1X + 3, y + 7);
    pdf.text('QTÉ', col2X + 3, y + 7);
    pdf.text('P.U', col3X + 3, y + 7);
    pdf.text('MONTANT', col4X + 3, y + 5);
    pdf.text('MAD HT', col4X + 3, y + 9);
    pdf.setTextColor(0, 0, 0);
    y += 12;

    // Data rows
    let totalHT = 0;
    lines.forEach((l, idx) => {
        const rowH = l.is_category ? 8 : (l.detail ? 14 : 10);
        
        // Draw cell borders
        pdf.setDrawColor(150, 150, 150);
        pdf.rect(col1X, y, col1W, rowH);
        pdf.rect(col2X, y, col2W, rowH);
        pdf.rect(col3X, y, col3W, rowH);
        pdf.rect(col4X, y, col4W, rowH);

        if (l.is_category) {
            // Category row
            pdf.setFillColor(240, 240, 240);
            pdf.rect(col1X + 0.3, y + 0.3, col1W - 0.6, rowH - 0.6, 'F');
            pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9);
            pdf.text((l.designation || '').substring(0, 40), col1X + 3, y + 5.5);
            // Category subtotal
            let catTotal = 0;
            for (let j = idx + 1; j < lines.length && !lines[j].is_category; j++) {
                catTotal += (lines[j].quantity || 1) * (lines[j].unit_price || 0);
            }
            pdf.setTextColor(230, 57, 70);
            pdf.text(formatNum(catTotal), col4X + col4W - 3, y + 5.5, { align: 'right' });
            pdf.setTextColor(0, 0, 0);
        } else {
            const montant = (l.quantity || 1) * (l.unit_price || 0);
            totalHT += montant;
            
            pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9);
            // Designation - truncate if too long
            const desig = (l.designation || '').substring(0, 45);
            pdf.text(desig, col1X + 3, y + 5);
            
            // Detail
            if (l.detail) {
                pdf.setFontSize(7);
                const detailText = pdf.splitTextToSize(l.detail, col1W - 6);
                detailText.slice(0, 2).forEach((dt, di) => {
                    pdf.text(dt, col1X + 3, y + 9 + di * 3);
                });
                pdf.setFontSize(9);
            }
            
            // Quantity centered
            pdf.text(String(l.quantity || 1), col2X + col2W/2, y + 5, { align: 'center' });
            // Price right-aligned
            pdf.text(formatNum(l.unit_price || 0), col3X + col3W - 3, y + 5, { align: 'right' });
            // Montant right-aligned
            pdf.text(formatNum(montant), col4X + col4W - 3, y + 5, { align: 'right' });
        }
        
        y += rowH;
        if (y > 250) { pdf.addPage(); y = 20; }
    });

    // TOTALS - aligned with last two columns
    y += 3;
    const tvaRate = doc.tva_rate || 20;
    const tvaAmount = totalHT * tvaRate / 100;
    const totalPhotoTTC = totalHT + tvaAmount;
    const frais = doc.frais_deplacement || 0;
    const totalTTC = totalPhotoTTC + frais;
    
    const totLabelW = col3W + col4W;
    const totX = col3X;

    const totals = [
        ['TOTAL MAD HT', formatNum(totalHT)],
        [`T.V.A ${tvaRate}%`, formatNum(tvaAmount)],
        ['TOTAL PHOTO TTC', formatNum(totalPhotoTTC)],
        ['FRAIS DE DEPLACEMENT TTC', formatNum(frais)],
        ['TOTAL TTC', formatNum(totalTTC)]
    ];

    totals.forEach((row, i) => {
        pdf.setDrawColor(150, 150, 150);
        pdf.rect(totX, y, col3W, 7);
        pdf.rect(col4X, y, col4W, 7);
        
        pdf.setFont('helvetica', i === 4 ? 'bold' : 'normal');
        pdf.setFontSize(8);
        pdf.text(row[0], totX + 2, y + 5);
        
        if (i === 4) pdf.setTextColor(230, 57, 70);
        pdf.text(row[1], col4X + col4W - 3, y + 5, { align: 'right' });
        pdf.setTextColor(0, 0, 0);
        
        y += 7;
    });

    y += 10;

    // Amount in words
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9);
    pdf.text(`Arrêté le présent ${doc.type} à la somme de :`, m, y);
    y += 5;
    pdf.setFont('helvetica', 'normal');
    pdf.text(numberToWords(totalTTC) + ' dirhams toute taxes comprises.', m, y);
    y += 10;

    // Conditions
    pdf.setFont('helvetica', 'bold');
    pdf.text('Conditions de règlement :', m, y); y += 5;
    pdf.setFont('helvetica', 'normal');
    pdf.text(doc.conditions || '', m, y); y += 10;

    // Payment info
    pdf.setFont('helvetica', 'bold');
    pdf.text('À payer par :', m, y); y += 5;
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Chèque à l'ordre de ${COMPANY.name}`, m, y); y += 4;
    pdf.text(`ou par virement bancaire sur le compte suivant : ${COMPANY.fullName}`, m, y); y += 4;
    pdf.text(`${COMPANY.bank} - N° de compte : RIB : ${COMPANY.rib}`, m, y);
    y += 15;

    // Signature box
    const sigX = pageW - m - 75;
    pdf.setDrawColor(0, 0, 0);
    pdf.rect(sigX, y, 75, 28);
    pdf.setFontSize(8);
    pdf.text('Signature et cachet de l\'entreprise', sigX + 3, y + 6);

    // Footer
    pdf.setFontSize(7);
    const footerY = 287;
    const footer1 = `${COMPANY.fullName} ${COMPANY.address} - Tel : ${COMPANY.tel} - Patente : ${COMPANY.patente} – RC : ${COMPANY.rc}`;
    const footer2 = `– Identifiant fiscal ${COMPANY.identifiantFiscal} ICE : ${COMPANY.ice}`;
    pdf.text(footer1, pageW / 2, footerY, { align: 'center' });
    pdf.text(footer2, pageW / 2, footerY + 4, { align: 'center' });

    pdf.save(`${doc.type}_${doc.doc_number}.pdf`);
}

function formatNum(n) { 
    if (typeof n !== 'number') n = parseFloat(n) || 0;
    return n.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace(/\s/g, '.'); 
}

function formatDatePDF(d) { 
    if (!d) return ''; 
    const parts = d.split('-'); 
    if (parts.length !== 3) return d;
    return `${parts[2]}/${parts[1]}/${parts[0]}`; 
}

function numberToWords(n) {
    const u = ['','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze','treize','quatorze','quinze','seize','dix-sept','dix-huit','dix-neuf'];
    const t = ['','','vingt','trente','quarante','cinquante','soixante','soixante','quatre-vingt','quatre-vingt'];
    n = Math.floor(n); 
    if (n === 0) return 'zéro'; 
    if (n < 20) return u[n];
    if (n < 100) { 
        const x = Math.floor(n/10), r = n%10; 
        if (x === 7 || x === 9) return t[x] + '-' + u[10 + r]; 
        return t[x] + (r === 1 && x !== 8 ? ' et ' : r ? '-' : '') + u[r]; 
    }
    if (n < 1000) { 
        const h = Math.floor(n/100), r = n%100; 
        return (h === 1 ? 'cent' : u[h] + ' cent') + (h > 1 && r === 0 ? 's' : '') + (r ? ' ' + numberToWords(r) : ''); 
    }
    if (n < 1000000) { 
        const th = Math.floor(n/1000), r = n%1000; 
        return (th === 1 ? 'mille' : numberToWords(th) + ' mille') + (r ? ' ' + numberToWords(r) : ''); 
    }
    return n.toString();
}

async function exportToExcel() {
    const { data } = await db.from('neo_projects').select('*').order('created_at', { ascending: false }); 
    if (!data) return;
    const rows = data.map(p => ({ Nom: p.name, Client: p.client_name || '', Statut: p.status, 'Photos Total': p.total_photos, 'Photos Sélect.': p.selected_photos, 'LR Total': p.lightroom_total, 'LR Fait': p.lightroom_done, 'PS Total': p.photoshop_total, 'PS Fait': p.photoshop_done, 'DV Reels': p.davinci_reels, 'DV Rendus': p.davinci_rendered, 'Paiement %': p.payment_percent, 'Progression %': p.project_percent }));
    const ws = XLSX.utils.json_to_sheet(rows), wb = XLSX.utils.book_new(); 
    XLSX.utils.book_append_sheet(wb, ws, 'Projets');
    XLSX.writeFile(wb, `neo-projects-${new Date().toISOString().split('T')[0]}.xlsx`);
}
