import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {ApiConfigService} from '../../api-config/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = inject(ApiConfigService).baseFileUploadUrl;

  private http = inject(HttpClient);

  uploadExcelFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.apiUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }
}
