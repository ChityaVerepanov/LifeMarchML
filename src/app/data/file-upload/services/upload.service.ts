import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, Subject, throwError} from 'rxjs';
import {ApiConfigService} from '../../api-config/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = inject(ApiConfigService).baseFileUploadUrl;
  private fileUploadedSubject = new Subject<string>();

  private http = inject(HttpClient);

  fileUploaded$ = this.fileUploadedSubject.asObservable();

  notifyFileUploaded(fileName: string) {
    this.fileUploadedSubject.next(fileName);
  }

  uploadExcelFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.apiUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }
}
