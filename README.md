# Plateforme de cours en ligne - ACDN

Bienvenue sur la plateforme de formation en ligne de l’**Association Congolaise du Droit du Numérique (ACDN)**.

## 🌐 Accès à l’application

**URL** : [[https://acdn-elearning.netlify.app](https://acdn-elearning.netlify.app)]

## 📚 À propos du projet

Cette plateforme permet aux apprenants de suivre des cours en ligne autour du droit du numérique au Congo-Brazzaville. Les utilisateurs peuvent consulter des ressources, suivre des guides, lire des textes de loi et accéder à des cas pratiques.

Le projet a été conçu pour soutenir les missions de l'ACDN : **sensibiliser, former et informer** sur les enjeux numériques et juridiques.

## 🛠️ Technologies utilisées

- **React** + **TypeScript** (via Vite)
- **Tailwind CSS** + **shadcn/ui** pour le design
- **Supabase** pour la gestion de la base de données et l’authentification
- **Lucide-react** pour les icônes

## 📁 Structure du projet

- `components/` : composants UI réutilisables (boutons, tabs, layout, etc.)
- `pages/` ou `routes/` : pages principales de l’application
- `supabase/` : configuration de la connexion à la base de données Supabase
- `styles/` : fichiers Tailwind et styles personnalisés

## 🚀 Lancer l’application en local

> Assurez-vous d’avoir [Node.js](https://nodejs.org) installé.

```sh
# 1. Cloner le repo
git clone <votre-url-git>

# 2. Aller dans le dossier du projet
cd nom-du-projet

# 3. Installer les dépendances
npm install

# 4. Lancer le serveur de dev
npm run dev
