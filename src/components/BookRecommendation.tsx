// File: src/components/BookRecommendation.tsx

import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, ThumbsDown, Loader2, Sparkles, CheckCircle2, XCircle } from "lucide-react";

const BookRecommendation = ({ book, isRating, onAccept, onReject }) => {
  
  const renderStars = (rating) => {
    // ... (funzione invariata)
    if (typeof rating !== 'number') return null;
    let stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(<Star key={i} className={`w-5 h-5 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />);
    }
    return stars;
  };

  const recommendation = book.recommendation;

  return (
    <CardContent className="space-y-4 p-0">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0 mx-auto md:mx-0">
          <img src={book.thumbnail} alt={book.title} className="w-32 h-48 object-cover rounded-lg shadow-lg" />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-xl font-bold">{book.title}</h3>
            <p className="text-muted-foreground font-medium">di {book.authors?.join(', ')}</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <h4 className="font-semibold text-lg mb-2 flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-500"/> Analisi AI</h4>
            {isRating ? (
              <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin" /><span>Sto creando una recensione su misura per te...</span></div>
            ) : recommendation ? (
              <div className="space-y-4">
                <div className="text-center bg-white dark:bg-slate-900 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">Punteggio Affinità</p>
                    <p className="text-5xl font-bold text-purple-600 dark:text-purple-400">{recommendation.rating.toFixed(1)}</p>
                    <div className="flex justify-center">{renderStars(recommendation.rating)}</div>
                </div>
                <p className="text-center font-semibold italic text-muted-foreground">"{recommendation.short_reasoning}"</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h5 className="font-semibold mb-2 flex items-center gap-1.5 text-green-600"><CheckCircle2 className="w-4 h-4"/> Potrebbe Piacerti Perché...</h5>
                        <ul className="list-disc list-inside space-y-1 pl-1">
                            {recommendation.positive_points.map((point, i) => <li key={i}>{point}</li>)}
                        </ul>
                    </div>
                     {recommendation.negative_points.length > 0 && (
                        <div>
                           <h5 className="font-semibold mb-2 flex items-center gap-1.5 text-amber-600"><XCircle className="w-4 h-4"/> Punti di Attenzione</h5>
                           <ul className="list-disc list-inside space-y-1 pl-1">
                               {recommendation.negative_points.map((point, i) => <li key={i}>{point}</li>)}
                           </ul>
                        </div>
                    )}
                </div>
              </div>
            ) : <p className="text-muted-foreground">Nessuna raccomandazione disponibile.</p>}
          </div>
        </div>
      </div>
      <div className="flex gap-3 pt-4 border-t">
        <Button onClick={onAccept} className="flex-1" disabled={isRating}><ThumbsUp className="w-4 h-4 mr-2" /> Aggiungi</Button>
        <Button onClick={onReject} variant="outline" className="flex-1"><ThumbsDown className="w-4 h-4 mr-2" /> Scarta</Button>
      </div>
    </CardContent>
  );
};

export default BookRecommendation;
