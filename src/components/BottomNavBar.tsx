// File: src/components/BottomNavBar.tsx

import { Camera, Library, BarChart3, User, Map } from "lucide-react"; // Aggiunta icona Map
import { cn } from "@/lib/utils";

const navItems = [
  { id: 'home', label: 'Scanner', icon: Camera },
  { id: 'library', label: 'Libreria', icon: Library },
  // --- NUOVA SCHEDA ---
  { id: 'map', label: 'Librerie', icon: Map },
  // --------------------
  { id: 'stats', label: 'Statistiche', icon: BarChart3 },
  { id: 'profile', label: 'Profilo', icon: User },
];

interface BottomNavBarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700">
      {/* Ora la griglia ha 5 colonne */}
      <div className="grid h-full grid-cols-5 max-w-lg mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "inline-flex flex-col items-center justify-center px-2 sm:px-5 font-medium transition-colors duration-200 group",
              activeTab === item.id 
                ? "text-purple-600 dark:text-purple-400" 
                : "text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
            )}
          >
            <item.icon className={cn(
                "w-6 h-6 mb-1 transition-transform duration-200",
                activeTab === item.id ? "scale-110" : "group-hover:scale-110"
            )} />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
