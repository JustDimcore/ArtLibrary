import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs/index';
import {HttpClient, HttpEventType} from "@angular/common/http";
import {catchError, map, takeUntil, finalize} from "rxjs/internal/operators";
import {concat} from 'rxjs';
import {environment} from "../../environments/environment";
import { EventEmitter } from 'events';

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
    for (let i = 0; i < files.length; i++) {
      const obs = this.postFile(files.item(i));
      obs.onCancel.subscribe(() => {
        this.uploadList.splice(this.uploadList.indexOf(obs), 1);
      });
      this.uploadList.push(obs);
    }
    this._uploadList.next(this.uploadList.slice());
  }

  private postFile(fileToUpload: File) {
    const endpoint = environment.uploadUrl;
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    const headers = {};

    const status = {
      name: fileToUpload.name,
      status: 'progress',
      message: 'Waiting',
      progress: 0,
      loaded: 0,
      total: fileToUpload.size,
      body: null,

      onSuccess: new Subject(),
      onCancel: new Subject(),
      onError: new Subject(),
      onFinish: new Subject(),

      cancel: undefined
    };

    const request = this._httpClient
      .post(endpoint, formData, {
        headers: headers,
        reportProgress: true,
        observe: 'events'
      })
      .pipe(
        map((event: any) => {

          switch (event.type) {
            case HttpEventType.Sent:
              break;
            case HttpEventType.UploadProgress:
              const progress = event.loaded / event.total;
              const progressMessage = Math.round(100 * progress);

              status.status = 'progress';
              status.message = progressMessage.toString();
              status.progress = progress;
              status.loaded = event.loaded;

              if(event.loaded > 0 && event.loaded === event.total) {
                status.status = 'success';
                status.onSuccess.next();
                console.log('success');
                status.onFinish.next();
              }
              break;

            case HttpEventType.Response:
              status.body = event['body'];
              // TODO: Unknown state. Check it
              break;

            default:
              console.log('error unhandled');

              status.message = `Unhandled event: ${event.type}`;
              status.status = 'failed';
              status.onError.next(event);
              status.onFinish.next();
              break;
          }

          console.log(event);

          return status;
        }),
        catchError((e) => {
          console.log('catch error');
          status.status = 'failed';
          status.onError.next(event);
          status.onFinish.next();
          return of(e);
        }),
      )
      .subscribe();

      status.cancel = () => {
        request.unsubscribe();
        console.log('canceled');
        status.status = 'canceled';
        status.onCancel.next();
        status.onFinish.next();
      }
      return status;
  }
}
