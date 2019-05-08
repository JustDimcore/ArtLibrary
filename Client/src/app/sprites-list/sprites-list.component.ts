import { Component, OnInit, Input } from '@angular/core';
import {Observable} from 'rxjs/index';
import {FilterService} from '../services/filter.service';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-sprites-list',
  templateUrl: './sprites-list.component.html',
  styleUrls: ['./sprites-list.component.scss']
})
export class SpritesListComponent implements OnInit {

  sprites$: Observable<any[]>;
  isLoading$: Observable<boolean>;

  constructor(private _filterService: FilterService, private _uploadService: UploadService) { }

  ngOnInit() {
    this.sprites$ = this._filterService.spritesSource;
    this.isLoading$ = this._filterService.isLoadingSource;
    this._filterService.loadSpritesInfo();
    this._uploadService.allDone.subscribe(() => {
      this._filterService.loadSpritesInfo();
    })
  }
}
