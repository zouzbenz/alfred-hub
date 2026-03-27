-- =============================================
-- FINANCE HUB - Tables Supabase
-- À exécuter dans Supabase SQL Editor
-- =============================================

-- Transactions (entrées + sorties)
CREATE TABLE finance_transactions (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('depense', 'revenu')),
  categorie TEXT NOT NULL,
  designation TEXT NOT NULL,
  montant DECIMAL(12,2) NOT NULL,
  date_transaction DATE NOT NULL,
  pro_perso TEXT NOT NULL CHECK (pro_perso IN ('pro', 'perso')),
  mode_paiement TEXT DEFAULT 'cash' CHECK (mode_paiement IN ('cash', 'formel')),
  source TEXT,
  notes TEXT,
  sender_name TEXT,
  entry_method TEXT DEFAULT 'backoffice',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budgets mensuels par catégorie
CREATE TABLE finance_budgets (
  id SERIAL PRIMARY KEY,
  categorie TEXT NOT NULL UNIQUE,
  budget_mensuel DECIMAL(12,2) NOT NULL,
  pro_perso TEXT NOT NULL CHECK (pro_perso IN ('pro', 'perso')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dépenses récurrentes / à venir
CREATE TABLE finance_scheduled (
  id SERIAL PRIMARY KEY,
  designation TEXT NOT NULL,
  montant DECIMAL(12,2) NOT NULL,
  categorie TEXT NOT NULL,
  pro_perso TEXT NOT NULL CHECK (pro_perso IN ('pro', 'perso')),
  mode_paiement TEXT DEFAULT 'formel' CHECK (mode_paiement IN ('cash', 'formel')),
  jour_echeance INTEGER CHECK (jour_echeance >= 1 AND jour_echeance <= 31),
  recurrence TEXT CHECK (recurrence IN ('mensuel', 'annuel', NULL)),
  active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Paiements effectués des récurrents (tracking mensuel)
CREATE TABLE finance_scheduled_payments (
  id SERIAL PRIMARY KEY,
  scheduled_id INTEGER REFERENCES finance_scheduled(id) ON DELETE CASCADE,
  mois_annee TEXT NOT NULL,
  paid BOOLEAN DEFAULT false,
  paid_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(scheduled_id, mois_annee)
);

-- Index pour performance
CREATE INDEX idx_transactions_date ON finance_transactions(date_transaction);
CREATE INDEX idx_transactions_type ON finance_transactions(type);
CREATE INDEX idx_transactions_categorie ON finance_transactions(categorie);
CREATE INDEX idx_transactions_pro_perso ON finance_transactions(pro_perso);
CREATE INDEX idx_scheduled_active ON finance_scheduled(active);

-- =============================================
-- Données initiales : Catégories avec budgets
-- =============================================

-- Budgets Perso (exemples - ajuste les montants)
INSERT INTO finance_budgets (categorie, budget_mensuel, pro_perso) VALUES
('courses', 3000, 'perso'),
('fruits_legumes', 800, 'perso'),
('maison', 1000, 'perso'),
('restaurant', 2000, 'perso'),
('transport', 2000, 'perso'),
('loisirs', 1500, 'perso'),
('shopping', 1000, 'perso'),
('sante', 500, 'perso'),
('abonnements_perso', 500, 'perso'),
('cadeaux', 500, 'perso'),
('autre_perso', 1000, 'perso');

-- Budgets Pro (exemples - ajuste les montants)
INSERT INTO finance_budgets (categorie, budget_mensuel, pro_perso) VALUES
('production_neo', 5000, 'pro'),
('materiel', 2000, 'pro'),
('deplacements_pro', 1500, 'pro'),
('salaires', 15000, 'pro'),
('abonnements_pro', 1000, 'pro'),
('autre_pro', 2000, 'pro');

-- =============================================
-- Dépenses récurrentes (exemples)
-- =============================================

INSERT INTO finance_scheduled (designation, montant, categorie, pro_perso, mode_paiement, jour_echeance, recurrence, notes) VALUES
('Salaire Hamza', 5000, 'salaires', 'pro', 'formel', 25, 'mensuel', NULL),
('Salaire Horia', 3500, 'salaires', 'pro', 'formel', 25, 'mensuel', NULL),
('Internet Maroc Telecom', 400, 'abonnements_perso', 'perso', 'formel', 15, 'mensuel', NULL),
('Claude Pro', 200, 'abonnements_pro', 'pro', 'formel', 1, 'mensuel', 'Anthropic');
