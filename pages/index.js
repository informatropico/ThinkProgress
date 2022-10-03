import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <h1>Think progress</h1>
      <h2>Sono ancora molto brutto ma funziono</h2>

      <div className="container">
        <Link href="/post/blog/blog">
          <a>Blog</a>
        </Link>
        <div></div>
        <Link href="/post/weeklysummary/weekly-summary">
          <a>Weekly Summary</a>
        </Link>
      </div>
    </div>
  );
}
