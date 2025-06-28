import { useState, useRef } from 'react';
import { 
  BarcodeScanner, 
  BarcodeFormat,
  type PluginListenerHandle 
} from '@capacitor-mlkit/barcode-scanning';
import { useToast } from "@/hooks/use-toast";

export const useBarcodeScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();
  const listenerRef = useRef<PluginListenerHandle | null>(null);

  const checkPermissions = async (): Promise<boolean> => {
    // Verifica se il dispositivo supporta la scansione
    const { supported } = await BarcodeScanner.isSupported();
    if (!supported) {
      throw new Error("Scanner non supportato su questo dispositivo.");
    }

    // Controlla i permessi attuali
    const { camera } = await BarcodeScanner.checkPermissions();
    
    if (camera === 'granted') {
      return true;
    }
    
    if (camera === 'denied') {
      // Prova a richiedere i permessi
      const { camera: newPermission } = await BarcodeScanner.requestPermissions();
      
      if (newPermission === 'granted') {
        return true;
      }
      
      throw new Error("Permesso fotocamera negato. Abilita i permessi nelle impostazioni del browser o dell'app.");
    }
    
    if (camera === 'restricted') {
      throw new Error("L'accesso alla fotocamera è limitato su questo dispositivo.");
    }

    // Per altri stati (prompt, etc.), richiedi i permessi
    const { camera: requestedPermission } = await BarcodeScanner.requestPermissions();
    if (requestedPermission === 'granted') {
        return true;
    }

    throw new Error("Impossibile ottenere i permessi per la fotocamera.");
  };

  const startScan = async (): Promise<string | null> => {
    setIsScanning(true);
    try {
      await checkPermissions();

      const { barcodes } = await BarcodeScanner.scan({
        formats: [
          BarcodeFormat.QrCode,
          BarcodeFormat.Ean13,
          BarcodeFormat.Ean8,
          BarcodeFormat.Code128,
        ]
      });

      if (barcodes && barcodes.length > 0) {
        const scannedCode = barcodes[0].rawValue;
        return scannedCode;
      }
      
      return null;
      
    } catch (error) {
      console.error('Errore durante la scansione:', error);
      // Rilancia l'errore per farlo gestire dal componente UI
      if (error instanceof Error) {
          throw error;
      }
      throw new Error("Si è verificato un errore sconosciuto durante la scansione.");
    } finally {
      setIsScanning(false);
    }
  };

  // ... (il resto del file rimane invariato)
  // scanFromImage, checkGoogleModule, etc.

  const stopScan = async () => {
    try {
      if (listenerRef.current) {
        await listenerRef.current.remove();
        listenerRef.current = null;
      }
      await BarcodeScanner.stopScan();
      document.body.classList.remove('barcode-scanner-active');
      setIsScanning(false);
    } catch (error) {
      console.error('Errore durante lo stop della scansione:', error);
      setIsScanning(false);
      document.body.classList.remove('barcode-scanner-active');
    }
  };

  return {
    isScanning,
    startScan,
    stopScan,
  };
};