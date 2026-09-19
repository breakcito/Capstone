import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

export const PlaceholderPage = ({ titulo }: { titulo: string }) => (
  <div className="max-w-xl mx-auto">
    <h1 className="text-lg font-semibold text-white mb-6">{titulo}</h1>
    <div
      className="flex flex-col items-center py-16 rounded-xl 
      bg-zinc-900 border border-dashed border-zinc-700"
    >
      <WrenchScrewdriverIcon className="w-10 h-10 text-zinc-600 mb-4" />
      <p className="text-zinc-400">En construcción</p>
    </div>
  </div>
);
