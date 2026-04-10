-- =============================================
-- PATCH INSTA IMMO - Permettre zones personnalisées
-- À exécuter dans Supabase SQL Editor après migration.sql
-- =============================================

-- Supprimer la contrainte CHECK sur zone pour permettre zones personnalisées
ALTER TABLE immo_biens DROP CONSTRAINT IF EXISTS immo_biens_zone_check;

-- Supprimer la contrainte CHECK sur agent pour plus de flexibilité
ALTER TABLE immo_biens DROP CONSTRAINT IF EXISTS immo_biens_agent_check;

-- Ajouter colonne signature_data pour les bons de visite signés
ALTER TABLE immo_visites ADD COLUMN IF NOT EXISTS signature_data TEXT;

-- Créer une table pour stocker les zones personnalisées (optionnel)
CREATE TABLE IF NOT EXISTS immo_zones (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  prefix TEXT NOT NULL, -- pour les références: ANFA, AIND, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insérer les zones de base
INSERT INTO immo_zones (code, label, prefix) VALUES
('anfa', 'Anfa', 'ANFA'),
('ain_diab', 'Ain Diab', 'AIND'),
('cfc', 'CFC', 'CFC'),
('bourgogne', 'Bourgogne', 'BOUR'),
('bouskoura', 'Bouskoura', 'BOSK')
ON CONFLICT (code) DO NOTHING;

-- Vérifier que publie a bien une valeur par défaut
ALTER TABLE immo_biens ALTER COLUMN publie SET DEFAULT false;
