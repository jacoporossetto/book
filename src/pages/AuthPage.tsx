// File: src/pages/AuthPage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Semplice icona di Google in formato SVG
const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.519-3.486-11.025-8.121l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.021,35.84,44,30.134,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Bentornato!" });
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: "Account creato con successo!", description: "Ora puoi accedere." });
      }
      navigate('/');
    } catch (error: any) {
      toast({ title: "Errore di autenticazione", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        toast({ title: "Accesso con Google riuscito!" });
        navigate('/');
    } catch (error: any) {
        toast({ title: "Errore con Google", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mx-auto bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full w-fit mb-4">
                <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          <CardTitle className="text-2xl">{isLogin ? 'Accedi a BookScan AI' : 'Crea un Nuovo Account'}</CardTitle>
          <CardDescription>{isLogin ? 'Inserisci le tue credenziali per continuare.' : 'Pochi passi per unirti alla nostra community.'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGoogleSignIn} variant="outline" className="w-full h-11"><GoogleIcon/> Continua con Google</Button>
          <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">oppure</span></div></div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <Button onClick={handleAuth} disabled={loading} className="w-full h-11">
            {loading ? 'Caricamento...' : (isLogin ? 'Accedi' : 'Registrati')}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Non hai un account?" : "Hai già un account?"}
            <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="px-1">{isLogin ? "Registrati" : "Accedi"}</Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
