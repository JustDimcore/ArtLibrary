import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sprite-finder',
  templateUrl: './sprite-finder.component.html',
  styleUrls: ['./sprite-finder.component.scss']
})
export class SpriteFinderComponent implements OnInit {

  filters: any;

  constructor() { }

  ngOnInit() {
  }

  onFilterChange(newFilters: any) {
    this.filters = newFilters;
  }
}
