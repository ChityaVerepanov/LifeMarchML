import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {

  //readonly baseUrl = '/api';
  readonly baseUrl = 'http://localhost:8080/api';

  readonly baseFileUploadUrl = 'http://localhost:8000/predict';
}
