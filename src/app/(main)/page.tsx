import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 sm:py-32">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight drop-shadow-lg">
          Bienvenue sur <span className="text-primary">Bookish</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg sm:text-xl text-gray-300">
          Gérez vos lectures et vos critiques de livres en toute simplicité avec <span className="font-semibold text-primary">Bookish</span>, votre compagnon de lecture ultime. Découvrez, organisez et partagez vos expériences littéraires avec une communauté passionnée.
        </p>

        <div className="px-6 py-10">
          <Link
            href="/dashboard"
            className="border border-primary hover:bg-primary hover:text-white text-primary font-semibold rounded-full px-8 py-3 transition-colors duration-200 shadow-lg"
          >
            Mon Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}