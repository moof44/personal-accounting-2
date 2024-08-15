import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { withComponentInputBinding } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
      //        }), provideFirebaseApp(() => initializeApp({"projectId":"personal-accounting-3fbcb","appId":"1:1007338909314:web:1846f93f43e5eb550c4e9b","storageBucket":"personal-accounting-3fbcb.appspot.com","locationId":"asia-southeast1","apiKey":"AIzaSyAB10hD2BBTuyiBIuEwco8XbzWSmUn_jrw","authDomain":"personal-accounting-3fbcb.firebaseapp.com","messagingSenderId":"1007338909314","measurementId":"G-L0E42WYYJY"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideFunctions(() => getFunctions()), provideStorage(() => getStorage())]
    }),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'personal-accounting-3fbcb',
        appId: '1:1007338909314:web:1846f93f43e5eb550c4e9b',
        storageBucket: 'personal-accounting-3fbcb.appspot.com',
        apiKey: 'AIzaSyAB10hD2BBTuyiBIuEwco8XbzWSmUn_jrw',
        authDomain: 'personal-accounting-3fbcb.firebaseapp.com',
        messagingSenderId: '1007338909314',
        measurementId: 'G-L0E42WYYJY',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideStorage(() => getStorage()),
    provideAnimationsAsync(),
    provideStore(),
    provideEffects(),
    provideRouterStore(),
  ],
};
