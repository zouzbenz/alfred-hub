-- =============================================
-- INSTA IMMO - Tables Supabase
-- À exécuter dans Supabase SQL Editor
-- =============================================

-- Bucket pour les photos (à créer manuellement dans Storage)
-- Nom: immo-photos

-- =============================================
-- UTILISATEURS (Agents)
-- =============================================
CREATE TABLE immo_users (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT UNIQUE,
  telephone TEXT,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'agent')),
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Utilisateurs initiaux
INSERT INTO immo_users (nom, prenom, email, telephone, password, role) VALUES
('Benazzou', 'Zouhair', 'zouhair@neostorytellers.com', '+212687842466', 'immo2026', 'admin'),
('Tazi', 'Simo', NULL, NULL, 'simo2026', 'agent');

-- =============================================
-- PROPRIETAIRES
-- =============================================
CREATE TABLE immo_proprietaires (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  prenom TEXT,
  telephone TEXT NOT NULL,
  email TEXT,
  adresse TEXT,
  notes TEXT,
  code_acces TEXT, -- pour espace proprio (prenom+2026)
  source TEXT, -- WhatsApp, Appel, Référence, Meta, LinkedIn, Mubawab, Avito, Autre
  agent TEXT DEFAULT 'zouhair', -- zouhair, simo, commun
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- BIENS
-- =============================================
CREATE TABLE immo_biens (
  id SERIAL PRIMARY KEY,
  reference TEXT UNIQUE NOT NULL, -- ANFA-001, AIND-002, etc.
  titre TEXT NOT NULL,
  
  -- Type & Localisation
  type_bien TEXT NOT NULL CHECK (type_bien IN ('studio', 'appartement', 'villa', 'terrain', 'local_commercial', 'bureau')),
  zone TEXT NOT NULL CHECK (zone IN ('anfa', 'ain_diab', 'cfc', 'bourgogne', 'bouskoura')),
  quartier TEXT,
  adresse TEXT,
  etage INTEGER,
  orientation TEXT, -- Nord, Sud, Est, Ouest, Nord-Est, Nord-Ouest, Sud-Est, Sud-Ouest, Double, Triple
  
  -- Caractéristiques
  surface_m2 DECIMAL(10,2),
  surface_terrain DECIMAL(10,2), -- pour villas/terrains
  chambres INTEGER DEFAULT 0,
  salons INTEGER DEFAULT 0,
  sdb INTEGER DEFAULT 0,
  cuisine TEXT, -- ouverte, fermée, équipée, aménagée
  terrasse_m2 DECIMAL(10,2),
  balcon BOOLEAN DEFAULT false,
  parking INTEGER DEFAULT 0,
  cave BOOLEAN DEFAULT false,
  buanderie BOOLEAN DEFAULT false,
  chambre_personnel BOOLEAN DEFAULT false,
  ascenseur BOOLEAN DEFAULT false,
  gardien BOOLEAN DEFAULT false,
  piscine BOOLEAN DEFAULT false,
  jardin_m2 DECIMAL(10,2),
  annee_construction INTEGER,
  etat TEXT CHECK (etat IN ('neuf', 'bon_etat', 'a_renover')),
  
  -- Description
  description TEXT,
  points_forts TEXT, -- séparés par virgules
  
  -- Médias
  video_youtube TEXT, -- URL YouTube
  video_format TEXT CHECK (video_format IN ('horizontal', 'vertical')),
  visite_virtuelle TEXT, -- URL optionnel
  
  -- Prix & Business
  prix DECIMAL(15,2) NOT NULL,
  negociable BOOLEAN DEFAULT true,
  commission_pct DECIMAL(4,2) DEFAULT 2.00,
  commission_fixe DECIMAL(15,2),
  
  -- Propriétaire
  proprietaire_id INTEGER REFERENCES immo_proprietaires(id),
  relation_proprio TEXT, -- direct, via_agence, via_simo
  
  -- Statut
  statut TEXT DEFAULT 'disponible' CHECK (statut IN ('disponible', 'en_negociation', 'vendu', 'retire')),
  publie BOOLEAN DEFAULT false,
  date_entree DATE DEFAULT CURRENT_DATE,
  date_vente DATE,
  
  -- Agent
  agent TEXT DEFAULT 'zouhair' CHECK (agent IN ('zouhair', 'simo', 'commun')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour référence auto
CREATE INDEX idx_biens_zone ON immo_biens(zone);
CREATE INDEX idx_biens_statut ON immo_biens(statut);
CREATE INDEX idx_biens_type ON immo_biens(type_bien);

-- =============================================
-- PHOTOS DES BIENS
-- =============================================
CREATE TABLE immo_bien_photos (
  id SERIAL PRIMARY KEY,
  bien_id INTEGER REFERENCES immo_biens(id) ON DELETE CASCADE,
  section TEXT NOT NULL, -- hero, espaces_vie, chambres, cuisine, sdb, exterieurs, annexes, vues, immeuble, rdc, etage_1, etage_2, sous_sol, jardin, piscine, garage
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  description TEXT,
  ordre INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_photos_bien ON immo_bien_photos(bien_id);

-- =============================================
-- SECTIONS DESCRIPTIVES DES BIENS
-- =============================================
CREATE TABLE immo_bien_sections (
  id SERIAL PRIMARY KEY,
  bien_id INTEGER REFERENCES immo_biens(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  titre TEXT,
  description TEXT,
  ordre INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ETAPES DU BIEN (Timeline pour proprio)
-- =============================================
CREATE TABLE immo_bien_etapes (
  id SERIAL PRIMARY KEY,
  bien_id INTEGER REFERENCES immo_biens(id) ON DELETE CASCADE,
  etape TEXT NOT NULL, -- prise_contact, premiere_visite, expertise, photos_video, signature_mandat, mise_en_ligne, visites, offres, negociation, compromis, acte_definitif, commission_encaissee
  date_etape DATE NOT NULL,
  notes TEXT,
  completed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CLIENTS (Demandeurs)
-- =============================================
CREATE TABLE immo_clients (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  prenom TEXT,
  telephone TEXT NOT NULL,
  email TEXT,
  
  -- Recherche
  types_souhaites TEXT[], -- array: studio, appartement, villa, etc.
  zones_souhaitees TEXT[], -- array: anfa, ain_diab, etc.
  budget_min DECIMAL(15,2),
  budget_max DECIMAL(15,2),
  surface_min DECIMAL(10,2),
  surface_max DECIMAL(10,2),
  chambres_min INTEGER,
  
  -- Critères obligatoires (checkboxes)
  crit_ascenseur BOOLEAN DEFAULT false,
  crit_parking BOOLEAN DEFAULT false,
  crit_terrasse BOOLEAN DEFAULT false,
  crit_vue_mer BOOLEAN DEFAULT false,
  crit_etage_eleve BOOLEAN DEFAULT false,
  crit_etage_bas BOOLEAN DEFAULT false,
  crit_immeuble_recent BOOLEAN DEFAULT false,
  crit_cuisine_equipee BOOLEAN DEFAULT false,
  crit_double_exposition BOOLEAN DEFAULT false,
  crit_chambre_personnel BOOLEAN DEFAULT false,
  crit_autres TEXT, -- texte libre
  
  -- Critères éliminatoires (checkboxes)
  elim_rdc BOOLEAN DEFAULT false,
  elim_dernier_etage BOOLEAN DEFAULT false,
  elim_vis_a_vis BOOLEAN DEFAULT false,
  elim_proche_mosquee BOOLEAN DEFAULT false,
  elim_travaux BOOLEAN DEFAULT false,
  elim_syndic_defaillant BOOLEAN DEFAULT false,
  elim_pas_garage BOOLEAN DEFAULT false,
  elim_pas_ascenseur BOOLEAN DEFAULT false,
  elim_pas_soleil BOOLEAN DEFAULT false,
  elim_entree_vieille BOOLEAN DEFAULT false,
  elim_autres TEXT, -- texte libre
  
  -- Statut
  statut TEXT DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'en_recherche', 'en_negociation', 'conclu', 'abandonne')),
  source TEXT, -- WhatsApp, Appel, Référence, Meta, LinkedIn, Mubawab, Avito, Autre
  notes TEXT,
  
  -- Accès
  code_acces TEXT, -- prenom+2026
  
  -- Agent
  agent TEXT DEFAULT 'zouhair' CHECK (agent IN ('zouhair', 'simo', 'commun')),
  
  date_premier_contact DATE DEFAULT CURRENT_DATE,
  derniere_interaction DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clients_statut ON immo_clients(statut);
CREATE INDEX idx_clients_agent ON immo_clients(agent);

-- =============================================
-- VISITES
-- =============================================
CREATE TABLE immo_visites (
  id SERIAL PRIMARY KEY,
  bien_id INTEGER REFERENCES immo_biens(id),
  client_id INTEGER REFERENCES immo_clients(id),
  proprietaire_id INTEGER REFERENCES immo_proprietaires(id),
  
  type_visite TEXT NOT NULL CHECK (type_visite IN ('visite_client', 'visite_proprio', 'contre_visite', 'expertise')),
  date_visite TIMESTAMPTZ NOT NULL,
  
  -- Feedback
  interet TEXT CHECK (interet IN ('tres_interesse', 'interesse', 'bof', 'pas_interesse')),
  commentaire TEXT,
  
  -- Bon de visite
  bon_genere BOOLEAN DEFAULT false,
  bon_signe BOOLEAN DEFAULT false,
  bon_document_path TEXT,
  signature_data TEXT, -- base64 de la signature
  
  -- Agent
  agent TEXT DEFAULT 'zouhair',
  notes_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_visites_bien ON immo_visites(bien_id);
CREATE INDEX idx_visites_client ON immo_visites(client_id);
CREATE INDEX idx_visites_date ON immo_visites(date_visite);

-- =============================================
-- OFFRES
-- =============================================
CREATE TABLE immo_offres (
  id SERIAL PRIMARY KEY,
  bien_id INTEGER REFERENCES immo_biens(id),
  client_id INTEGER REFERENCES immo_clients(id),
  
  montant DECIMAL(15,2) NOT NULL,
  date_offre DATE NOT NULL DEFAULT CURRENT_DATE,
  conditions TEXT,
  
  statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'acceptee', 'refusee', 'contre_offre', 'expiree')),
  reponse_proprio TEXT,
  date_reponse DATE,
  
  -- Contre-offre
  contre_offre_montant DECIMAL(15,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_offres_bien ON immo_offres(bien_id);
CREATE INDEX idx_offres_statut ON immo_offres(statut);

-- =============================================
-- TRANSACTIONS (Deals conclus)
-- =============================================
CREATE TABLE immo_transactions (
  id SERIAL PRIMARY KEY,
  bien_id INTEGER REFERENCES immo_biens(id),
  client_id INTEGER REFERENCES immo_clients(id),
  proprietaire_id INTEGER REFERENCES immo_proprietaires(id),
  
  prix_final DECIMAL(15,2) NOT NULL,
  
  date_compromis DATE,
  date_acte_definitif DATE,
  notaire TEXT,
  
  commission_prevue DECIMAL(15,2),
  commission_recue DECIMAL(15,2) DEFAULT 0,
  statut_paiement TEXT DEFAULT 'en_attente' CHECK (statut_paiement IN ('en_attente', 'partiel', 'paye')),
  date_paiement_commission DATE,
  
  agent TEXT DEFAULT 'zouhair',
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DOCUMENTS (PDFs générés)
-- =============================================
CREATE TABLE immo_documents (
  id SERIAL PRIMARY KEY,
  type_doc TEXT NOT NULL CHECK (type_doc IN ('bon_visite', 'mandat_vente', 'mandat_recherche')),
  
  bien_id INTEGER REFERENCES immo_biens(id),
  client_id INTEGER REFERENCES immo_clients(id),
  proprietaire_id INTEGER REFERENCES immo_proprietaires(id),
  visite_id INTEGER REFERENCES immo_visites(id),
  
  numero_doc TEXT,
  date_doc DATE DEFAULT CURRENT_DATE,
  
  storage_path TEXT,
  signe BOOLEAN DEFAULT false,
  signature_data TEXT,
  date_signature DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TACHES (liées à Neo Tasks)
-- =============================================
CREATE TABLE immo_tasks (
  id SERIAL PRIMARY KEY,
  titre TEXT NOT NULL,
  description TEXT,
  
  -- Liaison
  bien_id INTEGER REFERENCES immo_biens(id),
  client_id INTEGER REFERENCES immo_clients(id),
  proprietaire_id INTEGER REFERENCES immo_proprietaires(id),
  
  -- Statut
  done BOOLEAN DEFAULT false,
  priorite TEXT DEFAULT 'normale' CHECK (priorite IN ('basse', 'normale', 'haute', 'urgente')),
  date_echeance DATE,
  
  -- Agent
  agent TEXT DEFAULT 'zouhair',
  
  -- Pour sync avec Neo Tasks
  sync_neo BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_tasks_done ON immo_tasks(done);
CREATE INDEX idx_tasks_agent ON immo_tasks(agent);

-- =============================================
-- FONCTIONS UTILITAIRES
-- =============================================

-- Fonction pour générer la référence automatique
CREATE OR REPLACE FUNCTION generate_bien_reference()
RETURNS TRIGGER AS $$
DECLARE
  zone_prefix TEXT;
  next_num INTEGER;
BEGIN
  -- Déterminer le préfixe selon la zone
  zone_prefix := CASE NEW.zone
    WHEN 'anfa' THEN 'ANFA'
    WHEN 'ain_diab' THEN 'AIND'
    WHEN 'cfc' THEN 'CFC'
    WHEN 'bourgogne' THEN 'BOUR'
    WHEN 'bouskoura' THEN 'BOSK'
    ELSE 'IMMO'
  END;
  
  -- Trouver le prochain numéro pour cette zone
  SELECT COALESCE(MAX(CAST(SUBSTRING(reference FROM '[0-9]+$') AS INTEGER)), 0) + 1
  INTO next_num
  FROM immo_biens
  WHERE reference LIKE zone_prefix || '-%';
  
  -- Générer la référence
  NEW.reference := zone_prefix || '-' || LPAD(next_num::TEXT, 3, '0');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour auto-générer la référence
CREATE TRIGGER trigger_generate_reference
BEFORE INSERT ON immo_biens
FOR EACH ROW
WHEN (NEW.reference IS NULL OR NEW.reference = '')
EXECUTE FUNCTION generate_bien_reference();

-- Fonction pour générer le code d'accès client/proprio
CREATE OR REPLACE FUNCTION generate_code_acces()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.code_acces IS NULL OR NEW.code_acces = '' THEN
    NEW.code_acces := LOWER(COALESCE(NEW.prenom, SPLIT_PART(NEW.nom, ' ', 1))) || '2026';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour auto-générer les codes d'accès
CREATE TRIGGER trigger_code_acces_client
BEFORE INSERT ON immo_clients
FOR EACH ROW
EXECUTE FUNCTION generate_code_acces();

CREATE TRIGGER trigger_code_acces_proprio
BEFORE INSERT ON immo_proprietaires
FOR EACH ROW
EXECUTE FUNCTION generate_code_acces();

-- =============================================
-- VUES UTILES
-- =============================================

-- Vue pour le matching client/bien
CREATE OR REPLACE VIEW v_matching AS
SELECT 
  c.id as client_id,
  c.nom || ' ' || COALESCE(c.prenom, '') as client_nom,
  b.id as bien_id,
  b.reference,
  b.titre,
  b.prix,
  b.zone,
  b.type_bien,
  b.chambres,
  b.surface_m2,
  -- Score de base
  CASE 
    WHEN b.type_bien = ANY(c.types_souhaites) THEN 20 ELSE 0 
  END +
  CASE 
    WHEN b.zone = ANY(c.zones_souhaitees) THEN 20 ELSE 0 
  END +
  CASE 
    WHEN b.prix BETWEEN c.budget_min AND c.budget_max THEN 20
    WHEN b.prix BETWEEN c.budget_min * 0.85 AND c.budget_max * 1.15 THEN 10
    ELSE 0 
  END +
  CASE 
    WHEN b.chambres >= COALESCE(c.chambres_min, 0) THEN 10 ELSE 0 
  END +
  CASE 
    WHEN b.surface_m2 >= COALESCE(c.surface_min, 0) THEN 10 ELSE 0 
  END +
  -- Critères obligatoires
  CASE WHEN c.crit_ascenseur AND b.ascenseur THEN 5 WHEN c.crit_ascenseur AND NOT b.ascenseur THEN -10 ELSE 0 END +
  CASE WHEN c.crit_parking AND b.parking > 0 THEN 5 WHEN c.crit_parking AND b.parking = 0 THEN -10 ELSE 0 END +
  CASE WHEN c.crit_terrasse AND b.terrasse_m2 > 0 THEN 5 WHEN c.crit_terrasse AND COALESCE(b.terrasse_m2, 0) = 0 THEN -10 ELSE 0 END
  AS score
FROM immo_clients c
CROSS JOIN immo_biens b
WHERE b.statut = 'disponible' AND b.publie = true
  AND c.statut IN ('nouveau', 'en_recherche')
ORDER BY score DESC;
