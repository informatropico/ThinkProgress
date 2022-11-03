import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";

export async function getStaticProps() {
  // Get all our posts
  const files = fs.readdirSync("posts/weeklysummary");
  const posts = files.map((fileName) => {
    const slug = fileName.replace(".md", ""); // define the slug (URL) for the page, which is the filename without the .md part
    const readFile = fs.readFileSync(`posts/weeklysummary/${fileName}`,"utf-8"); // read the file by using the fs module again
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

export default function WeeklySummary({ posts }) {
  return (
    <div className="list-none prose mx-auto">
      {posts.map(({ slug, frontmatter }) => (
        <div
          key={slug}
          className="border border-gray-200 m-2 rounded-xl shadow-lg overflow-hidden flex flex-col"
        >
          <Link href={`/post/weeklysummary/${slug}`}>
            <a className="no-underline">
              <h1 className="pt-4 pb-0 pl-4">Settimana {frontmatter.week}</h1>
              <h3 className="pt-0 pb-4 pl-4">dal {frontmatter.sab} al {frontmatter.dom}</h3>
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
}
