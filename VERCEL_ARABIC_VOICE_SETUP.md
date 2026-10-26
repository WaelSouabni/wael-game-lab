# Voix arabe gratuite — Wael Game Lab

Les neuf jeux utilisent désormais `nabra-tts`, un moteur de synthèse vocale arabe open source qui fonctionne dans le navigateur.

## Coût et installation

- Gratuit, sans compte, sans clé API et sans backend.
- Aucune installation de logiciel sur l'ordinateur.
- Au premier essai en arabe, le navigateur télécharge le moteur vocal (environ 16 Mo pour le modèle fp16, plus les fichiers d'exécution). Il est ensuite mis en cache par le navigateur.
- Le téléchargement initial nécessite une connexion Internet. La disponibilité du modèle dépend de CDN et de l'hébergement public.
- La voix disponible est en arabe standard moderne (pas un dialecte tunisien garanti).

## Utilisation

Ouvrir le jeu, sélectionner العربية et activer le son. Le premier lancement peut prendre un peu de temps pour télécharger le modèle. Ensuite, la génération vocale s'effectue localement dans le navigateur.

## Hébergement

Le projet peut rester sur GitHub Pages : aucune API Vercel ni clé Azure n'est requise. Le code charge la bibliothèque depuis jsDelivr et le modèle vocal depuis son dépôt public.
