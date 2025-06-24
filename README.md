# Formulaire Tests - Projet CI/CD

Projet réalisé dans le cadre du TP CI/CD avec Docker, FastAPI, React, MySQL, et Cypress.

## 📚 Stack technique

- Frontend : React (Vite + TypeScript)
- Backend : FastAPI + SQLAlchemy
- Base de données : MySQL 8
- Interface de gestion : Adminer
- Tests E2E : Cypress
- Conteneurisation : Docker + Docker Compose
- CI/CD : GitHub Actions
- Déploiement (prévu) : Backend sur Vercel, Frontend sur GitHub Pages
- Base de production : Aiven ou Alwaysdata (compte admin créé)

## ⚙️ Architecture Docker

- `frontend` → React App sur `localhost:3000/formulaireTests/`
- `backend` → FastAPI sur `localhost:8000`
- `mysql` → MySQL 8 sur `localhost:3306`
- `adminer` → Adminer sur `localhost:8080`

## 🗺️ Fonctionnalités

- Formulaire d'inscription utilisateur avec validation des champs
- Sauvegarde en base MySQL (plus de local storage)
- Liste des utilisateurs avec suppression (compte admin)
- Accès aux informations privées en mode admin
- API REST sécurisée
- Tests unitaires et d'intégration backend (Pytest + coverage)
- Tests end-to-end Cypress (2 tests en commentaire à corriger)

## 🚀 Lancement du projet

```bash
docker-compose up --build
