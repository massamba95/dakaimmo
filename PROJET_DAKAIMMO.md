# DakarImmo — SaaS de Gestion Immobilière

## Document de projet

---

## 1. Présentation du projet

**DakarImmo** est une plateforme SaaS (Software as a Service) de gestion immobilière destinée au marché sénégalais et africain. Elle permet aux propriétaires et gestionnaires immobiliers de gérer leurs biens, locataires et paiements de loyer depuis une interface web moderne.

### Problème identifié

- Les propriétaires gèrent leurs biens sur papier, cahiers ou fichiers Excel
- Aucune traçabilité fiable des paiements
- Pas de solution locale adaptée, abordable et simple
- Les rappels de paiement se font manuellement (appels, déplacements)
- Les quittances sont rédigées à la main

### Solution proposée

Une application web accessible depuis n'importe quel appareil (PC, tablette, téléphone) qui centralise toute la gestion locative avec paiement mobile intégré (Wave, Orange Money).

### Cible

- Propriétaires individuels (1 à 50 biens)
- Agences immobilières et gestionnaires de patrimoine
- Syndics de copropriété
- Marché initial : Dakar, Thiès, Saint-Louis
- Extension : zone UEMOA / Afrique de l'Ouest

---

## 2. Fonctionnalités

### Phase 1 — MVP (Minimum Viable Product)

#### 2.1 Authentification & Gestion de compte
- Inscription (email + mot de passe)
- Connexion / déconnexion
- Réinitialisation du mot de passe
- Profil utilisateur (nom, téléphone, adresse)

#### 2.2 Gestion des biens immobiliers
- Ajouter / modifier / supprimer un bien
- Types de bien : appartement, maison, local commercial, terrain
- Informations : adresse, superficie, nombre de pièces, loyer mensuel, charges
- Statut : libre, occupé, en travaux
- Photos du bien (upload)

#### 2.3 Gestion des locataires
- Ajouter / modifier / supprimer un locataire
- Informations : nom, prénom, téléphone, email, CNI/passeport
- Association locataire ↔ bien
- Historique des locations (date entrée, date sortie)
- Gestion du contrat de bail (upload PDF)

#### 2.4 Gestion des paiements
- Enregistrer un paiement (montant, date, méthode)
- Méthodes : espèces, virement, Wave, Orange Money
- Statut : payé, en retard, partiel
- Historique des paiements par locataire et par bien
- Calcul automatique des arriérés

#### 2.5 Quittances de loyer
- Génération automatique de quittances en PDF
- Informations conformes : propriétaire, locataire, période, montant
- Téléchargement et envoi par email

#### 2.6 Tableau de bord
- Vue d'ensemble : nombre de biens, taux d'occupation
- Revenus du mois / de l'année
- Liste des loyers impayés
- Graphiques : évolution des revenus, taux de recouvrement
- Alertes : loyers en retard, baux arrivant à échéance

#### 2.7 Notifications & Rappels
- Rappel automatique avant la date d'échéance (email/SMS)
- Notification en cas de retard de paiement
- Rappel d'expiration de bail

### Phase 2 — Évolutions

#### 2.8 Espace locataire
- Portail dédié pour le locataire
- Consultation de l'historique des paiements
- Téléchargement des quittances
- Paiement en ligne (Wave / Orange Money)

#### 2.9 Paiement mobile intégré
- Intégration API Wave
- Intégration API Orange Money
- Réconciliation automatique des paiements

#### 2.10 Gestion des dépenses & travaux
- Enregistrer les dépenses liées à un bien (réparations, entretien)
- Suivi des interventions et prestataires
- Calcul de la rentabilité nette par bien

#### 2.11 Multi-utilisateurs & Rôles
- Rôle propriétaire (accès total)
- Rôle gestionnaire (accès délégué)
- Rôle comptable (accès lecture seule finances)

### Phase 3 — Expansion

#### 2.12 Rapports & Exports
- Rapport mensuel / annuel en PDF
- Export des données en Excel / CSV
- Rapport fiscal (déclaration des revenus fonciers)

#### 2.13 Multi-devises & Multi-pays
- Support FCFA, GNF, XOF
- Adaptation aux réglementations locales par pays

#### 2.14 Application mobile
- Application React Native (iOS + Android)
- Notifications push

---

## 3. Architecture technique

### 3.1 Vue d'ensemble

```
┌──────────────────────────────────────────────────────────┐
│                      CLIENTS                             │
│  ┌────────────┐  ┌────────────┐  ┌───────────────────┐   │
│  │ Navigateur │  │  Mobile    │  │  App Mobile (v2)  │   │
│  │   (Web)    │  │ (Responsive│  │  React Native     │   │
│  └─────┬──────┘  └─────┬──────┘  └────────┬──────────┘   │
└────────┼───────────────┼──────────────────┼──────────────┘
         │               │                  │
         ▼               ▼                  ▼
┌──────────────────────────────────────────────────────────┐
│                    FRONTEND                              │
│              Next.js + Tailwind CSS                      │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌───────────┐  │
│  │  Pages   │ │Composants │ │  Hooks   │ │  Services │  │
│  │  (routes)│ │    UI     │ │  React   │ │  (API)    │  │
│  └──────────┘ └───────────┘ └──────────┘ └───────────┘  │
└────────────────────────┬─────────────────────────────────┘
                         │ API REST (JSON)
                         ▼
┌──────────────────────────────────────────────────────────┐
│                     BACKEND                              │
│              Node.js + Express.js                        │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌───────────┐  │
│  │  Routes  │ │Controllers│ │ Services │ │Middleware │  │
│  │  (API)   │ │           │ │ (métier) │ │ (auth,    │  │
│  │          │ │           │ │          │ │  logs...) │  │
│  └──────────┘ └───────────┘ └──────────┘ └───────────┘  │
│                      │                                   │
│              ┌───────┴────────┐                          │
│              │  Prisma ORM    │                          │
│              └───────┬────────┘                          │
└──────────────────────┼───────────────────────────────────┘
                       │
         ┌─────────────┼─────────────────┐
         ▼             ▼                 ▼
┌──────────────┐ ┌───────────┐ ┌──────────────────┐
│  PostgreSQL  │ │  Redis    │ │ Services externes│
│  (données)   │ │  (cache,  │ │                  │
│              │ │  sessions)│ │ - Wave API       │
└──────────────┘ └───────────┘ │ - Orange Money   │
                               │ - Twilio (SMS)   │
                               │ - SendGrid(email)│
                               │ - S3 (fichiers)  │
                               └──────────────────┘
```

### 3.2 Stack technique détaillée

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| Frontend | **Next.js 14** | SSR, performance, SEO |
| UI | **Tailwind CSS + shadcn/ui** | Moderne, rapide, responsive |
| Backend | **Node.js + Express** | Léger, performant, large écosystème |
| ORM | **Prisma** | Typage fort, migrations simples |
| Base de données | **PostgreSQL** | Robuste, gratuit, relationnel |
| Cache | **Redis** | Sessions, cache des données fréquentes |
| Auth | **JWT + bcrypt** | Standard, sécurisé |
| PDF | **PDFKit ou Puppeteer** | Génération de quittances |
| SMS | **Twilio ou Orange SMS API** | Rappels de paiement |
| Email | **SendGrid ou Nodemailer** | Notifications |
| Fichiers | **AWS S3 ou MinIO** | Stockage photos et documents |
| Conteneurs | **Docker + Docker Compose** | Environnement reproductible |
| Hébergement | **VPS (Hetzner/OVH)** | Coût faible, bonne perf |
| CI/CD | **GitHub Actions** | Déploiement automatisé |

---

## 4. Modèle de données

### 4.1 Schéma des entités principales

```
┌─────────────┐       ┌─────────────────┐       ┌──────────────┐
│    User      │       │    Property      │       │   Tenant     │
├─────────────┤       ├─────────────────┤       ├──────────────┤
│ id           │──┐   │ id               │──┐   │ id            │
│ email        │  │   │ userId (FK)      │  │   │ firstName     │
│ password     │  │   │ title            │  │   │ lastName      │
│ firstName    │  └──▶│ type             │  │   │ phone         │
│ lastName     │      │ address          │  │   │ email         │
│ phone        │      │ city             │  │   │ cni           │
│ role         │      │ rooms            │  │   │ createdAt     │
│ createdAt    │      │ area             │  │   └───────┬───────┘
└──────────────┘      │ rentAmount       │  │           │
                      │ charges          │  │           │
                      │ status           │  │           │
                      │ photos[]         │  │           │
                      └─────────────────┘  │           │
                                           │           │
                      ┌────────────────────┴───────────┘
                      │
                      ▼
              ┌───────────────┐       ┌──────────────────┐
              │    Lease       │       │    Payment        │
              ├───────────────┤       ├──────────────────┤
              │ id             │──┐   │ id                │
              │ propertyId(FK) │  │   │ leaseId (FK)      │
              │ tenantId (FK)  │  └──▶│ amount            │
              │ startDate      │      │ dueDate           │
              │ endDate        │      │ paidDate          │
              │ rentAmount     │      │ method            │
              │ deposit        │      │ status            │
              │ status         │      │ receiptUrl        │
              └────────────────┘      └──────────────────┘
```

### 4.2 Description des entités

**User (Utilisateur)**
- Le propriétaire ou gestionnaire qui utilise la plateforme
- Peut posséder plusieurs biens

**Property (Bien immobilier)**
- Appartement, maison, local commercial ou terrain
- Appartient à un utilisateur
- Possède un loyer mensuel et des charges

**Tenant (Locataire)**
- Personne physique qui loue un bien
- Identifié par CNI ou passeport

**Lease (Bail / Contrat de location)**
- Lie un locataire à un bien pour une période donnée
- Contient le montant du loyer et de la caution

**Payment (Paiement)**
- Enregistrement d'un paiement de loyer
- Lié à un bail
- Statut : payé, en retard, partiel

---

## 5. Pages de l'application

### 5.1 Pages publiques
| Page | Route | Description |
|------|-------|-------------|
| Accueil | `/` | Landing page, présentation du service |
| Tarifs | `/pricing` | Plans et tarification |
| Connexion | `/login` | Formulaire de connexion |
| Inscription | `/register` | Formulaire d'inscription |

### 5.2 Pages privées (Dashboard)
| Page | Route | Description |
|------|-------|-------------|
| Tableau de bord | `/dashboard` | Vue d'ensemble, KPIs, alertes |
| Mes biens | `/dashboard/properties` | Liste des biens immobiliers |
| Détail d'un bien | `/dashboard/properties/:id` | Fiche complète d'un bien |
| Ajouter un bien | `/dashboard/properties/new` | Formulaire d'ajout |
| Mes locataires | `/dashboard/tenants` | Liste des locataires |
| Détail locataire | `/dashboard/tenants/:id` | Fiche locataire + historique |
| Paiements | `/dashboard/payments` | Liste de tous les paiements |
| Nouveau paiement | `/dashboard/payments/new` | Enregistrer un paiement |
| Quittances | `/dashboard/receipts` | Liste des quittances générées |
| Baux | `/dashboard/leases` | Liste des contrats de bail |
| Paramètres | `/dashboard/settings` | Profil, mot de passe, préférences |

---

## 6. Modèle économique

### 6.1 Plans tarifaires

| Plan | Prix/mois | Biens max | Fonctionnalités |
|------|-----------|-----------|-----------------|
| **Gratuit** | 0 FCFA | 2 biens | Gestion basique, quittances |
| **Pro** | 5 000 FCFA (~7,60 EUR) | 20 biens | Toutes les fonctionnalités MVP |
| **Agence** | 15 000 FCFA (~22,90 EUR) | Illimité | Multi-utilisateurs, rapports, API |

### 6.2 Sources de revenus
- Abonnements mensuels
- Commission sur les paiements mobiles (optionnel)
- Création de sites web pour les agences clientes (service complémentaire)

---

## 7. Étapes de développement

### Étape 1 — Initialisation (Semaine 1)
- [ ] Créer le dépôt Git
- [ ] Initialiser le projet Next.js (frontend)
- [ ] Initialiser le projet Express (backend)
- [ ] Configurer Docker + PostgreSQL
- [ ] Configurer Prisma et créer le schéma de base de données
- [ ] Mettre en place l'authentification (JWT)

### Étape 2 — Gestion des biens (Semaine 2)
- [ ] API CRUD des biens immobiliers
- [ ] Pages frontend : liste, ajout, modification, détail
- [ ] Upload de photos
- [ ] Filtres et recherche

### Étape 3 — Gestion des locataires et baux (Semaine 3)
- [ ] API CRUD des locataires
- [ ] API CRUD des baux (contrats de location)
- [ ] Association locataire ↔ bien via le bail
- [ ] Pages frontend correspondantes

### Étape 4 — Paiements et quittances (Semaine 4)
- [ ] API d'enregistrement des paiements
- [ ] Calcul automatique des arriérés
- [ ] Génération de quittances en PDF
- [ ] Historique des paiements

### Étape 5 — Tableau de bord et notifications (Semaine 5)
- [ ] Dashboard avec KPIs et graphiques
- [ ] Système de notifications (email)
- [ ] Rappels de paiement automatiques
- [ ] Alertes d'expiration de bail

### Étape 6 — Tests et déploiement (Semaine 6)
- [ ] Tests unitaires et d'intégration
- [ ] Landing page publique
- [ ] Déploiement sur VPS (Docker)
- [ ] Configuration du nom de domaine et SSL
- [ ] Tests utilisateurs avec 2-3 propriétaires au Sénégal

---

## 8. Sécurité

- Hashage des mots de passe (bcrypt, 12 rounds)
- Authentification par JWT avec refresh token
- Validation de toutes les entrées utilisateur
- Protection CSRF et XSS
- Rate limiting sur les routes sensibles
- HTTPS obligatoire
- Sauvegarde automatique quotidienne de la base de données
- Conformité RGPD / loi sénégalaise sur les données personnelles (loi 2008-12)

---

## 9. Indicateurs de succès (KPIs)

| Indicateur | Objectif à 6 mois |
|------------|-------------------|
| Utilisateurs inscrits | 100 |
| Utilisateurs payants | 20 |
| Biens gérés | 200 |
| Revenu mensuel récurrent | 150 000 FCFA |
| Taux de rétention | > 80% |

---

## 10. Risques et mitigations

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Adoption lente | Élevé | Plan gratuit pour attirer les premiers utilisateurs |
| Connectivité internet faible | Moyen | App responsive, mode offline (PWA en phase 3) |
| Concurrence future | Moyen | Avantage du premier entrant, focus UX locale |
| Impayés d'abonnement | Faible | Paiement mobile simplifié, rappels automatiques |
| Réglementation | Faible | Veille juridique, conformité dès le départ |

---

*Document créé le 10 avril 2026*
*Projet DakarImmo — Version 1.0*
