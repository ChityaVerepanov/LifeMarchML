import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {

  //readonly baseUrl = '/api';
  //readonly baseUrl = 'http://localhost:8080/api';
  readonly baseUrl: string;

  constructor() {
    // @ts-ignore
    const isElectron = typeof window !== 'undefined' && window['electronAPI'] && window['electronAPI'].isElectron;
    if (isElectron) {
      this.baseUrl = 'http://localhost:8080/api';
    } else {
      this.baseUrl = '/api';
    }
  }

  readonly baseFileUploadUrl = 'http://localhost:8000/predict';
}
