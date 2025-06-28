// File: src/components/BookScanner.tsx

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Loader2, Search, AlertCircle, Smartphone, Sparkles } from "lucide-react";
import BookRecommendation from "./BookRecommendation";
import { useBarcodeScanner } from '@/hooks/useBarcodeScanner'; // Importiamo l'hook per lo scanner

interface BookData {
  title: string;
  authors: string[];
  description: string;
  categories: string[];
  thumbnail: string;
  userRating?: number;
  recommendation?: any;
  scannedAt: string;
  readingStatus?: string;
  reviewDate?: string;
  // Aggiungi altri campi se necessario
  publishedDate?: string;
  pageCount?: number;
  averageRating?: number;
  ratingsCount?: number;
  isbn: string;
}

interface BookScannerProps {
  onBookScanned: (book: BookData) => void;
  userPreferences?: any;
  libraryBooks: BookData[];
}

const BookScanner: React.FC<BookScannerProps> = ({ onBookScanned, userPreferences, libraryBooks }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [manualIsbn, setManualIsbn] = useState('');
  const [scannedBook, setScannedBook] = useState<BookData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // --- CORREZIONE: Reintroduciamo l'hook per lo scanner ---
  const { isScanning, startScan } = useBarcodeScanner();

  const fetchAiRating = async (book: Omit<BookData, 'recommendation' | 'scannedAt'>) => {
    setIsRating(true);
    
    const readingHistory = libraryBooks
      .filter(b => b.readingStatus === 'read' && b.userRating)
      .sort((a, b) => new Date(b.reviewDate || 0).getTime() - new Date(a.reviewDate || 0).getTime())
      .slice(0, 10)
      .map(b => ({ title: b.title, userRating: b.userRating }));

    try {
      const response = await fetch('http://localhost:3001/api/rate-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book, userPreferences, readingHistory }),
      });

      if (!response.ok) throw new Error('Errore durante la generazione del rating AI.');
      return await response.json();

    } catch (err) {
      console.error("Errore fetchAiRating:", err);
      return { rating: 3, short_reasoning: 'Impossibile generare un rating AI.' };
    } finally {
      setIsRating(false);
    }
  };

  const handleIsbnInput = async (isbn: string) => {
    setIsSearching(true);
    setError(null);
    setScannedBook(null);

    try {
        const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
        const response = await fetch(url);
        const data = await response.json();
        if (!data.items || data.items.length === 0) throw new Error('Libro non trovato.');
        
        const bookInfo = data.items[0].volumeInfo;
        const initialBookData = {
            title: bookInfo.title || 'Titolo sconosciuto',
            authors: bookInfo.authors || ['Autore sconosciuto'],
            description: bookInfo.description || 'Nessuna descrizione.',
            categories: bookInfo.categories || [],
            thumbnail: bookInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || 'https://via.placeholder.com/150x200?text=No+Cover',
            publishedDate: bookInfo.publishedDate || 'N/A',
            pageCount: bookInfo.pageCount || 0,
            averageRating: bookInfo.averageRating || 0,
            ratingsCount: bookInfo.ratingsCount || 0,
            isbn: isbn,
        };
        
        setIsSearching(false);
        setScannedBook({ ...initialBookData, scannedAt: new Date().toISOString() });

        const aiRecommendation = await fetchAiRating(initialBookData);
        setScannedBook(prevBook => prevBook ? { ...prevBook, recommendation: aiRecommendation } : null);

    } catch (err) {
        setError(err instanceof Error ? err.message : "Si è verificato un errore.");
        setIsSearching(false);
    }
  };
  
  // --- CORREZIONE: Reintroduciamo la funzione per la scansione ---
  const handleCameraScan = async () => {
    setError(null);
    setScannedBook(null);
    try {
      const scannedCode = await startScan();
      if (scannedCode) {
        await handleIsbnInput(scannedCode);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore fotocamera imprevisto.");
    }
  };

  const handleAcceptBook = () => {
    if (scannedBook) {
      onBookScanned(scannedBook);
      setScannedBook(null);
      setManualIsbn('');
      setError(null);
    }
  };

  return (
    <div className="p-4 space-y-6">
       <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl"><Camera className="w-6 h-6" />Scanner ISBN</CardTitle>
          <CardDescription>Scansiona un codice a barre o inseriscilo manualmente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* --- CORREZIONE: Reintroduciamo il pulsante per la fotocamera --- */}
          <Button
            onClick={handleCameraScan}
            className="w-full h-20 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            disabled={isScanning || isSearching}
          >
            {isScanning ? (
              <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> Scansionando...</>
            ) : (
              <><Camera className="w-6 h-6 mr-2" /> Scansiona con Fotocamera</>
            )}
          </Button>
          
          <Button
            onClick={() => handleIsbnInput('9788804680584')} // ISBN di esempio per la demo
            variant="outline"
            className="w-full h-14"
            disabled={isScanning || isSearching}
          >
            <Smartphone className="w-5 h-5 mr-2"/>Demo Scanner (ISBN Casuale)
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Oppure</span></div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="isbn-manual">Inserisci ISBN manualmente:</Label>
            <div className="flex gap-2">
              <Input id="isbn-manual" placeholder="es. 9780143127741" value={manualIsbn} onChange={e => setManualIsbn(e.target.value)} />
              <Button onClick={() => handleIsbnInput(manualIsbn)} disabled={!manualIsbn || isSearching}><Search className="w-4 h-4"/></Button>
            </div>
          </div>
        </CardContent>
       </Card>

      {(isSearching || isRating || scannedBook) &&
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="w-6 h-6 text-purple-500"/> Analisi AI</CardTitle>
          </CardHeader>
          <CardContent>
            {(isSearching || isRating) ? (
              <div className="flex items-center justify-center h-44">
                <Loader2 className="w-8 h-8 mr-2 animate-spin text-purple-500" />
                <p className="text-muted-foreground">{isSearching ? 'Cerco il libro...' : 'Analizzo i tuoi gusti...'}</p>
              </div>
            ) : scannedBook && (
              <BookRecommendation
                book={scannedBook}
                isRating={isRating}
                onAccept={handleAcceptBook}
                onReject={() => setScannedBook(null)}
              />
            )}
          </CardContent>
        </Card>
      }
    </div>
  );
};

export default BookScanner;
