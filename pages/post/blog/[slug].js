import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from 'remark-gfm'

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
    .use(remarkGfm)
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
    <div className="prose mx-auto px-5">
      <h1>{frontmatter.title}</h1>
      <h2>{frontmatter.subtitle}</h2>
      <h3>{frontmatter.date}</h3>
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </div>
  );
}
