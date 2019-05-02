import { Component, OnInit, Input } from '@angular/core';
import {HttpClient} from '@angular/common/http';

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

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  fillList() {
    this.httpClient.get('localhost:3000/list').subscribe(res => {
      console.log(res);
    });
  }
}
