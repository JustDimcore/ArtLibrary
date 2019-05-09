import {Component, OnInit, HostListener, ElementRef, ViewChild} from '@angular/core';
import {UploadService} from "../services/upload.service";
import {FilterService} from "../services/filter.service";

@Component({
  selector: 'app-sprite-finder',
  templateUrl: './sprite-finder.component.html',
  styleUrls: ['./sprite-finder.component.scss']
})
export class SpriteFinderComponent implements OnInit {

  @ViewChild('container') _container: ElementRef;
  showFileDropArea: boolean;

  private _nextPageLoadDistance = 500;
  private _dragCounter = 0;

  constructor(private _uploadService: UploadService, private _filterService: FilterService) {
    this._filterService.onRefresh
      .subscribe(() => {
        document.documentElement.scrollTop = 0;
      });
  }

  ngOnInit() {
  }

  @HostListener('window:scroll', ['$event'])
  scroll(event) {
    const content = this._container.nativeElement;
    const bounds = content.getBoundingClientRect();

    if (content.offsetHeight <= window.innerHeight - bounds.y + this._nextPageLoadDistance) {
      console.log(event);
      this._filterService.loadNextPage();
    }
  }

  @HostListener('window:dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }

  @HostListener('window:dragenter', ['$event'])
  onDragEnter(event: DragEvent) {
    this.showFileDropArea = true;
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
    this._uploadService.upload(event.dataTransfer.files);
    this._uploadService.showList(true);
  }
}
