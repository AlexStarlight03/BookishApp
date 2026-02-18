<<<<<<< HEAD
Pour lancer le projet, clonez le repo sur votre machine.

Ouvrez le dossier BookishApp dans VSCode (ou autre éditeur de votre choix)

Exécutez les commandes suivantes pour installer les dépendances du projet

```
cd .\Bookish-backend\
npm install -D typescript ts-node-dev @types/node
npm run build
```

Exécutez la commande suivante pour lancer le serveur (et ainsi pourvoir effectuer les tests)

```
npm run dev
```

Pour faire les tests, ouvrez dans VSCode le fichier test.rest (se trouvant dans bookish-backend)
Cliquez sur Send Request sous chaque commande, les tests peuvent être effectués tant que le serveur est en marche.
Les tests sont faits pour être effectués en ordre pour faciliter le tout. Un test peut être réeffectué pour tester les champs uniques.
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> master
