import { Component, OnInit, Input } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {

  private _filters: any;
  @Input()
  get filters() {
    return this._filters;
  }
  set filters(value: any) {
    this._filters = value;
    this.fillList();
  }

  sprites: any[];

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  fillList() {
    this.httpClient.get(environment.backendUrl + '/search?query=' + (this._filters ? this._filters.search || '' : '')).subscribe((res: any[]) => {
      res.forEach(sprite => sprite.path = environment.cdnUrl + sprite.path);
      this.sprites = res;
      console.log(res);
    });
  }
}
