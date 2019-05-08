import {Component, HostListener, OnInit} from '@angular/core';
import {UploadService} from '../services/upload.service';
import {Observable} from 'rxjs/index';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-upload-list',
  templateUrl: './upload-list.component.html',
  styleUrls: ['./upload-list.component.scss']
})
export class UploadListComponent implements OnInit {

  uploadList$: Observable<any[]>;
  displayUpload$: Observable<boolean>;
  countInProgress$: Observable<number>;

  private _skipUploadHiding = false;

  constructor(private _uploadService: UploadService) {
    this.uploadList$ = _uploadService.uploadListSource;
    this.displayUpload$ = this._uploadService.showUploadSource;
    this.countInProgress$ = _uploadService.uploadListSource
      .pipe(
        map((files: any[]) => {
          return files.filter(f => f.progress.value < 1).length;
        }),
      );
  }

  ngOnInit() {
  }

  @HostListener('window:click', ['$event'])
  click(event) {
    if (this._skipUploadHiding) {
      this._skipUploadHiding = false;
    } else {
      this._uploadService.showList(false);
    }
  }

  showUploadList() {
    this._uploadService.showList(!this._uploadService.showUpload);
    this._skipUploadHiding = true;
  }

  cancel(event: Event, item) {
    console.log(event);
    this.preventDefault();
    item.cancel();
  }

  preventDefault() {
    event.preventDefault();
    event.stopPropagation();
  }

  clearAllDone() {
    this._uploadService.clearAllDone();
    if (this._uploadService.uploadList.length === 0) {
      this.showUploadList();
    }
  }
}
