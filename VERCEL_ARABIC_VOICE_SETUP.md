# Déployer Wael Game Lab avec une voix arabe en ligne

Les pages utilisent maintenant `POST /api/speech` pour générer une voix arabe en MP3. La clé du service vocal reste côté serveur et ne doit jamais être ajoutée au HTML ni au dépôt GitHub.

## 1. Déployer sur Vercel

1. Ouvrir https://vercel.com/new et importer le dépôt GitHub `WaelSouabni/wael-game-lab`.
2. Garder la racine du projet à `./` et le framework en détection automatique / projet statique.
3. Déployer le projet. Vercel détecte automatiquement la fonction `api/speech.js`.
4. Utiliser ensuite l'URL Vercel du projet pour ouvrir les jeux. La voix en ligne ne fonctionnera pas sur GitHub Pages, car GitHub Pages n'exécute pas les fonctions API.

## 2. Créer la ressource vocale Azure

1. Dans le portail Azure, créer une ressource **Speech** (Azure AI Speech) et choisir la région de la ressource.
2. Dans **Keys and Endpoint**, copier une clé et noter la région exacte.
3. Dans Vercel > projet > **Settings > Environment Variables**, ajouter :
   - `AZURE_SPEECH_KEY` : la clé Azure (type Sensitive/Encrypted si disponible).
   - `AZURE_SPEECH_REGION` : l'identifiant de région Azure, par exemple celui affiché dans la ressource.
4. Appliquer les variables à **Production**, **Preview** et **Development** selon le besoin, puis redéployer.

Ne jamais publier la clé Azure dans GitHub, dans un fichier JavaScript client, ni dans une URL.

## 3. Tester

Depuis l'URL Vercel, ouvrir un jeu, choisir العربية et activer 🔊. La fonction utilise la voix neurale `ar-TN-ReemNeural`. Si Azure ne propose pas cette voix dans la région choisie ou si la ressource est mal configurée, consulter les logs de la fonction dans Vercel.

## Limite actuelle

Le code de l'API est prêt dans `api/speech.js`, et les neuf jeux appellent cette API. Il faut encore connecter le dépôt à un projet Vercel et renseigner les deux variables Azure ci-dessus avant que l'audio arabe en ligne soit réellement disponible.
