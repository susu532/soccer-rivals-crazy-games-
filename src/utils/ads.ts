export const adManager = {
  triggerLoadingStart: () => {
    try {
      if (typeof window !== 'undefined' && window.CrazyGames?.SDK?.game?.loadingStart) {
        window.CrazyGames.SDK.game.loadingStart();
      }
    } catch {}
  },
  triggerLoadingStop: () => {
    try {
      if (typeof window !== 'undefined' && window.CrazyGames?.SDK?.game?.loadingStop) {
        window.CrazyGames.SDK.game.loadingStop();
      }
    } catch {}
  },
  triggerGameplayStart: () => {
    try {
      if (typeof window !== 'undefined' && window.CrazyGames?.SDK?.game?.gameplayStart) {
        window.CrazyGames.SDK.game.gameplayStart();
      }
    } catch {}
  },
  triggerGameplayStop: () => {
    try {
      if (typeof window !== 'undefined' && window.CrazyGames?.SDK?.game?.gameplayStop) {
        window.CrazyGames.SDK.game.gameplayStop();
      }
    } catch {}
  },
  triggerMidRoll: () => {
    console.log('[AdManager] Triggering Mid-roll Ad...');
    try {
      const SDKObj = (typeof window !== 'undefined' && window.CrazyGames) ? window.CrazyGames.SDK as unknown as Record<string, unknown> : null;
      if (SDKObj && SDKObj.code !== 'sdkNotInitialized' && SDKObj.code !== 'sdkDisabled') {
        const adObj = SDKObj.ad as Record<string, unknown>;
        if (adObj && typeof adObj.requestAd === 'function') {
          adObj.requestAd('midroll', {
            adStarted: () => console.log('Mid-roll started'),
            adFinished: () => console.log('Mid-roll finished'),
            adError: (e: unknown) => console.log('Mid-roll error', e)
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
            adStarted: () => console.log('Rewarded started'),
            adFinished: () => {
              console.log('Rewarded finished');
              onReward();
            },
            adError: (e: unknown) => {
              console.log('Rewarded error', e);
              // Grant reward anyway as fallback in case of adblock or dummy local SDK
              onReward();
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
