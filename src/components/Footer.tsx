import Link from "next/link";
import { Kode_Mono } from 'next/font/google'
import { GoatCounterSetup } from "./GoatCounterSetup";

const kodeMono = Kode_Mono({
  weight: '400',
  subsets: ['latin'],
})

export function Footer({
  href = "https://ko-fi.com/loshnlab",
  label = "Donate to running costs",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <footer>
      <p className="text-center text-xs text-gray-700 dark:text-gray-300">Page visitor counter:</p>
      <div
        id="goatcounter-page-views" 
        className={`${kodeMono.className} text-center text-lg text-green-500`}
      />
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
      <GoatCounterSetup appendTo="#goatcounter-page-views" />
    </footer>
    
  );
}