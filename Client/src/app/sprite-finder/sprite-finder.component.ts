import { Component, OnInit, HostListener } from '@angular/core';
import {UploadService} from "../services/upload.service";

@Component({
  selector: 'app-sprite-finder',
  templateUrl: './sprite-finder.component.html',
  styleUrls: ['./sprite-finder.component.scss']
})
export class SpriteFinderComponent implements OnInit {

  filters: any;
  showFileDropArea: boolean;
  validDropFiles: boolean;

  private _dragCounter = 0;

  constructor(private _uploadService: UploadService) { }

  ngOnInit() {
  }

  onFilterChange(newFilters: any) {
    this.filters = newFilters;
  }

  @HostListener('window:dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }

  @HostListener('window:dragenter', ['$event'])
  onDragEnter(event: DragEvent) {
    this.showFileDropArea = true;
    this.validDropFiles = (() => {
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        if (!this._uploadService.isValidMediaType(event.dataTransfer.items[i].type)) {
          return false;
        }
      }
      return true;
    })();
    this._dragCounter++;
  }

  @HostListener('window:dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    this._dragCounter--;
    if (this._dragCounter === 0) {
      this.showFileDropArea = false;
    }
  }

  @HostListener('window:drop', ['$event'])
  onDragDrop(event: DragEvent) {
    event.preventDefault();
    this.showFileDropArea = false;
    this._dragCounter = 0;
    for (let i = 0; i <event.dataTransfer.files.length; i++) {
      if (!this._uploadService.isValidExtension(event.dataTransfer.files.item(i).name)) {
        return;
      }
    }

    this._uploadService.upload(event.dataTransfer.files);
    this._uploadService.showList(true);
  }
}
