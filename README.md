# 🎈 Wael Game Lab

Des mini-jeux gratuits pour les enfants de **5 ans et plus**, en **français et en arabe** : observation, logique, nombres, lettres, routines, émotions et confiance en soi.

**Sans publicité, sans compte enfant, sans chat et sans installation sur l'appareil.** Les jeux sont des pages HTML ; la voix arabe en ligne passe par une fonction sécurisée hébergée sur Vercel.

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

> **Voix arabe en ligne :** sur Vercel, les consignes arabes sont générées par l'API TTS de Munsit. La clé reste côté serveur (`MUNSIT_API_KEY`) et n'est jamais exposée dans le navigateur. GitHub Pages seul ne peut pas exécuter cette fonction serveur : pour la voix arabe en ligne, utiliser le déploiement Vercel.

### Configurer la voix arabe sur Vercel

1. Créer une clé API gratuite sur [Munsit](https://app.munsit.com/) (10 000 crédits offerts, sans carte bancaire au moment de la rédaction).
2. Dans Vercel → projet **wael-game-lab** → **Settings → Environment Variables**, ajouter `MUNSIT_API_KEY` avec la clé, pour **Production** et **Preview**.
3. Redéployer le projet pour appliquer la variable.
4. Tester un jeu en arabe et toucher un bouton du jeu pour déclencher la lecture.

Ne jamais mettre la clé dans un fichier HTML, GitHub ou du JavaScript côté navigateur.

> Ces jeux sont un outil ludique de découverte. Ils ne remplacent pas l'avis d'un professionnel et ne posent aucun diagnostic.

## Progression commune FunisLearn (5 niveaux)

Le moteur partagé est disponible dans `assets/js/funis-progression.js` et son interface dans `assets/css/funis-progression.css`. Il est sans dépendance et conserve les données localement dans `localStorage` sous la clé `funislearn-progress-v1`.

### Contrat d'intégration d'un jeu

Chaque page de jeu doit charger les deux ressources avec des chemins relatifs adaptés à son emplacement, puis initialiser le moteur avec son identifiant stable :

```html
<link rel="stylesheet" href="../assets/css/funis-progression.css">
<script src="../assets/js/funis-progression.js"></script>
```

```js
const progression = FunisProgress.init('formes', { totalLevels: 5 });
const niveauActuel = progression.getCurrentLevel();

// Appeler uniquement après la réussite réelle du niveau.
// Le score doit refléter la performance du jeu (score et score maximal).
progression.completeLevel({
  level: niveauActuel,
  score: scoreObtenu,
  maxScore: scoreMaximum
});
```

Le moteur expose aussi `selectLevel(level)`, `getProgress()`, `reset()` et les événements `funis:level-completed`, `funis:level-changed` et `funis:all-levels-complete`. Le jeu doit écouter `funis:level-changed` pour générer les exercices correspondant au niveau choisi. Ne pas déclarer un niveau réussi depuis un simple clic ou un chargement de page.

La page de menu lit les données enregistrées et affiche les étoiles et le niveau de progression. Les données restent sur l'appareil et ne sont pas synchronisées entre navigateurs ou appareils. Le moteur respecte `prefers-reduced-motion` et utilise des textes français/arabe selon la langue de la page.

**Important :** le moteur commun et l'affichage du menu sont ajoutés dans la branche de travail, mais chaque jeu doit encore être raccordé à son propre événement de réussite et à sa difficulté pédagogique avant que sa progression soit active de bout en bout. Cette étape doit être faite jeu par jeu pour préserver la logique existante et la voix arabe.

### Vérifications avant publication

- Réussir un niveau et vérifier que les étoiles sont enregistrées.
- Actualiser la page et confirmer que le niveau débloqué est conservé.
- Vérifier qu'un niveau verrouillé ne peut pas être sélectionné.
- Tester les textes en arabe avec `dir="rtl"` et la lecture vocale existante.
- Tester sur téléphone, clavier et avec la préférence de réduction des animations activée.
- Effacer les données du site uniquement dans un environnement de test pour vérifier le cas d'une première visite.

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
