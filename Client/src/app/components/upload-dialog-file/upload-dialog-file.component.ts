import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-upload-dialog-file',
  templateUrl: './upload-dialog-file.component.html',
  styleUrls: ['./upload-dialog-file.component.scss']
})
export class UploadDialogFileComponent implements OnInit {

  @Input() file;
  @Output() remove = new EventEmitter();
  src: string;

  ngOnInit() {
    const reader = new FileReader();
    reader.onload = (_event) => {
      this.src = reader.result;
    };
    reader.readAsDataURL(this.file);
  }
}
