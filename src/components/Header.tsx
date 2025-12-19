import Link from "next/link";

type NavLink = {
  href: string;
  label: string;
};


export function Header({
    title = "LoshnLab",
    links = [
        { href: "/verbs", label: "Verbs" },
    ]
} : {
    title?: string;
    links?: NavLink[];
}) {
    return (
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-6">
          <Link href="/" className="font-semibold text-lg text-gray-900 dark:text-gray-100"
          >
            {title}
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-4">
            {links.map(l => (
                <Link 
                  key={l.label}
                  href={l.href}
                  className="text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  {l.label}
                </Link>
            ))}
          </nav>
        </div>
      </header>
    )
}