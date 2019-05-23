import {Component, OnInit, HostListener, ElementRef, ViewChild} from '@angular/core';
import {UploadService} from '../../services/upload.service';
import {FilterService} from '../../services/filter.service';
import { ActivatedRoute } from '@angular/router';
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
  selector: 'app-sprite-finder',
  templateUrl: './sprite-finder.component.html',
  styleUrls: ['./sprite-finder.component.scss']
})
export class SpriteFinderComponent implements OnInit {

  showFileDropArea: boolean;
  childRoute: Observable<string>;

  private _dragCounter = 0;

  constructor(private _uploadService: UploadService, private _filterService: FilterService, private route: ActivatedRoute) {
    this._filterService.onRefresh
      .subscribe(() => {
        document.documentElement.scrollTop = 0;
      });

    this.childRoute = route.params.pipe(
      map(({child}) => child)
    );
  }

  ngOnInit() {
  }

  @HostListener('window:dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }

  @HostListener('window:dragenter', ['$event'])
  onDragEnter(event: DragEvent) {
    if (this.containsFiles(event.dataTransfer.items)) {
      this.showFileDropArea = true;
    }

    this._dragCounter++;
  }

  containsFiles(items) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file') {
        return true;
      }
    }
    return false;
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
    if (!event.dataTransfer.files || event.dataTransfer.files.length === 0) {
      return;
    }
    event.preventDefault();
    this.showFileDropArea = false;
    this._dragCounter = 0;
    this._uploadService.upload(event.dataTransfer.files);
    this._uploadService.showList(true);
  }
}
