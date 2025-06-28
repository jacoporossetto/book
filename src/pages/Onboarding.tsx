// File: src/pages/Onboarding.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const availableGenres = [
  'Narrativa', 'Fantascienza', 'Fantasy', 'Giallo & Thriller', 'Romanzi Rosa', 'Storia', 
  'Biografia', 'Saggi', 'Filosofia', 'Psicologia', 'Arte', 'Poesia'
];

const availableVibes = [
    'Trama veloce', 'Introspezione', 'Umorismo', 'Avventura', 'Mistero', 'Atmosfera cupa', 'Riflessione', 'Leggero e divertente', 'Ispirazione'
];

// Il componente ora accetta 'currentUser' come prop
const OnboardingPage = ({ currentUser }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);
  const [favoriteAuthors, setFavoriteAuthors] = useState('');
  const [favoriteBooks, setFavoriteBooks] = useState('');
  const [vibes, setVibes] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleToggle = (item: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleNextStep = () => {
    if (step === 1 && name.trim()) setStep(2);
    else if (step === 2 && favoriteGenres.length >= 3) setStep(3);
    else if (step === 3) setStep(4);
  };

  const handleFinish = () => {
    const userPreferences = {
      name,
      favoriteGenres,
      favoriteAuthors: favoriteAuthors.split(',').map(a => a.trim()).filter(a => a),
      favoriteBooks: favoriteBooks.split(',').map(b => b.trim()).filter(b => b),
      vibes,
      readingGoal: 12,
      avatarColor: ['purple', 'blue', 'green', 'red', 'yellow', 'pink'][Math.floor(Math.random() * 6)]
    };
    
    // --- MODIFICA CHIAVE: Salviamo le preferenze con l'UID dell'utente ---
    if (currentUser) {
        localStorage.setItem(`userPreferences_${currentUser.uid}`, JSON.stringify(userPreferences));
        toast({ title: `Profilo creato, ${name}!`, description: "La tua avventura letteraria può iniziare." });
        navigate('/'); // Reindirizza alla pagina principale
    } else {
        toast({ title: "Errore", description: "Utente non trovato, impossibile salvare il profilo.", variant: "destructive"});
    }
  };

  // Il resto del componente (renderStep, etc.) rimane invariato
  const renderStep = () => {
    // ...
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        {/* ... */}
    </div>
  );
}
export default OnboardingPage;
