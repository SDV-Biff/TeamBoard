# 📌 Application de gestion de tâches

Ce projet est une application de gestion de tâches collaborative permettant aux utilisateurs de créer, modifier, supprimer, assigner et filtrer leurs tâches.  
Il inclut également un système d’authentification (inscription, connexion, déconnexion) pour sécuriser l’accès.

---

## 🚀 Fonctionnalités principales

### 🔐 Authentification
- **US001 - Inscription**
  - Un nouvel utilisateur peut créer un compte avec email et mot de passe.
  - Validation des champs obligatoires et conformité du mot de passe.
- **US002 - Connexion**
  - Un utilisateur existant peut se connecter avec ses identifiants.
  - Gestion des erreurs : mot de passe incorrect ou compte inexistant.
- **US003 - Déconnexion**
  - Un utilisateur connecté peut se déconnecter pour sécuriser son compte.
  - Le token est supprimé.

---

### ✅ Gestion des tâches
- **US004 - Création d’une tâche**
  - Ajout d’une nouvelle tâche avec titre, description, type, statut et assignation.
- **US005 - Modification d’une tâche**
  - Mise à jour des informations d’une tâche (par formulaire ou glisser-déposer).
- **US006 - Suppression d’une tâche**
  - Suppression définitive d’une tâche avec confirmation.

---

### 👥 Assignation
- **US007 - Changer l’assignation d’une tâche**
  - Modification de la personne assignée à une tâche existante.

---

### 🔎 Filtrage et recherche
- **US008 - Filtrer les tâches par statut**
  - Affichage des tâches par statut : "À faire", "En cours", "Annulé", etc.
- **US009 - Filtrer les tâches par personne**
  - Affichage des tâches assignées à un utilisateur spécifique.

---

## 📋 Spécifications fonctionnelles détaillées

Chaque **User Story (US)** est définie avec des **scénarios Gherkin** décrivant les comportements attendus.  

Exemple :  

### US001 - Inscription
```gherkin
Background:
  Given je suis sur la page "Inscription"

Scenario: Succès avec champs requis - Risque Très Haut
  When je saisis Nom Complet "test"
   And Email "test@example.com"
   And Mot de passe conforme "Test12345!"
   And Confirmation "Test12345!"
   And je clique "S'inscrire"
  Then le compte est créé
   And je suis redirigé vers la page "Connexion"
   And je vois "Compte créé"
