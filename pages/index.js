import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";
import Image from "next/image";

export async function getStaticProps() {
  // Get all our posts
  const files = fs.readdirSync("posts/blog");
  const posts = files.map((fileName) => {
    const slug = fileName.replace(".md", ""); // define the slug (URL) for the page, which is the filename without the .md part
    const readFile = fs.readFileSync(`posts/blog/${fileName}`, "utf-8"); // read the file by using the fs module again
    const { data: frontmatter } = matter(readFile); // use the matter package to read the file and extract the data object, but we destructure it as the variable frontmatter.

    return {
      slug,
      frontmatter,
    };
  });

  posts.sort((a, b) => a.frontmatter.date < b.frontmatter.date ? 1 : -1);

  const lastPost = posts[0];

  return {
    props: {
      lastPost,
    },
  };
}

export default function Home(props) {
  return (
    <>
      <>
      <div className="prose flex flex-col items-center">
        <Image src={"/images/tp.png"} alt={"logo thinkprogress"} width={500} height={500} />
        <Link href={`/post/blog/${props.lastPost.slug}`} className="font-mono text-xl">Leggi il mio ultimo post</Link>
      </div>
    </>
    </>
  );
}
