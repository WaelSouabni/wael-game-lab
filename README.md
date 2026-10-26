# 🎈 Wael Game Lab

Des mini-jeux gratuits pour les enfants de **5 ans et plus**, en **français et en arabe** : observation, logique, nombres, lettres, routines, émotions et confiance en soi.

**Sans publicité, sans compte, sans chat.** Chaque jeu est une simple page HTML : aucun serveur, aucune installation.

👉 **Jouer** : ouvrir [`index.html`](index.html) (ou la page GitHub Pages, voir plus bas).

## Les jeux

| Jeu | Compétence | Fichier |
|---|---|---|
| 🌷 Le jardin des formes | Observer et classer | `games/jardin-des-formes.html` |
| 🌈 Complète la suite | Motifs et suites logiques | `games/complete-la-suite.html` |
| 🤖 Guide le petit robot | Logique, bases de la programmation | `games/guide-le-robot.html` |
| 🕵️ Trouve l'ombre | Observation des détails | `games/trouve-lombre.html` |
| 🔢 Compte les objets | Compter jusqu'à 10 | `games/compte-les-objets.html` |
| 🔤 Les lettres | Première lettre d'un mot (alphabet français et arabe) | `games/les-lettres.html` |
| ⏰ Ma journée dans l'ordre | Routines et notion du temps | `games/ma-journee-dans-lordre.html` |
| 😊 Mon humeur du jour | Mettre des mots sur ses émotions | `games/mon-humeur-du-jour.html` |
| 🎁 La boîte à compliments | Découvrir ses forces, confiance en soi | `games/la-boite-a-compliments.html` |

`games/menu-accueil.html` réunit les 9 jeux avec un profil simple (avatar et surnom).

## Principes de conception

- **Pas d'échec punitif** : une erreur donne un encouragement, puis un indice après deux essais. Jamais de « perdu ».
- **L'effort avant le résultat** : les badges (Persévérant, Observateur…) récompensent la persévérance.
- **Vie privée** : le surnom, la langue et la progression restent dans le navigateur de l'appareil (`localStorage`). Rien n'est envoyé nulle part.
- **Tactile d'abord** : gros boutons, utilisable aussi au clavier, mode sombre, animations réduites si l'appareil le demande.
- **Bilingue** : français et arabe (lecture de droite à gauche), avec une voix qui lit les consignes.

> La voix utilise la synthèse vocale du navigateur : une voix arabe doit être installée sur l'appareil. À terme, des voix enregistrées en arabe tunisien et en français remplaceront la synthèse.

> Ces jeux sont un outil ludique de découverte. Ils ne remplacent pas l'avis d'un professionnel et ne posent aucun diagnostic.

## Lancer en local

```bash
git clone https://github.com/WaelSouabni/wael-game-lab.git
cd wael-game-lab
npx serve .        # ou ouvrir index.html directement dans le navigateur
```

## Tests

La logique de chaque jeu (génération des niveaux, indices, badges, journal…) est testée avec Node.js, sans dépendance.

```bash
npm test
```

## Publier avec GitHub Pages

1. Dépôt → **Settings** → **Pages**.
2. *Source* : **Deploy from a branch**, branche `main`, dossier `/ (root)`.
3. Le site sera disponible sur `https://waelsouabni.github.io/wael-game-lab/`.

## Pistes pour la suite

- Lien « retour au menu » dans chaque jeu.
- Voix enregistrées (arabe tunisien et français) à la place de la synthèse vocale.
- Espace parent avec suivi de progression.
- Application installable (PWA) et utilisable hors connexion.
- Essais avec de vrais enfants, puis avis d'éducatrices et d'ergothérapeutes.

## Licence

MIT.
