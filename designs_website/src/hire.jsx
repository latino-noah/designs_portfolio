import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/jetbrains-mono';
import 'lenis/dist/lenis.css';
import './styles/base.css';
import Hire from './pages/Hire.jsx';

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Hire />
  </StrictMode>
);
