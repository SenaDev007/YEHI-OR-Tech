# Mise en production de Manager YEHI OR Tech

## État actuel

Le site et le socle du manager sont dans le dépôt GitHub `SenaDev007/YEHI-OR-Tech`. Le projet Vercel `yehi-or-tech` est relié au dépôt et le domaine `manager.yehiortech.com` est attaché au projet. Le code contient le routage par hôte : l’URL racine du sous-domaine ouvre l’espace Manager.

## Variables Vercel indispensables

Créer ces variables dans les environnements Production, Preview et Development selon le besoin :

```text
MANAGER_ADMIN_EMAIL=adresse-administrateur
MANAGER_ADMIN_PASSWORD=mot-de-passe-long-et-unique
MANAGER_AUTH_SECRET=secret-aleatoire-d-au-moins-32-caracteres
MANAGER_ALLOWED_EMAILS=adresse-administrateur,autre-adresse-autorisee
```

Pour Google OAuth :

```text
GOOGLE_CLIENT_ID=client-id-google
GOOGLE_CLIENT_SECRET=secret-google
GOOGLE_REDIRECT_URI=https://manager.yehiortech.com/api/manager/google/callback
```

Dans Google Cloud Console, ajouter exactement cette URI de redirection. Le contrôle des adresses autorisées est ensuite effectué par `MANAGER_ALLOWED_EMAILS`.

## Stockage durable du CRM

La première tranche contient le parcours offline-first local et l’interface de pilotage. Avant d’enregistrer des données financières réelles en production, ajouter une base PostgreSQL ou MySQL/TiDB et une variable `DATABASE_URL`.

Le stockage serveur doit ensuite reprendre les entités suivantes : clients, ventes, paiements, dépenses, commandes, stocks, enveloppes de trésorerie, abonnements Academia, tickets de support et journal d’audit. Les opérations locales devront être synchronisées par identifiant idempotent ; une vente validée ne doit pas être supprimée physiquement.

## DNS

Le domaine `manager.yehiortech.com` a été ajouté au projet Vercel et retourné comme vérifié. Si le registrar demande une entrée manuelle, utiliser l’enregistrement fourni par Vercel dans la page Domains du projet. Ne pas créer un second projet Vercel pour le sous-domaine.

## Vérifications avant ouverture

1. Tester `https://manager.yehiortech.com` et vérifier la redirection vers la connexion.
2. Tester le login e-mail après ajout des variables.
3. Tester le bouton Google après configuration de l’application OAuth.
4. Vérifier que le cookie de session est `HttpOnly`, `Secure` en production et limité au domaine attendu.
5. Créer une vente hors connexion et vérifier son état « en attente de synchronisation ».
6. Ne jamais utiliser la version locale du navigateur comme unique sauvegarde comptable.
7. Ajouter la base durable et les sauvegardes avant de traiter des informations financières réelles.

## Sécurité du dépôt

Le token GitHub communiqué dans la conversation doit être révoqué et remplacé. Aucun token GitHub ou mot de passe ne doit être ajouté au dépôt, à `.env.example`, aux logs ou au code source.
