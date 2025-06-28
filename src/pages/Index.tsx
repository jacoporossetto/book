// File: src/pages/Index.tsx

import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

// --- MODIFICA CHIAVE: Importiamo il nuovo loader per la mappa ---
import LazyBookstoreMap from '@/components/LazyBookstoreMap'; 

// Importa gli altri componenti
import BookScanner from "@/components/BookScanner";
import PersonalLibrary from "@/components/PersonalLibrary";
import UserProfile from "@/components/UserProfile";
import Statistics from "@/components/Statistics";
import { BottomNavBar } from '@/components/BottomNavBar';
import { BookOpen } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [scannedBooks, setScannedBooks] = useState([]);
  const [userPreferences, setUserPreferences] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedBooks = localStorage.getItem('scannedBooks');
      if (savedBooks) setScannedBooks(JSON.parse(savedBooks));
      const savedPrefs = localStorage.getItem('userPreferences');
      if (savedPrefs) setUserPreferences(JSON.parse(savedPrefs));
    } catch (error) { console.error(error); }
  }, []);

  const handleBookScanned = (bookData) => {
    const newBooks = [...scannedBooks, { ...bookData, scannedAt: new Date().toISOString() }];
    setScannedBooks(newBooks);
    localStorage.setItem('scannedBooks', JSON.stringify(newBooks));
    toast({ title: "Libro aggiunto!", description: `"${bookData.title}" è ora nella tua libreria.` });
  };

  const handlePreferencesUpdate = (preferences) => {
    setUserPreferences(preferences);
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    toast({ title: "Profilo aggiornato!", description: "Le tue preferenze sono state salvate." });
  };

  const renderHeader = () => {
    if (['library', 'map', 'stats', 'profile'].includes(activeTab)) return null;
    return (
      <div className="text-center p-6 pt-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-2xl shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">BookScan AI</h1>
        </div>
        {userPreferences && <p className="text-lg text-muted-foreground">Ciao {userPreferences.name}, pronto a scoprire?</p>}
      </div>
    );
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <BookScanner onBookScanned={handleBookScanned} userPreferences={userPreferences} libraryBooks={scannedBooks} />;
      case 'library':
        return <PersonalLibrary books={scannedBooks} onBooksUpdate={setScannedBooks} />;
      // --- MODIFICA CHIAVE: Usiamo il componente lazy per la mappa ---
      case 'map':
        return <LazyBookstoreMap />;
      // -----------------------------------------------------------
      case 'stats':
        return <Statistics books={scannedBooks} userPreferences={userPreferences} />;
      case 'profile':
        return <UserProfile preferences={userPreferences} onPreferencesUpdate={handlePreferencesUpdate} totalBooks={scannedBooks.length} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 pb-24">
      {renderHeader()}
      <main>
        {renderActiveTabContent()}
      </main>
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Index;
