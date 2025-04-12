import { useEffect } from 'react';

export function useTelegram() {
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    
    tg.expand();
    tg.enableClosingConfirmation();
    
    return () => {
      // Очистка при размонтировании
      tg.disableClosingConfirmation();
    };
  }, []);
  
  return {
    tg: window.Telegram?.WebApp,
    user: window.Telegram?.WebApp.initDataUnsafe?.user
  };
}