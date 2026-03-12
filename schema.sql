-- ============================================
-- ATLAS POSE - Schema Supabase
-- À exécuter dans SQL Editor de Supabase
-- ============================================

-- Table des projets
CREATE TABLE atlas_projects (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    client_name TEXT,
    architecte TEXT,
    prescripteur TEXT,
    localisation TEXT,
    adresse TEXT,
    surface_m2 INTEGER DEFAULT 0,
    nb_employes INTEGER DEFAULT 0,
    duree_mois INTEGER DEFAULT 0,
    ca_estimatif DECIMAL(12,2) DEFAULT 0,
    status TEXT DEFAULT 'a_venir' CHECK (status IN ('a_venir', 'en_cours', 'termine')),
    date_debut DATE,
    password TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table budget prévisionnel (devis) par catégorie
CREATE TABLE atlas_budget (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES atlas_projects(id) ON DELETE CASCADE,
    categorie TEXT NOT NULL CHECK (categorie IN (
        'fourniture',
        'colle', 
        'joints',
        'chape',
        'main_oeuvre',
        'transport',
        'mise_en_place',
        'nettoyage',
        'materiel',
        'prorata',
        'aleas'
    )),
    designation TEXT,
    cout_unitaire DECIMAL(10,2) DEFAULT 0,
    quantite DECIMAL(10,2) DEFAULT 0,
    budget_prevu DECIMAL(12,2) DEFAULT 0,
    remarques TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, categorie, designation)
);

-- Table des dépenses réelles
CREATE TABLE atlas_depenses (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES atlas_projects(id) ON DELETE CASCADE,
    categorie TEXT NOT NULL CHECK (categorie IN (
        'fourniture',
        'colle', 
        'joints',
        'chape',
        'main_oeuvre',
        'transport',
        'mise_en_place',
        'nettoyage',
        'materiel',
        'prorata',
        'aleas'
    )),
    designation TEXT NOT NULL,
    quantite DECIMAL(10,2) DEFAULT 1,
    prix_unitaire DECIMAL(10,2) DEFAULT 0,
    montant DECIMAL(12,2) NOT NULL,
    date_depense DATE DEFAULT CURRENT_DATE,
    source TEXT DEFAULT 'manuel' CHECK (source IN ('manuel', 'whatsapp', 'excel')),
    photo_path TEXT,
    fournisseur TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_atlas_budget_project ON atlas_budget(project_id);
CREATE INDEX idx_atlas_depenses_project ON atlas_depenses(project_id);
CREATE INDEX idx_atlas_depenses_date ON atlas_depenses(date_depense);
CREATE INDEX idx_atlas_depenses_categorie ON atlas_depenses(categorie);

-- RLS (Row Level Security) - Allow all pour l'instant
ALTER TABLE atlas_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_depenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all atlas_projects" ON atlas_projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all atlas_budget" ON atlas_budget FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all atlas_depenses" ON atlas_depenses FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- STORAGE BUCKET (à créer dans Storage)
-- Nom: atlas-factures (public)
-- ============================================
