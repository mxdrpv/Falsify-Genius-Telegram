export default function App() {
  return (
    <div>
      <h1>Falsify Genius</h1>
      <p>Telegram Mini App работает!</p>
    </div>
  );
}
import { useTelegram } from './hooks/useTelegram';

function App() {
  const { tg, user } = useTelegram();

  const handleClose = () => {
    tg.close();
  };

  return (
    <div>
      <h1>Привет, {user?.first_name || 'друг'}!</h1>
      <button onClick={handleClose}>
        Закрыть приложение
      </button>
    </div>
  );
}