# Guide de démarrage du Backend

## 📋 Prérequis
- Node.js installé
- MySQL/MariaDB installé et en cours d'exécution
- Base de données `aureus_wealth` créée

## 🚀 Étapes pour lancer le backend

### 1. Créer le serveur backend (si pas encore fait)

Le backend doit être créé dans le dossier `backend/` avec les fichiers suivants :

**Structure nécessaire :**
```
backend/
├── .env (déjà présent ✓)
├── package.json
├── server.js
└── routes/
    ├── auth.js
    ├── plans.js
    └── countries.js
```

### 2. Installer les dépendances

```bash
cd backend
npm install express mysql2 bcryptjs jsonwebtoken cors dotenv body-parser
```

### 3. Créer la base de données

```bash
# Ouvrir MySQL
mysql -u root -p

# Exécuter le schéma
source C:/Users/arsen/.gemini/antigravity/scratch/prosper-invest/database/schema.sql
```

### 4. Vérifier la configuration `.env`

Le fichier `.env` dans `backend/` contient déjà :
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=aureus_wealth
JWT_SECRET=supersecret_aureus_2026
```

### 5. Lancer le serveur

```bash
cd backend
node server.js
```

Ou avec nodemon (pour auto-reload) :
```bash
npm install -g nodemon
nodemon server.js
```

## ✅ Vérification

Le backend devrait démarrer sur `http://localhost:5000`

Vous verrez :
```
✓ Database connected
✓ Server running on port 5000
```

## 🔧 Endpoints disponibles

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/countries` - Liste des pays
- `GET /api/plans/country/:id` - Plans par pays

## ⚠️ Note importante

Le backend doit être mis à jour pour accepter les nouveaux champs `phone` et `country_id` lors de l'inscription.

Voulez-vous que je crée les fichiers backend manquants ?
