import Link from "next/link";

export function Footer({
  href = "https://ko-fi.com/loshnlab",
  label = "Donate to running costs (optional)",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <footer>
      <div className="mx-auto max-w-5xl px-4 py-4 text-sm underline underline-offset-4 text-gray-700 dark:text-gray-300 flex justify-center">
        <Link
          href={href}
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          target="_blank"
          rel="noopener noreferrer"
        >
          {label}
        </Link>
      </div>
    </footer>
  );
}