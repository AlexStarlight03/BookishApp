import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 sm:py-32">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
          Game<span className="text-[#6c47ff]">Vault</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg sm:text-xl text-gray-400">
          Gerez votre collection de jeux video, notez vos jeux, suivez votre
          progression et decouvrez les collections des autres joueurs.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/explore"
            className="border border-gray-600 hover:border-gray-400 text-foreground font-medium rounded-full px-6 py-3 transition-colors"
          >
            Explorer les collections
          </Link>
        </div>
      </section>
    </main>
  );
}
