# Backend YEHI OR Tech

API backend séparée du frontend Next.js, déployée sur **Railway**.

## Stack

- **Express 4** + TypeScript (strict)
- **Prisma 5** (même schéma que le frontend, partagé)
- **jose** (JWT edge-compatible)
- **bcryptjs** (hash mots de passe)
- **helmet** + **cors** (sécurité)
- **morgan** (logs HTTP)
- **Resend** (envoi d'emails — optionnel)

## Structure

```
backend/
├── src/
│   ├── index.ts                → Entrée Express + middlewares globaux
│   ├── routes/
│   │   ├── health.ts           → GET /api/health (status + DB)
│   │   ├── auth.ts             → POST /api/auth/login, GET /api/auth/me
│   │   ├── leads.ts            → POST /api/leads (devis depuis le site)
│   │   ├── services.ts         → GET /api/services (liste des services)
│   │   ├── pricing.ts          → GET /api/pricing (packs tarifaires)
│   │   └── manager.ts          → Routes protégées CRM (à implémenter)
│   ├── lib/
│   │   └── prisma.ts           → Singleton PrismaClient
│   └── middleware/
│       └── errorHandler.ts     → Gestion d'erreurs globale
├── prisma/
│   └── schema.prisma           → Schéma partagé avec le frontend
├── package.json
├── tsconfig.json
├── railway.json                → Config déploiement Railway
└── .env.example
```

## Démarrage local

```bash
cd backend
npm install
cp .env.example .env
# Édite .env avec DATABASE_URL + JWT_SECRET
npx prisma generate
npx prisma db push
npm run dev
```

Le backend tourne sur `http://localhost:3001`.

## Déploiement Railway

1. Crée un nouveau service sur [Railway](https://railway.app)
2. Connecte le repo GitHub `SenaDev007/YEHI-OR-Tech`
3. **Root Directory** : `backend`
4. Railway détecte automatiquement `railway.json` :
   - Build : `npm install && npm run build`
   - Start : `npm run start`
   - Healthcheck : `/api/health`
5. Variables d'environnement à configurer dans Railway :
   - `DATABASE_URL` (PostgreSQL — Railway fournit une DB managée)
   - `JWT_SECRET` (64+ caractères aléatoires)
   - `FRONTEND_URL` (https://yehiortech.com)
   - `RESEND_API_KEY` (optionnel, pour les emails)

Railway fournira automatiquement une URL publique du type :
`https://yehi-or-tech-backend.up.railway.app`

## Endpoints disponibles

| Méthode | Route | Description |
|---|---|---|
| GET | `/` | Info backend |
| GET | `/api/health` | Status + DB check |
| POST | `/api/auth/login` | Authentification (JWT) |
| GET | `/api/auth/me` | Utilisateur courant |
| POST | `/api/leads` | Demande de devis (depuis le site) |

## Architecture cible

Le backend Railway sert d'**API centralisée** que le frontend Next.js
(déployé sur Vercel) appelle via fetch. Cela sépare proprement :

- **Frontend** (Vercel) : rendu, SEO, animations, design system
- **Backend** (Railway) : auth, DB, logique métier, emails, facturation

Une fois le backend déployé et stable, le frontend basculera de ses
API routes internes vers les endpoints Railway (via une variable
`NEXT_PUBLIC_API_URL`).
