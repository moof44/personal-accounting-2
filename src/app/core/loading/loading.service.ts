import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading = signal<boolean>(false);
  loadingMessage = signal<string | null>(null); 

  setLoading(isLoading: boolean, message?: string) {
    this.isLoading.set(isLoading);
    this.loadingMessage.set(message || null); 
  }

}
