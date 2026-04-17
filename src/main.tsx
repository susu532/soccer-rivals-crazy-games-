/**
 * @copyright 2026 hentertrabelsi
 * @contact Email: hentertrabelsi@gmail.com
 * @discord #susuxo
 * 
 * All rights reserved. This software is proprietary and confidential.
 * You may not use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software without explicit permission.
 */
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { adManager } from './utils/ads';

// Boot CrazyGames SDK early and notify of loading
if (typeof window !== 'undefined' && window.CrazyGames && window.CrazyGames.SDK) {
  try {
    if (typeof window.CrazyGames.SDK.init === 'function') {
      window.CrazyGames.SDK.init().then(() => {
        adManager.triggerLoadingStart();
      }).catch(() => {
        adManager.triggerLoadingStart();
      });
    } else {
      adManager.triggerLoadingStart();
    }
  } catch (e) {
    console.warn("SDK init failed", e);
    adManager.triggerLoadingStart();
  }
} else {
  adManager.triggerLoadingStart();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);


/**
 * @copyright 2026 hentertrabelsi - All Rights Reserved
 */
