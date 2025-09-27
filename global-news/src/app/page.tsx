import Globe from "./components/Globe"; 
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-4">🌍 Global News Network</h1>
      <p className="mb-6 text-lg text-gray-300">
        Explore trusted local stories around the world
      </p>

      {/* Globe */}
      <Globe />

      {/* Button to enter feed */}
      <Link href="/feed/miami">
        <button className="mt-6 px-6 py-3 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-500 transition">
          Enter Your Local Network
        </button>
      </Link>
    </main>
  );
}
