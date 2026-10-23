import Link from "next/link";
import Image from 'next/image';
import { useRouter } from "next/router";

type NavLink = {
  href: string;
  label: string;
};

const defaultLeftLinks: NavLink[] = [
  { href: "/", label: "Search" },
  { href: "/about", label: "About" },
  { href: "/guides", label: "Guides" },
];

const defaultRightLinks: NavLink[] = [
  { href: "/admin", label: "Add verbs / edit content" },
];

export function Header({
  leftLinks = defaultLeftLinks,
  rightLinks = defaultRightLinks,
}: {
  title?: string;
  leftLinks?: NavLink[];
  rightLinks?: NavLink[];
}) {
  const router = useRouter();
  
  const isActive = (href: string) => {
    if (href === "/") {
      return router.asPath === "/";
    }
    return router.asPath === href || router.asPath.startsWith(href + "/");
  };
  return (
    <header className="border-b border-border-default bg-white/80 dark:bg-gray-900/70 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <nav aria-label="Primary" className="flex items-center gap-4">
            <Link href="/">
              <Image
                loading="eager"
                src="/logo.svg"
                alt="LoshnLab logo"
                width={130}
                height={30}
                className="inline-block dark:invert h-7.5 w-32.5"
              />
            </Link>
            {leftLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={`${l.href === "/" ? "hidden sm:inline" : ""} text-sm ${
                  isActive(l.href)
                  ? "text-foreground font-semibold"
                  : "text-link hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <nav aria-label="Secondary" className="flex items-center gap-4">
          {rightLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`text-sm ${
                isActive(l.href)
                  ? "text-foreground font-semibold"
                  : "text-link hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}