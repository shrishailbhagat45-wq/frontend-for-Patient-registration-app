import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import App from './App';

export default function RootLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      navigate('/home', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  return <App />;
}
