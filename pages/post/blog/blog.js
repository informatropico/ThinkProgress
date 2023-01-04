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

function LinkPost(props) {
  return (
    <div className="flex flex-col items-center text-center">
      <h3 className="text-xs border-b text-gray-500">{props.data}</h3>
      <h1 className="text-xl">{props.titolo}</h1>
      <h2 className="text-sm text-gray-700">{props.sottotitolo}</h2>
    </div>
  )
}

export default function Blog({ posts }) {
  return (
    <ul className="items-center mx-auto">
      {posts.map(({ slug, frontmatter }) => (
        <li
          key={slug}
          className="m-4 flex flex-col items-center font-mono hover:bg-gray-200 p-3 rounded-lg"
        >
          <Link href={`/post/blog/${slug}`} className="no-underline">
            <LinkPost data={frontmatter.date} titolo={frontmatter.title} sottotitolo={frontmatter.subtitle} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
