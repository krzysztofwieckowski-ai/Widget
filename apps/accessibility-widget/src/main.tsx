import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import CallPage from './CallPage';
import { CALL_PAGE_PATH } from './callNavigation';
import './index.css';

// Two pages in one app: the widget (/) and the separate video call page (/call).
const isCallPage = window.location.pathname === CALL_PAGE_PATH;

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isCallPage ? <CallPage /> : <App />}</StrictMode>,
);
