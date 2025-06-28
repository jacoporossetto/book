// File: src/components/PersonalLibrary.tsx

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Library, Search, Star, Trash2, Edit3, BookOpenCheck, Glasses, BookCopy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PersonalLibrary = ({ books, onBooksUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editData, setEditData] = useState({ userRating: 0, userReview: '', readingStatus: 'want-to-read' });
  const { toast } = useToast();

  const filteredAndSortedBooks = books
    .filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase()) || book.authors?.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())))
    .sort((a, b) => {
      // ... logica di sorting ...
      switch (sortBy) {
        case 'title': return a.title.localeCompare(b.title);
        case 'rating': return (b.recommendation?.rating || 0) - (a.recommendation?.rating || 0);
        default: return new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime();
      }
    });

  const openEditDialog = (book) => {
    setSelectedBook(book);
    setEditData({
      userRating: book.userRating || 0,
      userReview: book.userReview || '',
      readingStatus: book.readingStatus || 'want-to-read'
    });
    setIsDialogOpen(true);
  };
  
  const handleBookUpdate = () => {
    const originalIndex = books.findIndex(b => b.isbn === selectedBook.isbn && b.scannedAt === selectedBook.scannedAt);
    const updatedBooks = [...books];
    updatedBooks[originalIndex] = { 
        ...selectedBook, 
        ...editData,
        reviewDate: new Date().toISOString()
    };
    onBooksUpdate(updatedBooks);
    localStorage.setItem('scannedBooks', JSON.stringify(updatedBooks));
    toast({ title: "Libro aggiornato!" });
    setIsDialogOpen(false);
  };

  const handleDeleteBook = (book) => {
    const updatedBooks = books.filter(b => !(b.isbn === book.isbn && b.scannedAt === book.scannedAt));
    onBooksUpdate(updatedBooks);
    localStorage.setItem('scannedBooks', JSON.stringify(updatedBooks));
    toast({ title: "Libro rimosso.", variant: "destructive" });
  };
  
  const renderStars = (rating, interactive = false, onStarClick = null) => (
    Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-6 h-6 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} ${interactive ? 'cursor-pointer' : ''}`} onClick={interactive ? () => onStarClick(i + 1) : null} />)
  );
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'read': return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Letto</Badge>;
      case 'reading': return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">In lettura</Badge>;
      default: return <Badge variant="secondary">Da leggere</Badge>;
    }
  };

  const booksByStatus = {
    'reading': filteredAndSortedBooks.filter(book => book.readingStatus === 'reading'),
    'want-to-read': filteredAndSortedBooks.filter(book => (book.readingStatus || 'want-to-read') === 'want-to-read'),
    'read': filteredAndSortedBooks.filter(book => book.readingStatus === 'read'),
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">La Mia Libreria</h1>
          <p className="text-muted-foreground">{books.length} libri</p>
      </div>

      <div className="sticky top-0 bg-gray-50 dark:bg-gray-900 py-2 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input placeholder="Cerca nella tua libreria..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-12 text-base" />
        </div>
      </div>
      
      <Tabs defaultValue="reading" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reading"><Glasses className="w-4 h-4 mr-1 sm:mr-2"/> In Lettura</TabsTrigger>
          <TabsTrigger value="want-to-read"><BookCopy className="w-4 h-4 mr-1 sm:mr-2"/> Da Leggere</TabsTrigger>
          <TabsTrigger value="read"><BookOpenCheck className="w-4 h-4 mr-1 sm:mr-2"/> Letti</TabsTrigger>
        </TabsList>
        
        {Object.entries(booksByStatus).map(([status, booksInStatus]) => (
          <TabsContent key={status} value={status} className="mt-4 space-y-4">
            {booksInStatus.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">Nessun libro qui.</div>
            ) : (
              booksInStatus.map(book => (
                <Card key={`${book.isbn}-${book.scannedAt}`} className="shadow-md">
                  <CardContent className="p-4 flex gap-4">
                    <img src={book.thumbnail} alt={book.title} className="w-20 h-28 object-cover rounded-md flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                      <h3 className="font-semibold line-clamp-2">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">{book.authors?.join(', ')}</p>
                      <div className="flex items-center gap-1">{book.userRating > 0 && renderStars(book.userRating)}</div>
                      {getStatusBadge(book.readingStatus)}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button size="icon" variant="outline" onClick={() => openEditDialog(book)}><Edit3 className="w-4 h-4"/></Button>
                        <Button size="icon" variant="destructive" onClick={() => handleDeleteBook(book)}><Trash2 className="w-4 h-4"/></Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Dialog per Modifica */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
         <DialogContent>
            <DialogHeader>
                <DialogTitle>Modifica "{selectedBook?.title}"</DialogTitle>
                <DialogDescription>Aggiorna lo stato di lettura, la tua valutazione e le tue note.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
                <div>
                    <Label>Stato di lettura</Label>
                    <Select value={editData.readingStatus} onValueChange={(value) => setEditData(prev => ({...prev, readingStatus: value}))}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="want-to-read">Da leggere</SelectItem>
                            <SelectItem value="reading">In lettura</SelectItem>
                            <SelectItem value="read">Letto</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>La tua valutazione</Label>
                    <div className="flex gap-1 mt-2">{renderStars(editData.userRating, true, (rating) => setEditData(prev => ({...prev, userRating: rating})))}</div>
                </div>
                <div>
                    <Label>La tua recensione</Label>
                    <Textarea value={editData.userReview} onChange={(e) => setEditData(prev => ({...prev, userReview: e.target.value}))} placeholder="Scrivi qui le tue impressioni..."/>
                </div>
            </div>
            <Button onClick={handleBookUpdate} className="w-full">Salva Modifiche</Button>
         </DialogContent>
      </Dialog>
    </div>
  );
};

export default PersonalLibrary;
