# Jappalé Immo — Architecture Multi-Tenant & Roles

## 1. Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                    TOI (Super Admin)                         │
│         Panel d'administration de Jappalé Immo              │
│   Voir tous les clients, abonnements, revenus, blocages     │
└──────────────────────────┬──────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
   │  Agence A    │ │  Agence B    │ │ Proprio C    │
   │  (Plan Pro)  │ │(Plan Agence) │ │(Plan Gratuit)│
   │  5 employes  │ │ 15 employes  │ │  1 personne  │
   └──────────────┘ └──────────────┘ └──────────────┘
```

Chaque agence/client est une **organisation** isolee. Les donnees d'une agence
ne sont jamais visibles par une autre.

---

## 2. Les 3 niveaux d'utilisateurs

### Niveau 1 — Super Admin (TOI)
C'est toi, le createur de Jappalé Immo. Tu vois TOUT.

### Niveau 2 — Admin Organisation (le client qui achete)
Le directeur d'agence ou le proprietaire qui s'inscrit et paie l'abonnement.

### Niveau 3 — Membres de l'organisation
Les employes invites par l'admin : gestionnaire, comptable, agent, etc.

---

## 3. Roles au sein d'une organisation

### 3.1 Directeur / Admin

Le patron de l'agence. Il a acces a TOUT dans son organisation.

| Fonctionnalite | Acces |
|---|---|
| Gerer les biens (CRUD) | Oui |
| Gerer les locataires (CRUD) | Oui |
| Gerer les baux (CRUD) | Oui |
| Gerer les paiements | Oui |
| Voir le tableau de bord complet | Oui |
| Generer des quittances | Oui |
| Voir les rapports financiers | Oui |
| Gerer les employes (inviter, supprimer, changer role) | Oui |
| Gerer l'abonnement (plan, paiement) | Oui |
| Parametres de l'organisation | Oui |

### 3.2 Manager / Gestionnaire

Gere le quotidien operationnel. Ne peut pas gerer les employes ni l'abonnement.

| Fonctionnalite | Acces |
|---|---|
| Gerer les biens (CRUD) | Oui |
| Gerer les locataires (CRUD) | Oui |
| Gerer les baux (CRUD) | Oui |
| Gerer les paiements | Oui |
| Voir le tableau de bord complet | Oui |
| Generer des quittances | Oui |
| Voir les rapports financiers | Oui |
| Gerer les employes | Non |
| Gerer l'abonnement | Non |
| Parametres de l'organisation | Non |

### 3.3 Agent immobilier

Gere les biens et locataires qu'on lui assigne. Acces limite.

| Fonctionnalite | Acces |
|---|---|
| Voir les biens (seulement les siens) | Oui |
| Ajouter un bien | Oui |
| Gerer les locataires (seulement les siens) | Oui |
| Creer un bail | Oui |
| Enregistrer un paiement | Oui |
| Voir le tableau de bord (ses biens uniquement) | Oui |
| Generer des quittances | Oui |
| Voir les rapports financiers | Non |
| Gerer les employes | Non |
| Gerer l'abonnement | Non |

### 3.4 Comptable

Acces uniquement aux finances. Ne peut pas modifier les biens ou locataires.

| Fonctionnalite | Acces |
|---|---|
| Voir les biens (lecture seule) | Oui |
| Voir les locataires (lecture seule) | Oui |
| Voir les baux (lecture seule) | Oui |
| Voir les paiements | Oui |
| Enregistrer un paiement | Oui |
| Voir le tableau de bord | Oui |
| Generer des quittances | Oui |
| Voir les rapports financiers | Oui |
| Exporter les donnees (Excel, PDF) | Oui |
| Modifier biens/locataires/baux | Non |
| Gerer les employes | Non |
| Gerer l'abonnement | Non |

### 3.5 Secretaire / Support

Acces minimal. Peut consulter et ajouter mais pas supprimer.

| Fonctionnalite | Acces |
|---|---|
| Voir les biens (lecture seule) | Oui |
| Voir les locataires | Oui |
| Ajouter un locataire | Oui |
| Voir les baux | Oui |
| Voir les paiements | Oui |
| Generer des quittances | Oui |
| Modifier / supprimer | Non |
| Rapports financiers | Non |
| Gerer les employes | Non |

---

## 4. Super Admin (TOI) — Panel d'administration

### 4.1 Dashboard Super Admin

Ce que tu vois quand tu te connectes en tant que Super Admin :

```
┌─────────────────────────────────────────────────────────┐
│  JAPPALÉ IMMO — Administration                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Organisations: 45    Utilisateurs: 187    MRR: 425 000 │
│  Actives: 38          Actifs: 156          FCFA/mois    │
│  En retard: 5         Nouveaux (30j): 12                │
│  Bloquees: 2                                            │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Revenus mensuels                                 │   │
│  │ [graphique evolution MRR sur 12 mois]            │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Dernieres inscriptions                           │   │
│  │ Agence Diallo — Pro — 12/04/2026 — Actif         │   │
│  │ Keur Salam SARL — Agence — 10/04/2026 — Actif    │   │
│  │ Moussa Ndiaye — Gratuit — 08/04/2026 — Actif     │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Fonctionnalites du Super Admin

| Fonctionnalite | Description |
|---|---|
| **Voir toutes les organisations** | Liste de tous les clients inscrits |
| **Detail d'une organisation** | Nombre de biens, locataires, employes, plan, date d'inscription |
| **Voir les utilisateurs** | Tous les utilisateurs de toutes les organisations |
| **Gerer les abonnements** | Voir qui paie, qui est en retard |
| **Bloquer une organisation** | Si l'abonnement n'est pas paye, bloquer l'acces |
| **Debloquer une organisation** | Reactiver apres paiement |
| **Changer le plan d'une organisation** | Passer de Gratuit a Pro, etc. |
| **Voir les revenus** | MRR (revenu mensuel recurrent), evolution, previsions |
| **Voir les statistiques globales** | Nombre total de biens geres, paiements traites, etc. |
| **Envoyer des notifications** | Rappel de paiement, annonces, maintenance |
| **Exporter les donnees** | Liste des clients, revenus en CSV/Excel |
| **Supprimer une organisation** | En dernier recours |

### 4.3 Gestion des abonnements

```
Inscription → Essai gratuit 14 jours → Choix du plan → Paiement mensuel
                                                            │
                                              ┌─────────────┼──────────────┐
                                              ▼             ▼              ▼
                                           Paye         En retard      Bloque
                                          (actif)      (rappel SMS)   (acces coupe)
                                                            │
                                                     Apres 7 jours
                                                            │
                                                            ▼
                                                        Bloque
                                                   (acces lecture seule)
```

**Quand un abonnement est bloque :**
- L'organisation peut se connecter mais en **lecture seule**
- Elle ne peut plus ajouter de biens, locataires ou paiements
- Un bandeau s'affiche : "Votre abonnement est expire. Renouvelez pour continuer."
- Les donnees ne sont PAS supprimees (important pour la confiance)

---

## 5. Modele de donnees mis a jour

### Nouvelles tables

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│organizations │       │    memberships    │       │    users      │
├──────────────┤       ├──────────────────┤       │  (auth.users) │
│ id           │──┐    │ id               │       ├──────────────┤
│ name         │  │    │ org_id (FK)      │◄──┐   │ id            │
│ slug         │  └───▶│ user_id (FK)     │───┼──▶│ email         │
│ plan         │       │ role             │   │   │ ...           │
│ status       │       │ created_at       │   │   └──────────────┘
│ trial_ends   │       └──────────────────┘   │
│ blocked_at   │                              │
│ created_at   │       ┌──────────────────┐   │
└──────────────┘       │   subscriptions   │   │
                       ├──────────────────┤   │
                       │ id               │   │
                       │ org_id (FK)      │───┘
                       │ plan             │
                       │ amount           │
                       │ status           │
                       │ current_period_start│
                       │ current_period_end  │
                       │ created_at       │
                       └──────────────────┘
```

### Table organizations
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                    -- "Agence Diallo Immobilier"
  slug TEXT UNIQUE NOT NULL,             -- "agence-diallo"
  plan TEXT NOT NULL DEFAULT 'FREE',     -- FREE, PRO, AGENCY
  status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, TRIAL, BLOCKED, CANCELLED
  max_properties INTEGER NOT NULL DEFAULT 2,
  max_members INTEGER NOT NULL DEFAULT 1,
  trial_ends_at TIMESTAMPTZ,
  blocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Table memberships (lie utilisateur ↔ organisation)
```sql
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'AGENT',    -- ADMIN, MANAGER, AGENT, ACCOUNTANT, SECRETARY
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(org_id, user_id)
);
```

### Table subscriptions (historique des paiements d'abonnement)
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  plan TEXT NOT NULL,
  amount INTEGER NOT NULL,               -- en FCFA
  status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, PAST_DUE, CANCELLED
  payment_method TEXT,                   -- WAVE, ORANGE_MONEY, TRANSFER
  current_period_start DATE NOT NULL,
  current_period_end DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Table super_admins (toi)
```sql
CREATE TABLE super_admins (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY
);
```

### Modification des tables existantes

Les tables `properties`, `tenants`, `leases`, `payments` auront
`org_id` au lieu de `user_id` :

```sql
-- Ajouter org_id a chaque table
ALTER TABLE properties ADD COLUMN org_id UUID REFERENCES organizations(id);
ALTER TABLE tenants ADD COLUMN org_id UUID REFERENCES organizations(id);
```

---

## 6. Plans tarifaires revises

| | Gratuit | Pro | Agence | Entreprise |
|---|---|---|---|---|
| **Prix** | 0 FCFA | 5 000 FCFA/mois | 15 000 FCFA/mois | 30 000 FCFA/mois |
| **Biens** | 2 | 20 | 100 | Illimite |
| **Utilisateurs** | 1 | 3 | 10 | Illimite |
| **Roles** | Admin seul | Admin, Manager | Tous les roles | Tous les roles |
| **Quittances PDF** | Oui | Oui | Oui | Oui |
| **Rapports** | Basique | Complet | Complet | Complet + export |
| **Paiement mobile** | Non | Oui | Oui | Oui |
| **Support** | Email | Email | Prioritaire | Dedie + tel |
| **Multi-organisation** | Non | Non | Non | Oui |

---

## 7. Flux utilisateur

### 7.1 Inscription d'une nouvelle agence

```
1. Le directeur s'inscrit sur jappaleimmo.vercel.app/register
2. Il cree son organisation (nom de l'agence)
3. Il est automatiquement ADMIN de cette organisation
4. Il a 14 jours d'essai gratuit (plan Pro)
5. Apres 14 jours → choix du plan + paiement
```

### 7.2 Invitation d'un employe

```
1. L'admin va dans Parametres > Equipe
2. Il clique "Inviter un membre"
3. Il entre l'email + choisit le role (Manager, Agent, Comptable...)
4. L'employe recoit un email avec un lien d'invitation
5. L'employe cree son compte et rejoint l'organisation
6. Il voit uniquement ce que son role autorise
```

### 7.3 Blocage pour non-paiement

```
1. L'abonnement expire
2. J+1 : Email de rappel automatique
3. J+3 : SMS de rappel
4. J+7 : Compte passe en mode LECTURE SEULE
5. J+30 : Notification finale "vos donnees seront archivees dans 30 jours"
6. J+60 : Donnees archivees (pas supprimees)
```

---

## 8. Ta visibilite en tant que Super Admin

### Ce que tu vois sur ton panel :

**Dashboard global :**
- Nombre total d'organisations
- Nombre total d'utilisateurs
- MRR (Monthly Recurring Revenue)
- Taux de conversion (gratuit → payant)
- Taux de churn (desabonnements)
- Graphique d'evolution des revenus

**Liste des organisations :**
- Nom, plan, statut, date d'inscription
- Nombre de biens, locataires, membres
- Dernier paiement, prochain paiement
- Actions : bloquer, debloquer, changer plan, supprimer

**Liste des utilisateurs :**
- Tous les utilisateurs de toutes les organisations
- Role, organisation, derniere connexion

**Paiements d'abonnement :**
- Historique de tous les paiements recus
- Filtrer par statut (paye, en retard, echoue)
- Total des revenus par mois

**Alertes :**
- Organisations en periode d'essai qui expire bientot
- Paiements en retard
- Organisations inactives (pas de connexion depuis 30 jours)

---

## 9. Securite

### Isolation des donnees
- Chaque organisation ne voit QUE ses propres donnees
- Le Row Level Security (RLS) de Supabase garantit cette isolation
- Meme si un utilisateur modifie le code cote client, il ne peut pas acceder aux donnees d'une autre organisation

### Controle des roles
- Les permissions sont verifiees cote SERVEUR (pas juste cacher les boutons)
- Un comptable ne peut pas supprimer un bien meme en appelant l'API directement

### Super Admin
- Acces protege par un role special dans la base de donnees
- Connexion sur un sous-domaine separe (admin.jappaleimmo.com)

---

## 10. Etapes d'implementation

### Phase 1 — Multi-tenant (2-3 semaines)
- [ ] Creer les tables organizations, memberships
- [ ] Modifier properties/tenants/leases/payments pour ajouter org_id
- [ ] Mettre a jour le RLS pour filtrer par org_id
- [ ] Modifier l'inscription pour creer une organisation
- [ ] Afficher le nom de l'organisation dans le dashboard

### Phase 2 — Roles & permissions (1-2 semaines)
- [ ] Systeme de permissions par role
- [ ] Cacher/afficher les elements selon le role
- [ ] Verification des permissions cote serveur
- [ ] Page "Equipe" pour inviter des membres

### Phase 3 — Abonnements (2-3 semaines)
- [ ] Table subscriptions
- [ ] Integration paiement Wave/Orange Money
- [ ] Logique de blocage/deblocage
- [ ] Essai gratuit 14 jours
- [ ] Limitation par plan (nombre de biens, membres)

### Phase 4 — Panel Super Admin (2-3 semaines)
- [ ] Dashboard admin avec KPIs globaux
- [ ] Liste et gestion des organisations
- [ ] Gestion des abonnements
- [ ] Alertes et notifications
- [ ] Export des donnees

---

*Document cree le 11 avril 2026*
*Jappalé Immo — Architecture Multi-Tenant v1.0*
