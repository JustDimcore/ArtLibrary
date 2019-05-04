import { Component, OnInit, Input } from '@angular/core';
import {Observable} from 'rxjs/index';
import {FilterService} from '../services/filter.service';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {

  sprites: Observable<any[]>;

  constructor(private _filterService: FilterService) { }

  ngOnInit() {
    this.sprites = this._filterService.spritesSource;
    this._filterService.loadSpritesInfo();
  }
}
