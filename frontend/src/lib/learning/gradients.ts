export interface GradientPreset {
  id: string;
  name: string;
  classes: string; // Tailwind gradient classes
}

export const GRADIENTS: GradientPreset[] = [
  { id: "gradient-1",  name: "Sunset",    classes: "from-orange-400 via-pink-500 to-rose-600" },
  { id: "gradient-2",  name: "Ocean",     classes: "from-cyan-400 via-blue-500 to-indigo-600" },
  { id: "gradient-3",  name: "Forest",    classes: "from-emerald-400 via-green-500 to-teal-600" },
  { id: "gradient-4",  name: "Lavender",  classes: "from-purple-400 via-violet-500 to-indigo-500" },
  { id: "gradient-5",  name: "Peach",     classes: "from-amber-300 via-orange-400 to-red-500" },
  { id: "gradient-6",  name: "Midnight",  classes: "from-slate-700 via-slate-800 to-slate-900" },
  { id: "gradient-7",  name: "Candy",     classes: "from-pink-400 via-fuchsia-500 to-purple-600" },
  { id: "gradient-8",  name: "Sky",       classes: "from-sky-300 via-cyan-400 to-blue-500" },
  { id: "gradient-9",  name: "Lime",      classes: "from-lime-300 via-green-400 to-emerald-500" },
  { id: "gradient-10", name: "Rose",      classes: "from-rose-300 via-pink-400 to-fuchsia-500" },
];

export function getGradientClasses(id: string): string {
  return GRADIENTS.find((g) => g.id === id)?.classes ?? GRADIENTS[0].classes;
}