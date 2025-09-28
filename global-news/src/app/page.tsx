import Globe from "./components/Globe"; 
import Link from "next/link";
//import HighlightsPanel from "./components/HighlightsPanel";

export default function Home() {
  return (
    <main className="h-screen bg-gray-900 text-white overflow-hidden relative flex flex-col">
      {/* Newspaper Panel on the left */}
      {/*<HighlightsPanel />*/}

      {/* Top section for the title */}
      <div className="w-full text-center pt-10 z-10">
        <h1 className="text-8xl font-bold mb-4"> Global News Network</h1>
        <p className="mb-6 text-lg text-gray-300">
          Explore trusted local stories around the world
        </p>
      </div>

      {/* Globe now sits in the background, filling the available space */}
      <div className="absolute top-0 left-0 w-full h-full">
        <Globe />
      </div>

      {/* Button is positioned at the bottom */}
      <div className="absolute bottom-10 w-full text-center z-10">
        <Link href="/feed/miami">
          <button className="px-6 py-3 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-500 transition">
            Enter Your Local Network
          </button>
        </Link>
      </div>
    </main>
  );
}