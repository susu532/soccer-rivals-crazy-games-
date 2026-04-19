import { soundManager } from './audio';

export const adManager = {
  triggerLoadingStart: () => {
    try {
      if (typeof window !== 'undefined' && window.CrazyGames?.SDK?.game?.loadingStart) {
        window.CrazyGames.SDK.game.loadingStart();
      }
    } catch {
      /* ignore */
    }
  },
  triggerLoadingStop: () => {
    try {
      if (typeof window !== 'undefined' && window.CrazyGames?.SDK?.game?.loadingStop) {
        window.CrazyGames.SDK.game.loadingStop();
      }
    } catch {
      /* ignore */
    }
  },
  triggerGameplayStart: () => {
    try {
      if (typeof window !== 'undefined' && window.CrazyGames?.SDK?.game?.gameplayStart) {
        window.CrazyGames.SDK.game.gameplayStart();
      }
    } catch {
      /* ignore */
    }
  },
  triggerGameplayStop: () => {
    try {
      if (typeof window !== 'undefined' && window.CrazyGames?.SDK?.game?.gameplayStop) {
        window.CrazyGames.SDK.game.gameplayStop();
      }
    } catch {
      /* ignore */
    }
  },
  triggerMidRoll: () => {
    console.log('[AdManager] Triggering Mid-roll Ad...');
    try {
      const SDKObj = (typeof window !== 'undefined' && window.CrazyGames) ? window.CrazyGames.SDK as unknown as Record<string, unknown> : null;
      if (SDKObj && SDKObj.code !== 'sdkNotInitialized' && SDKObj.code !== 'sdkDisabled') {
        const adObj = SDKObj.ad as Record<string, unknown>;
        if (adObj && typeof adObj.requestAd === 'function') {
          adObj.requestAd('midgame', {
            callbacks: {
              adStarted: () => {
                console.log('Mid-roll started');
                soundManager.setAdMuted(true);
              },
              adFinished: () => {
                console.log('Mid-roll finished');
                soundManager.setAdMuted(false);
              },
              adError: (e: unknown) => {
                console.log('Mid-roll error', e);
                soundManager.setAdMuted(false);
              }
            }
          });
          return;
        }
      }
    } catch {
      // Ignore errors if SDK is unavailable or throws
    }
  },
  triggerRewarded: (onReward: () => void) => {
    console.log('[AdManager] Triggering Rewarded Ad...');
    try {
      const SDKObj = (typeof window !== 'undefined' && window.CrazyGames) ? window.CrazyGames.SDK as unknown as Record<string, unknown> : null;
      if (SDKObj && SDKObj.code !== 'sdkNotInitialized' && SDKObj.code !== 'sdkDisabled') {
        const adObj = SDKObj.ad as Record<string, unknown>;
        if (adObj && typeof adObj.requestAd === 'function') {
          adObj.requestAd('rewarded', {
            callbacks: {
              adStarted: () => {
                console.log('Rewarded started');
                soundManager.setAdMuted(true);
              },
              adFinished: () => {
                console.log('Rewarded finished');
                soundManager.setAdMuted(false);
                onReward();
              },
              adError: (e: unknown) => {
                console.log('Rewarded error', e);
                soundManager.setAdMuted(false);
                // Grant reward anyway as fallback in case of adblock or dummy local SDK
                onReward();
              }
            }
          });
          return;
        }
      }
    } catch {
      // Ignore errors if SDK is unavailable or throws
    }

    // Simulate watching ad fallback for purely local development without SDK
    setTimeout(() => {
      console.log('[AdManager] Ad fallback finished, granting reward.');
      onReward();
    }, 500);
  },
  triggerHappyMoment: () => {
    console.log('[AdManager] Happy Moment triggered!');
    try {
      const SDKObj = (typeof window !== 'undefined' && window.CrazyGames) ? window.CrazyGames.SDK as unknown as Record<string, unknown> : null;
      if (SDKObj && SDKObj.code !== 'sdkNotInitialized' && SDKObj.code !== 'sdkDisabled') {
        const gameObj = SDKObj.game as Record<string, unknown>;
        if (gameObj && typeof gameObj.happytime === 'function') {
          gameObj.happytime();
        }
      }
    } catch {
      // Ignore errors if SDK is unavailable or throws
    }
  }
};
