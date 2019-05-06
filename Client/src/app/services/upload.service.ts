import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs/index';
import {HttpClient, HttpEventType} from "@angular/common/http";
import {catchError, map, share} from "rxjs/internal/operators";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private _showUploadMenu: BehaviorSubject<boolean> = new BehaviorSubject(false);

  get showUploadSource(): Observable<boolean> {
    return this._showUploadMenu;
  }

  get showUpload() {
    return this._showUploadMenu.value;
  }

  private _uploadList: BehaviorSubject<any[]> = new BehaviorSubject([]);

  get uploadListSource(): Observable<any[]> {
    return this._uploadList;
  }

  get uploadList(): any[] {
    return this._uploadList.value;
  }

  constructor(private _httpClient: HttpClient) {
  }

  showList(show: boolean) {
    this._showUploadMenu.next(show);
  }

  upload(files: FileList) {
    console.log(files);
    for (let i = 0; i < files.length; i++) {
      const obs = this.postFile(files.item(i));
      this._uploadList.value.push(obs);
      obs.subscribe(res => console.log(res));
    }
  }

  private postFile(fileToUpload: File): Observable<any> {
    const endpoint = environment.uploadUrl;
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    const headers = {};
    return this._httpClient
      .post(endpoint, formData, {
        headers: headers,
        reportProgress: true,
        observe: 'events'
      })
      .pipe(
        map((event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              const progress = Math.round(100 * event.loaded / event.total);
              return {status: 'progress', message: progress};

            case HttpEventType.Response:
              return event.body;
            default:
              return `Unhandled event: ${event.type}`;
          }
        }),
        catchError((e) => {
          console.log(e);
          return of(e);
        }),
        share()
      );
  }
}
