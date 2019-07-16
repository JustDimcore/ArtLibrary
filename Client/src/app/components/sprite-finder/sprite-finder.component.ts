import {Component, OnInit, HostListener} from '@angular/core';
import {UploadService} from '../../services/upload.service';
import {FilterService} from '../../services/filter.service';
import {ActivatedRoute} from '@angular/router';
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {UploadDialogComponent} from "../upload-dialog/upload-dialog.component";

@Component({
  selector: 'app-sprite-finder',
  templateUrl: './sprite-finder.component.html',
  styleUrls: ['./sprite-finder.component.scss']
})
export class SpriteFinderComponent implements OnInit {

  showFileDropArea: boolean;
  childRoute: Observable<string>;

  private _dragCounter = 0;

  constructor(private _uploadService: UploadService,
              private _filterService: FilterService,
              private _route: ActivatedRoute,
              private _matDialog: MatDialog) {
    this._filterService.onRefresh
      .subscribe(() => {
        document.documentElement.scrollTop = 0;
      });

    this.childRoute = _route.params.pipe(
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
    // TODO: Show upload dialog
    this.openUploadDialog(event.dataTransfer.files);

    //this._uploadService.upload(event.dataTransfer.files);
    //this._uploadService.showList(true);
  }

  private openUploadDialog(files: FileList) {
    const dialogRef = this._matDialog.open(UploadDialogComponent, {
      width: '70vw',
      data: {files: files},
    } as MatDialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this._uploadService.upload(files);
        this._uploadService.showList(true);
      }
    });
  }
}
