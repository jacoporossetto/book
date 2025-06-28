// File: src/components/UserProfile.tsx

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Settings, Save, Award, Loader2, BookHeart, PenSquare, ThumbsUp, Check, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Liste di opzioni per la modifica del profilo
const availableGenres = [
  'Narrativa', 'Fantascienza', 'Fantasy', 'Giallo & Thriller', 'Romanzi Rosa', 'Storia', 
  'Biografia', 'Saggi', 'Filosofia', 'Psicologia', 'Arte', 'Poesia'
];
const availableVibes = [
    'Trama veloce', 'Introspezione', 'Umorismo', 'Avventura', 'Mistero', 'Atmosfera cupa', 'Riflessione', 'Leggero e divertente', 'Ispirazione'
];
const avatarColorNames = ['purple', 'blue', 'green', 'red', 'yellow', 'pink', 'teal', 'indigo', 'rose', 'orange'];

const colorMap = {
  purple: 'bg-purple-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  pink: 'bg-pink-500',
  teal: 'bg-teal-500',
  indigo: 'bg-indigo-500',
  rose: 'bg-rose-500',
  orange: 'bg-orange-500',
};

const UserProfile = ({ preferences, onPreferencesUpdate, totalBooks }) => {
  // --- SOLUZIONE: Tutti gli Hooks vengono chiamati qui, all'inizio e incondizionatamente ---
  const { toast } = useToast();
  // Inizializziamo lo stato con le preferenze o con un oggetto vuoto se non sono ancora pronte
  const [formData, setFormData] = useState(preferences || {});

  useEffect(() => {
    // Questo effetto sincronizza lo stato del form se le preferenze (props) cambiano
    if (preferences) {
      setFormData(preferences);
    }
  }, [preferences]);
  // --------------------------------------------------------------------------------------

  // Ora il controllo condizionale è sicuro perché avviene DOPO la chiamata a tutti gli Hooks
  if (!preferences) {
    return (
      <div className="p-4">
        <Card className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <p className="ml-2 text-muted-foreground">Caricamento del profilo...</p>
        </Card>
      </div>
    );
  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleToggle = (item: string, key: string) => {
    setFormData(prev => {
        const list = prev[key] || [];
        const newList = list.includes(item) ? list.filter(i => i !== item) : [...list, item];
        return {...prev, [key]: newList};
    });
  };

  const handleSave = () => {
    onPreferencesUpdate(formData);
    toast({
      title: "Profilo aggiornato",
      description: "Le tue preferenze sono state salvate con successo.",
    });
  };
  
  const getProfileCompleteness = () => {
    let score = 0;
    // L'optional chaining (?.) previene errori se una chiave non esiste ancora nel formData
    if (formData.name) score += 20;
    if (formData.favoriteGenres?.length > 0) score += 20;
    if (formData.favoriteAuthors?.length > 0) score += 15;
    if (formData.favoriteBooks?.length > 0) score += 15;
    if (formData.vibes?.length > 0) score += 15;
    if (formData.bio?.trim()) score += 15;
    return Math.min(100, score);
  };
  
  const completeness = getProfileCompleteness();
  
  const renderUserAvatar = () => {
    const colorClass = colorMap[formData.avatarColor] || 'bg-gray-500';
    const initials = formData.name ? formData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
    return <div className={`w-20 h-20 ${colorClass} rounded-full flex-shrink-0 flex items-center justify-center text-white text-3xl font-bold shadow-lg`}>{initials}</div>;
  };

  return (
    <div className="space-y-6 p-4">
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          {renderUserAvatar()}
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{formData.name}</h2>
            <p className="text-muted-foreground">Il tuo DNA Letterario</p>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <Card className="p-3 bg-white/50 dark:bg-gray-800/50 flex-1 text-center">
              <div className="text-xl font-bold text-green-600 dark:text-green-400">{completeness}%</div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Award className="w-3 h-3"/> Completezza</div>
            </Card>
            <Card className="p-3 bg-white/50 dark:bg-gray-800/50 flex-1 text-center">
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{totalBooks}</div>
              <div className="text-xs text-muted-foreground">Libri</div>
            </Card>
          </div>
        </div>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5"/> Modifica il Tuo Profilo</CardTitle>
          <CardDescription>Più dettagli ci fornisci, più le raccomandazioni saranno precise.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
                 <div>
                    <Label htmlFor="name">Il tuo nome</Label>
                    <Input id="name" value={formData.name || ''} onChange={handleChange} className="mt-1"/>
                </div>
                 <div>
                    <Label htmlFor="bio">Una breve descrizione di te</Label>
                    <Textarea id="bio" value={formData.bio || ''} onChange={handleChange} placeholder="Cosa ti piace leggere? Quali temi ti affascinano?" className="mt-1 min-h-[80px]"/>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="flex items-center gap-1.5 mb-2"><PenSquare className="w-4 h-4"/> Autori che Ami</Label>
                  <Textarea id="favoriteAuthors" value={formData.favoriteAuthors?.join(', ') || ''} onChange={e => setFormData({...formData, favoriteAuthors: e.target.value.split(',').map(s=>s.trim())})} placeholder="Separali con una virgola..."/>
                </div>
                <div>
                  <Label className="flex items-center gap-1.5 mb-2"><BookHeart className="w-4 h-4"/> Libri del Cuore</Label>
                  <Textarea id="favoriteBooks" value={formData.favoriteBooks?.join(', ') || ''} onChange={e => setFormData({...formData, favoriteBooks: e.target.value.split(',').map(s=>s.trim())})} placeholder="Separali con una virgola..."/>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="flex items-center gap-1.5 mb-2"><BookHeart className="w-4 h-4"/> Generi Preferiti</Label>
                   <div className="grid grid-cols-2 gap-2">
                    {availableGenres.map(genre => (
                        <div key={genre} onClick={() => handleToggle(genre, 'favoriteGenres')} className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${formData.favoriteGenres?.includes(genre) ? 'bg-purple-100 dark:bg-purple-900/50' : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100'}`}>
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${formData.favoriteGenres?.includes(genre) ? 'bg-purple-500 border-purple-500' : 'border-gray-300'}`}>{formData.favoriteGenres?.includes(genre) && <Check className="w-3 h-3 text-white"/>}</div>
                            <span className="text-sm">{genre}</span>
                        </div>
                    ))}
                   </div>
                </div>
                 <div>
                  <Label className="flex items-center gap-1.5 mb-2"><ThumbsUp className="w-4 h-4"/> "Vibes" che cerchi</Label>
                  <div className="grid grid-cols-2 gap-2">
                     {availableVibes.map(vibe => (
                        <div key={vibe} onClick={() => handleToggle(vibe, 'vibes')} className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${formData.vibes?.includes(vibe) ? 'bg-purple-100 dark:bg-purple-900/50' : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100'}`}>
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${formData.vibes?.includes(vibe) ? 'bg-purple-500 border-purple-500' : 'border-gray-300'}`}>{formData.vibes?.includes(vibe) && <Check className="w-3 h-3 text-white"/>}</div>
                            <span className="text-sm">{vibe}</span>
                        </div>
                    ))}
                  </div>
                </div>
            </div>

            <div>
                <Label className="flex items-center gap-1.5 mb-2"><Palette className="w-4 h-4"/> Colore Avatar</Label>
                <div className="flex flex-wrap gap-3">
                    {avatarColorNames.map(colorName => (
                        <button key={colorName} onClick={() => setFormData({...formData, avatarColor: colorName})} className={`w-10 h-10 rounded-full border-4 transition-all ${formData.avatarColor === colorName ? `border-purple-500` : 'border-transparent hover:border-purple-200'}`}>
                           <div className={`w-full h-full rounded-full ${colorMap[colorName]}`}></div>
                        </button>
                    ))}
                </div>
            </div>
            
            <Button onClick={handleSave} className="w-full h-11 text-base"><Save className="w-4 h-4 mr-2"/> Salva le Modifiche</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
