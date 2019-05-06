import {Component, HostListener, OnInit} from '@angular/core';
import {UploadService} from '../services/upload.service';
import {Observable} from 'rxjs/index';

@Component({
  selector: 'app-upload-list',
  templateUrl: './upload-list.component.html',
  styleUrls: ['./upload-list.component.scss']
})
export class UploadListComponent implements OnInit {

  uploadList$: Observable<any[]>;
  displayUpload$: Observable<boolean>;

  private _skipUploadHiding = false;

  constructor(private _uploadService: UploadService) {
    this.uploadList$ = _uploadService.uploadListSource;
    this.displayUpload$ = this._uploadService.showUploadSource;
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

}
