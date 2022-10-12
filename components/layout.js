import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="mb-8 py-4">
        <nav className="container px-4 justify-center flex space-x-10">
          <Link href="/">
            <a className="">Think Progress</a>
          </Link>
          <Link href="/post/blog/blog">
            <a className="">Blog</a>
          </Link>
          <Link href="/post/weeklysummary/weekly-summary">
            <a className="">Weekly Summary</a>
          </Link>
          <Link href="/about">
            <a className="">About</a>
          </Link>
        </nav>
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
