# Voix arabe — Wael Game Lab

Les jeux qui intègrent la lecture vocale essaient d'abord le service vocal du site, puis utilisent une voix arabe native du navigateur si elle est disponible.

## Configuration nécessaire pour le service vocal

Le endpoint `/api/tts` utilise le fournisseur Munsit. Sur le projet Vercel lié au dépôt :

1. Ouvrir **Settings → Environment Variables**.
2. Ajouter `MUNSIT_API_KEY` avec une clé API valide obtenue auprès de Munsit.
3. Activer la variable pour les environnements souhaités (Production, et Preview si nécessaire).
4. Redéployer le projet après l'ajout ou la modification de la variable.
5. Tester un jeu en arabe et vérifier la requête `/api/tts` dans l'onglet Network.

La clé doit rester côté serveur : ne jamais la placer dans le JavaScript du navigateur ni dans le dépôt Git.

## Limites et diagnostic

- Si `/api/tts` répond avec `503 tts_not_configured`, la variable `MUNSIT_API_KEY` n'est pas disponible dans l'environnement Vercel qui exécute la fonction.
- Si le fournisseur échoue, les jeux tentent la synthèse vocale native lorsque l'appareil dispose d'une voix arabe.
- La disponibilité des voix natives varie selon le navigateur, le système et les langues installées. Ce repli ne garantit donc pas l'audio sur tous les appareils.
- Si le service Munsit et la voix native sont tous deux indisponibles, le jeu affiche un message de diagnostic au lieu de prétendre que l'audio a démarré.
- La voix du fournisseur est configurée en arabe standard moderne ; elle ne garantit pas un dialecte tunisien.
