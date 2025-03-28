# Formulaire avec Tests et CI/CD 🧪🚀

Ce projet est un petit formulaire en React permettant à un utilisateur de s’enregistrer, avec validation complète, gestion des erreurs, tests unitaires & d’intégration, et déploiement automatique via GitHub Actions.

## 🔥 Aperçu en ligne  
👉 [Accéder à l'application] : https://TheoCtla.github.io/formulaireTests

## 🎯 Objectif

Ce projet est un formulaire React permettant à un utilisateur de s’enregistrer avec les informations suivantes :

- Prénom
- Nom
- Email
- Date de naissance
- Ville
- Code postal

Il respecte toutes les contraintes de validation et inclut une suite complète de tests unitaires et d’intégration.

---

## 🚀 Fonctionnalités

- 🔒 Bouton de soumission désactivé tant que tous les champs ne sont pas remplis
- ❌ Messages d’erreur sous chaque champ invalide
- ✅ Toast de succès à l’enregistrement
- 🧹 Réinitialisation automatique des champs après soumission
- 💾 Sauvegarde des données dans `localStorage`
- 🧪 Couverture de test à 100 %

---

## 🧠 Règles de validation

Les validations sont centralisées dans `utils/validations.ts` :

| Champ        | Validation attendue                                                       |
|--------------|----------------------------------------------------------------------------|
| Prénom/Nom   | Pas de chiffres ou caractères spéciaux. Accents, trémas, tirets autorisés |
| Email        | Format classique `nom@domaine.com`                                         |
| Date de naissance | Doit avoir **au moins 18 ans**                                     |
| Ville        | Même règle que nom/prénom                                                 |
| Code postal  | Format français à **5 chiffres** (ex: `06000`)                            |

---

## 🧪 Tests & Couverture

Tests écrits avec **Jest** et **Testing Library** :

### ✅ Scénarios testés :
- Calcul de l’âge
- Validation des champs (tous les cas)
- Comportement du bouton
- Apparition des erreurs
- Toast de succès
- Réinitialisation des champs
- Couverture à **100%**

### 📊 Lancer les tests :

```bash
npm run test
npm run test -- --coverage
```
## 📦 Strucure du projet
src/
├── components/
│   └── Form.tsx
├── utils/
│   └── validations.ts
├── tests/
│   ├── Form.test.tsx
│   └── validations.test.ts
├── App.tsx
└── index.tsx

## 👨‍💻 Lancer le projet
```bash
npm install
npm run dev
```
