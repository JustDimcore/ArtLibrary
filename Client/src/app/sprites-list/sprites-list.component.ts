import { Component, OnInit, Input } from '@angular/core';
import {Observable} from 'rxjs/index';
import {FilterService} from '../services/filter.service';

@Component({
  selector: 'app-sprites-list',
  templateUrl: './sprites-list.component.html',
  styleUrls: ['./sprites-list.component.scss']
})
export class SpritesListComponent implements OnInit {

  sprites$: Observable<any[]>;
  isLoading$: Observable<boolean>;

  constructor(private _filterService: FilterService) { }

  ngOnInit() {
    this.sprites$ = this._filterService.spritesSource;
    this.isLoading$ = this._filterService.isLoadingSource;
    this._filterService.loadSpritesInfo();
  }
}
