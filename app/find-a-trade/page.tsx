import { SearchBar } from "@/components/SearchBar";

export const metadata = {
  title: "Find a Tradesperson | CV Trades Directory",
  description: "Search for trusted local tradespeople across the CV postcode area. Find electricians, plumbers, builders and more.",
};

export default function FindATradePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-24">
      <div className="w-full max-w-2xl text-center mb-10">
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Find a Trade</p>
        <h1 className="text-3xl font-black text-gray-900 sm:text-4xl mb-3">
          Who do you need?
        </h1>
        <p className="text-gray-500 text-base">
          Select an area and trade category to find trusted local professionals across Coventry and Warwickshire.
        </p>
      </div>
      <div className="w-full max-w-3xl">
        <SearchBar showLabels />
      </div>
    </div>
  );
}
