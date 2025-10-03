# Expression du besoin – Projet TeamBoard

## 1. Contexte
Le projet **TeamBoard** est une mini-application web permettant à une petite équipe de gérer ses tâches collaboratives.  
L'objectif est de fournir une interface _simple_, _ergonomique_ et _efficace_ pour la création, le suivi et la gestion des tâches au sein de l'entreprise.  
L'application devra proposer une approche moderne inspirée des méthodologies agiles, avec un système de **colonnes Kanban** pour une visualisation claire de l'avancement des travaux.

________________________________________

## 2. Objectifs
•	_Permettre_ aux membres de l'équipe de se connecter avec un système d'**authentification** simplifié.  
•	_Fournir_ un espace collaboratif centralisé pour la **gestion des tâches**.  
•	_Faciliter_ l'attribution des tâches aux différents membres connectés.  
•	_Offrir_ une vue claire de l'avancement grâce au suivi des statuts avec **interface Kanban**.  
•	_Proposer_ des options de **filtrage avancé** pour mieux organiser le travail.  
•	_Assurer_ une expérience utilisateur fluide avec des interactions modernes.

________________________________________

## 3. Fonctionnalités demandées

### 3.1 Authentification
•	**Connexion** d'un utilisateur existant (`nom d'utilisateur`, `mot de passe`).  
•	Gestion de la _persistance de session_ (reconnexion automatique si déjà connecté).  
•	Mise à disposition de **comptes de démonstration** pour les tests.  
•	Interface d'inscription préparée pour évolution future.

### 3.2 Gestion des tâches
•	**Création** d'une tâche avec un _titre_ et une _description_.  
•	**Suppression** d'une tâche.  
•	**Attribution** d'une tâche à un utilisateur connecté.  
•	Changement de statut d'une tâche (`à faire`, `en cours`, `annulé`, `terminé`).  
•	Édition complète des tâches existantes.  
•	Catégorisation par type de tâche (`Bug`, `Feature`, `Improvement`).

### 3.3 Organisation et filtrage
•	**Interface Kanban** avec 4 colonnes de statut distinctes.  
•	**Drag & Drop** pour déplacer les tâches entre les colonnes.  
•	Filtrer les tâches par _utilisateur assigné_.  
•	Filtrer les tâches par _statut_.  
•	Possibilité de **combiner les filtres**.  
•	Affichage clair et lisible des tâches avec **badges visuels**.  
•	Création rapide de tâches depuis chaque colonne.

________________________________________

## 4. Contraintes et attentes
•	**Logo visible** en haut à gauche quand connecté, au milieu sur la page de connexion.  
•	Design moderne et épuré utilisant des composants UI standardisés.  
•	**Interface responsive** adaptée aux différents types d'écrans.  
•	Données stockées et persistantes côté client (`localStorage`).  
•	Navigation fluide et intuitive avec animations appropriées.  
•	Expérience utilisateur optimisée avec _notifications_ et _feedback visuel_.  
•	Accessibilité respectant les bonnes pratiques web.

________________________________________

## 5. Exigences et critères d'acceptation

**5.1 Sécurité et accès**  
•	Un utilisateur non connecté ne peut pas accéder à la liste des tâches.  
•	La session utilisateur est maintenue entre les rechargements de page.

**5.2 Gestion des tâches**  
•	Une tâche nouvellement créée est _immédiatement visible_ dans la liste.  
•	Le statut d'une tâche est modifiable par **drag & drop** et reflété instantanément.  
•	L'attribution d'une tâche à un utilisateur est persistante et visible.  
•	Les modifications de tâches sont sauvegardées automatiquement.

**5.3 Interface et navigation**

- L'**interface Kanban** permet une navigation fluide entre les 4 colonnes.  
- Les types de tâches (`Bug`, `Feature`, `Improvement`) sont clairement identifiables.  
- La création rapide depuis chaque colonne fonctionne avec le bon statut pré-sélectionné.  
- Le filtrage affiche uniquement les tâches correspondant aux critères sélectionnés.

**5.4 Compatibilité**  
L'application fonctionne de manière responsive sur _desktop_, _tablette_ et _mobile_. 