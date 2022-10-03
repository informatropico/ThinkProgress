---
fonti:
    - "https://github.com/informatropico/nextjs-sample-blog/blob/main/README.md"
    - "https://blog.openreplay.com/creating-a-markdown-blog-powered-by-next-js-in-under-an-hour"
---

# Think progress

In questa pagina sono raccolti tutti gli aggiornamenti e le evoluzioni tecniche del progetto (in inglese ci sono dei copia e incolla da articoli che trovate linkati in alto)

## Versione 1: l'inizio

L'obiettivo di questa versione è far funzionare il sito riuscendo a mostrare i contenuti desiderati:

- una home page con due link: blog e weekly summary

- una pagina per ognuno dei due link sopra con la lista dei contenuti cliccabile

- i contenuti recuperati da informatropico.it

Non mi concentrerò troppo sul layout della pagina che verrà gestito in una fase successiva insieme al raffinamento della home page.

### Setup

```shell
npx create-next-app next-blog
cd next-blog

# Run the project
npm run dev
```

#### Style

```shell
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest

#init
npx tailwindcss init -p
```

##### Setup Style

tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

styles/global.css

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

### Layout

To create a layout in Next.js, create a `components` folder in your project.

Inside that folder, create a `layout.js` file.

The critical part here is that we accept `children` as property and render them in the `main` element.

We have to open up our `_app.js` file to use this newly created layout. This file is the entry point for your entire application.

```jsx
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="mb-8 py-4">
        <div className="container mx-auto flex justify-center">
          <Link href="/">
            <a>Think Progress</a>
          </Link>
          <Link href="/post/blog/blog">
            <a>Blog</a>
          </Link>
          <Link href="/post/weeklysummary/weekly-summary">
            <a>Weekly Summary</a>
          </Link>
          <Link href="/about">
            <a>About</a>
          </Link>
        </div>
      </header>
      <main className="container mx-auto flex-1">{children}</main>
      <footer className="mt-8 py-4">
        <div className="container mx-auto flex justify-center">
          &copy; 2022 Informatropico
        </div>
      </footer>
    </div>
  );
}
```

### Post

Since we’ll be using markdown for our posts, create a new folder at the root of your project called `posts`, con due sottocartelle: `blog` e `weeklysummary`.

Each file will also become the URL of the article, so keep this in mind.

Add the images in the `public/images` directory.

Si tratta ora di poter recuperare i post e renderli accessibili nelle rispettive pagine.

Dovranno essere visualizzati:

- titolo

- sottotitolo

- data

per i blog.

Dovrà essere visualizzata "Settimana <sab> - <dom>" per i weekly summary.

Si deve essere in grado di leggere i dati del frontmatter e il contenuto dei file markdown:

```shell
npm install gray-matter
```

Nelle pagine weekly-summary e blog importo i seguenti pacchetti:

```jsx
import fs from 'fs';
import matter from 'gray-matter';
import Image from 'next/image';
import Link from 'next/link';
```

La funzione centrale del processo è `getStaticProps`.

```jsx
import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";

export async function getStaticProps() {
  // Get all our posts
  const files = fs.readdirSync("posts/blog");
  const posts = files.map((fileName) => {
    const slug = fileName.replace(".md", ""); // define the slug (URL) for the page, which is the filename without the .md part
    const readFile = fs.readFileSync(`posts/blog//${fileName}`, "utf-8"); // read the file by using the fs module again
    const { data: frontmatter } = matter(readFile); // use the matter package to read the file and extract the data object, but we destructure it as the variable frontmatter.

    return {
      slug,
      frontmatter,
    };
  });

  posts.sort((a, b) => a.frontmatter.date < b.frontmatter.date ? 1 : -1);

  return {
    props: {
      posts,
    },
  };
}

export default function Blog({ posts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 md:p-0">
      {posts.map(({ slug, frontmatter }) => (
        <div
          key={slug}
          className="border border-gray-200 m-2 rounded-xl shadow-lg overflow-hidden flex flex-col"
        >
          <Link href={`/post/blog/${slug}`}>
            <a>
              <h1 className="p-4">{frontmatter.title}</h1>
              <h2 className="p-5">{frontmatter.subtitle}</h2>
              <h2 className="p-6">{frontmatter.date}</h2>
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
}
```

#### Visualizzare i post

We can leverage Next.js dynamic routing, allowing one file to render all our posts!

To create this file, create a `post` directory inside the `pages` directory and inside this folder, add a file called `[slug].js`.

```shell
npm install markdown-it

#oppure
npm install remark remark-html
```

```shell
npm install -D @tailwindcss/typography    
```

tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}
```

##### Gestione di più tipi di pagina

Ho gestito percorsi diversi degli slug per le pagine del weekly summary e del blog.

```jsx
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export async function getStaticPaths() {
  // Retrieve all our slugs
  const files = fs.readdirSync("posts/blog");

  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace(".md", ""),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const fileName = fs.readFileSync(`posts/blog/${slug}.md`, "utf-8");
  const { data: frontmatter, content } = matter(fileName);

  const processedContent = await remark()
    .use(html)
    .process(content);
  const contentHtml = processedContent.toString();

  return {
    props: {
      frontmatter,
      contentHtml,
    },
  };
}

export default function BlogPage({ frontmatter, contentHtml }) {
  return (
    <div className="prose mx-auto">
      <h1>{frontmatter.title}</h1>
      <h2>{frontmatter.subtitle}</h2>
      <h3>{frontmatter.date}</h3>
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </div>
  );
}

```

### Pubblicazione su Vercel

https://www.thinkprogress.it/post/blog/blog
