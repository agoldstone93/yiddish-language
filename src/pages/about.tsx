import Link from "next/link";

export default function About() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1 className="text-3xl font-bold">About LoshnLab</h1>
      <p className="text-gray-600 dark:text-gray-400">
        LoshnLab is a project dedicated to providing resources for learning and exploring
        the Yiddish language, with a focus on verbs and their various forms. It contains a
        searchable database of Yiddish verbs, conjugated for each tense, with 
        transliterations and English meanings.
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        Each of the verb pages are editable via a simple CMS interface, allowing
        users to contribute corrections or additional information to help improve the
        resource for everyone. At the moment, there are only a handful of verbs, so it
        would be great for users to add more verbs and their conjugations.
      </p>

      <p className="text-gray-600 dark:text-gray-400">
        The website is completely free to use and open source. You can find the source code
        on
        <Link className="text-blue-300 hover:underline" 
              href="https://github.com/agoldstone93/yiddish-language"
        >
          GitHub
        </Link>.
      </p>

      <h2 className="text-2xl font-semibold">Contributing</h2>
      <p className="text-gray-600 dark:text-gray-400">
        If you&apos;re interested in contributing to LoshnLab, whether by adding new verbs,
        or improving the existing data, click &quot;Add or Edit Verbs&quot; in the header.
        This will take you to the CMS interface where you can create an account to make
        changes. Please make sure to review your changes before submitting.
      </p>
    </div>
  );
}