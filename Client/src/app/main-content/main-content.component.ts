import { Component, OnInit, Input } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

  fillList() {
    console.log('fillList');
  }
}
