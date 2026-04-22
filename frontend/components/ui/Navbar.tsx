import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-slate-800 tracking-tight hover:text-blue-600 transition-colors">
          Blog
        </Link>
        <nav className="text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-800 transition-colors">
            หน้าแรก
          </Link>
        </nav>
      </div>
    </header>
  );
}