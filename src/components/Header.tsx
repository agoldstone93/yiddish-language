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
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 flex items-stretch justify-between gap-6">
        <div className="flex items-stretch gap-6">
          <nav aria-label="Primary" className="flex items-stretch gap-4">
            <Link href="/" className="flex items-center">
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
                className={`${l.href === "/" ? "hidden sm:flex" : "flex"} items-center text-sm pt-1.5  ${
                  isActive(l.href)
                    ? "text-gray-900 dark:text-gray-100 border-b-2 border-gray-900 dark:border-gray-100"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 border-b-2 border-transparent"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <nav aria-label="Secondary" className="flex items-stretch gap-4">
          {rightLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`flex items-stretch text-sm py-3 ${
                isActive(l.href)
                  ? "text-gray-900 dark:text-gray-100 border-b-2 border-gray-900 dark:border-gray-100"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 border-b-2 border-transparent"
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