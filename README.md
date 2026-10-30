# 🎈 Wael Game Lab

**Wael Game Lab** (également présenté sous le nom **FunisLearn**) est un projet personnel de mini-jeux éducatifs gratuits destiné principalement aux enfants à partir de 5 ans. Les activités sont proposées en français et en arabe.

🌐 **Site en ligne :** https://wael-game-lab.vercel.app  
💻 **Dépôt :** https://github.com/WaelSouabni/wael-game-lab

## Fonctionnalités

- 13 mini-jeux accessibles depuis la page d'accueil et le menu des jeux.
- Interface bilingue français/arabe, avec adaptation de la lecture arabe en RTL.
- Jeux conçus pour de courtes activités : observation, logique, calcul, lettres, routines, émotions, mémoire et environnement.
- Interface responsive, utilisable sur ordinateur, tablette et téléphone.
- Pas de publicité, de compte enfant, de chat ni d'installation obligatoire.
- Progression locale sur l'appareil pour les fonctionnalités qui l'utilisent.
- Lecture vocale arabe via le service serveur Vercel lorsqu'il est configuré ; une voix native du navigateur peut servir de solution de repli si elle existe.

## Catalogue des jeux

| Jeu | Objectif | Fichier |
|---|---|---|
| 🌷 Le jardin des formes | Observer et classer les formes | [jardin-des-formes.html](games/jardin-des-formes.html) |
| 🌈 Complète la suite | Repérer et compléter des suites | [complete-la-suite.html](games/complete-la-suite.html) |
| 🤖 Guide le petit robot | Logique et initiation à la programmation | [guide-le-robot.html](games/guide-le-robot.html) |
| 🕵️ Trouve l'ombre | Observer et associer les silhouettes | [trouve-lombre.html](games/trouve-lombre.html) |
| 🔢 Compte les objets | Compter les objets | [compte-les-objets.html](games/compte-les-objets.html) |
| 🔤 Les lettres | Découvrir les lettres françaises et arabes | [les-lettres.html](games/les-lettres.html) |
| 🌼 Le jardin des lettres | Reconnaître les lettres arabes et leurs sons | [jardin-des-lettres.html](games/jardin-des-lettres.html) |
| ⏰ Ma journée dans l'ordre | Reconstituer les routines quotidiennes | [ma-journee-dans-lordre.html](games/ma-journee-dans-lordre.html) |
| 😊 Mon humeur du jour | Identifier et exprimer ses émotions | [mon-humeur-du-jour.html](games/mon-humeur-du-jour.html) |
| 🎁 La boîte à compliments | Identifier ses qualités et renforcer la confiance | [la-boite-a-compliments.html](games/la-boite-a-compliments.html) |
| 🔤 Lettres et mots | Écouter et associer les lettres et les mots | [les-lettres-et-les-mots.html](games/les-lettres-et-les-mots.html) |
| ➕ Défi de calcul | S'entraîner au calcul | [defi-de-calcul.html](games/defi-de-calcul.html) |
| 🇹🇳 Mémoire tunisienne | Retrouver des paires autour du patrimoine tunisien | [memoire-tunisienne.html](games/memoire-tunisienne.html) |
| ♻️ Héros de l'environnement | Apprendre à trier et à protéger l'environnement | [heros-de-environnement.html](games/heros-de-environnement.html) |

> Le catalogue contient 14 entrées listées ci-dessus. Le nombre affiché dans cette documentation est volontairement à vérifier avec les fichiers du dossier `games/` lors de chaque ajout ou retrait.

Le menu de lancement se trouve dans [games/menu-accueil.html](games/menu-accueil.html).

## Structure du dépôt

```text
.
├── api/
│   └── tts.js                    # Endpoint serveur pour la voix arabe
├── assets/
│   ├── css/
│   │   └── funis-progression.css # Styles du module de progression
│   └── js/
│       └── funis-progression.js  # Module de progression partagé
├── games/                        # Pages HTML des jeux et menu
├── tests/
│   └── games.test.js              # Tests automatisés Node.js
├── index.html                     # Page d'accueil bilingue
├── package.json
└── VERCEL_ARABIC_VOICE_SETUP.md   # Configuration et diagnostic TTS
```

## Langue arabe et mise en page

La page d'accueil conserve la disposition et l'ordre visuel de la version française. En arabe, seuls les blocs de texte concernés adoptent une direction RTL ; le conteneur général, les rangées, les cartes et les éléments de navigation ne doivent pas être inversés globalement. Le nom **Wael Game Lab** reste en LTR.

Pour les nouvelles interfaces bilingues :
- définir correctement `lang` et `dir` sur le document ou sur le bloc de texte concerné ;
- isoler les noms de marque, URLs, chiffres et fragments latins avec `dir="ltr"` ou `unicode-bidi: isolate` lorsque nécessaire ;
- tester les deux langues sur mobile et ordinateur ;
- ne pas appliquer `direction: rtl` à un parent de mise en page si cela inverse l'ordre des composants.

## Voix arabe (Vercel)

L'endpoint `/api/tts` est implémenté dans [api/tts.js](api/tts.js). Il utilise Munsit côté serveur. La clé `MUNSIT_API_KEY` doit être configurée dans les variables d'environnement du projet Vercel.

Consulter [VERCEL_ARABIC_VOICE_SETUP.md](VERCEL_ARABIC_VOICE_SETUP.md) pour les étapes de configuration et le diagnostic. Ne jamais placer la clé API dans le HTML, dans le JavaScript exécuté dans le navigateur ou dans le dépôt Git.

**À savoir :** GitHub Pages peut héberger les pages statiques, mais ne peut pas exécuter la fonction serveur `/api/tts`. Pour la voix arabe fournie par le serveur, utiliser le déploiement Vercel.

## Progression FunisLearn

Le dépôt contient un module partagé :
- `assets/js/funis-progression.js`
- `assets/css/funis-progression.css`

Les données de progression sont conservées dans le stockage local du navigateur. Elles ne sont pas synchronisées entre appareils ou navigateurs. Avant de présenter la progression comme active dans un jeu, vérifier que cette page appelle le module au bon moment, après une réussite réelle, et que le menu affiche les données attendues. La présence du module partagé ne signifie pas à elle seule que chaque jeu est entièrement raccordé.

## Développement local

Prérequis : Node.js.

```bash
git clone https://github.com/WaelSouabni/wael-game-lab.git
cd wael-game-lab
npm test
npx serve .
```

Il est aussi possible d'ouvrir `index.html` directement pour parcourir la partie statique. Les fonctions serveur, notamment `/api/tts`, nécessitent un environnement compatible avec les fonctions Vercel.

## Tests

Lancer les tests avec :

```bash
npm test
```

Le script appelle `node tests/games.test.js`. Tester également manuellement les deux langues, les liens de navigation, l'affichage mobile et le comportement vocal sur les appareils cibles.

## Déploiement

Le dépôt utilise la branche par défaut `master`. Le projet Vercel est associé au dépôt et son URL de production est :

https://wael-game-lab.vercel.app

Après un push sur la branche suivie par Vercel, vérifier le statut du déploiement dans Vercel avant de considérer la version publique comme mise à jour.

GitHub Pages peut servir la partie statique si elle est activée dans **Settings → Pages**. La fonction vocale serveur ne fonctionnera pas sur GitHub Pages seul.

## Principes de conception

- Encourager l'essai et l'apprentissage sans sanctionner les erreurs.
- Privilégier des interactions simples, tactiles et adaptées aux enfants.
- Limiter les données conservées au strict nécessaire et les garder localement lorsque possible.
- Respecter les préférences de réduction des animations.
- Présenter les jeux comme des activités ludiques, et non comme des outils de diagnostic.

## Licence

MIT — voir [LICENSE](LICENSE).
