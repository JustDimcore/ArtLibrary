import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject, Subscription, concat} from 'rxjs/index';
import {HttpClient, HttpEventType} from "@angular/common/http";
import {catchError, map, finalize, takeWhile} from "rxjs/internal/operators";
import {environment} from "../../environments/environment";

export enum UploadStatus {
  Unknown,
  Waiting,
  Progress,
  Success,
  Failed,
  Canceled
}

export class FileUploadStatus {

  status = new BehaviorSubject<UploadStatus>(UploadStatus.Unknown);
  loaded = new BehaviorSubject<number>(0);
  progress = new BehaviorSubject<number>(0);

  onSuccess: Subject<FileUploadStatus> = new Subject();
  onCancel: Subject<FileUploadStatus> = new Subject();
  onError: Subject<FileUploadStatus> = new Subject();
  onFinish: Subject<FileUploadStatus> = new Subject();

  private _request: Observable<any>;
  private _canceled: boolean;


  get request() {
    return this._request;
  }

  set request(req: Observable<any>) {
    this._request  = req.pipe(
      takeWhile(() => !this._canceled)
    );
  }

  constructor(public name: string, public total: number) {
    this.loaded.subscribe(loaded => {
      this.progress.next(loaded / this.total);
    });
  }

  cancel() {
    this._canceled = true;
    this.status.next(UploadStatus.Canceled);
    this.onCancel.next(this);
    this.onFinish.next(this);
  }
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  allDone = new Subject();

  private _showUploadMenu: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _uploadList: BehaviorSubject<any[]> = new BehaviorSubject([]);

  private _uploadQueue: Observable<any>[] = [];

  get showUploadSource(): Observable<boolean> {
    return this._showUploadMenu;
  }

  get showUpload() {
    return this._showUploadMenu.value;
  }

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
    const uploads = [];
    for (let i = 0; i < files.length; i++) {
      const obs = this.postFile(files.item(i));
      obs.onCancel.subscribe(() => {
        this.uploadList.splice(this.uploadList.indexOf(obs), 1);
        this._uploadList.next(this.uploadList.slice());
      });
      obs.onFinish.subscribe(() => {
        this._uploadList.next(this.uploadList.slice());
      });
      uploads.push(obs);
    }

    let req = concat(...uploads.map(u => u.request))
      .pipe(
        finalize(() => {
          this._uploadQueue.splice(0, 1);
          if (this._uploadQueue.length > 0) {
            this._uploadQueue[0].subscribe();
          } else {
            this.allDone.next();
          }
        })
      );

    if (this._uploadQueue.length === 0) {
      req.subscribe();
    }
    this._uploadQueue.push(req);

    this._uploadList.next(this.uploadList.concat(uploads));
  }

  clearAllDone() {
    this._uploadList.next(this.uploadList.filter(file => file.progress.value < 1).slice());
  }

  private postFile(fileToUpload: File) {
    const endpoint = environment.uploadUrl;
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    const headers = {};

    const status = new FileUploadStatus(fileToUpload.name, fileToUpload.size);
    status.status.next(UploadStatus.Waiting);

    status.request = this._httpClient
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
              status.status.next(UploadStatus.Progress);
              status.loaded.next(event.loaded);

              if(event.loaded > 0 && event.loaded === event.total) {
                status.status.next(UploadStatus.Success);
                status.onSuccess.next(status);
                status.onFinish.next(status);
              }
              break;

            case HttpEventType.Response:
              // status.body = event['body'];
              // TODO: Unknown state. Check it
              break;

            default:
              console.log(`Unhandled event error: event type ${event.type}`);

              status.status.next(UploadStatus.Failed);
              status.onError.next(event);
              status.onFinish.next(status);
              break;
          }

          console.log(event);

          return status;
        }),
        catchError((e) => {
          status.status.next(UploadStatus.Failed);
          status.onError.next(status);
          status.onFinish.next(status);
          return of(e);
        }),
        takeWhile(() => status.progress.value < 1)
      );

      return status;
  }

  isValidExtension(names: string | string[]) {
    const validExtensions = ['.png', '.jpeg', '.jpg'];
    if (Array.isArray(names)) {
      return names.every(name => validExtensions.some(ext => name.endsWith(ext)));
    }

    return validExtensions.some(ext => names.endsWith(ext));
  }

  isValidMediaType(names: string | string[]) {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if(Array.isArray(names)) {
      return names.every(name => validTypes.includes(name));
    }

    return validTypes.includes(names);
  }
}
