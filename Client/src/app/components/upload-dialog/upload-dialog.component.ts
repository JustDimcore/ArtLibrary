import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TagsService} from '../../services/tags.service';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent implements OnInit {

  constructor(private _dialogRef: MatDialogRef<UploadDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private _tagsService: TagsService) {
  }

  ngOnInit() {
    this._tagsService.refreshTags();
  }

  cancel() {
    this._dialogRef.close(false);
  }

  upload() {
    this._dialogRef.close(this.data.files);
  }

  remove(file) {
    this.data.files.splice(this.data.files.indexOf(file), 1);
    if (this.data.files.length <= 0) {
      this._dialogRef.close();
    }
  }
}

