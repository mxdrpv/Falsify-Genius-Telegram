// src/App.jsx
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.expand();
    return () => tg.disableClosingConfirmation();
  }, []);

  const handleSend = () => {
    window.Telegram.WebApp.sendData(JSON.stringify({
      action: "game_completed",
      score: 100
    }));
  };

  return (
    <div>
      <h1>Falsify Genius</h1>
      {/* Ваша игровая логика на React */}
      <button onClick={handleSend}>Отправить результат</button>
    </div>
  );
}
