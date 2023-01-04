import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from 'remark-gfm'
import Link from "next/link";
import {MdHomeFilled, MdNavigateNext, MdNavigateBefore} from "react-icons/md"

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

function Navigation(props) {
  if ((props.next !== "null") && (props.prev !== "null")) {
    return (
      <div className="px-2 flex space-x-5 font-mono">
        <Link href={`/post/blog/${props.prev}`} className=" m-2 p-2 rounded-xl overflow-hidden">
          <MdNavigateBefore />
        </Link>
        <IntestazionePost data={props.data} titolo={props.titolo} sottotitolo={props.sottotitolo} />
        <Link href={`/post/blog/${props.next}`} className=" m-2 p-2 rounded-xl overflow-hidden">
          <MdNavigateNext />
        </Link>
      </div>
    );
  } else {
    if (props.next !== "null") {
      return (
        <div className="px-2 flex space-x-5 font-mono">
          <Link href={`/`} className=" m-2 p-2 rounded-xl overflow-hidden">
            <MdHomeFilled />
          </Link>
          <IntestazionePost data={props.data} titolo={props.titolo} sottotitolo={props.sottotitolo}/>
          <Link href={`/post/blog/${props.next}`} className=" m-2 p-2 rounded-xl overflow-hidden">
            <MdNavigateNext />
          </Link>
        </div>
      );
    } else {
      return (
        <div className="px-2 flex space-x-5 font-mono">
          <Link href={`/post/blog/${props.prev}`} className="m-2 p-2 rounded-xl overflow-hidden">
            <MdNavigateBefore />
          </Link>
          <IntestazionePost data={props.data} titolo={props.titolo} sottotitolo={props.sottotitolo}/>
          <Link href={`/`} className=" m-2 p-2 rounded-xl overflow-hidden">
          <MdHomeFilled />
          </Link>
        </div>
      );
    }
  }
}

function IntestazionePost(props) {
  return (
    <div className="flex flex-col items-center text-center">
      <h3 className="text-xs border-b text-gray-500">{props.data}</h3>
      <h1 className="text-xl mb-1">{props.titolo}</h1>
      <h2 className="text-sm text-gray-500 mt-0">{props.sottotitolo}</h2>
    </div>
  )
}

export default function BlogPage({ frontmatter, contentHtml }) {
  return (
    <div className="prose flex flex-col items-center">
      <Navigation prev={frontmatter.prev} next={frontmatter.next} data={frontmatter.date} titolo={frontmatter.title} sottotitolo={frontmatter.subtitle} />
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} className="text-justify px-4"/>
    </div>
  );
}
