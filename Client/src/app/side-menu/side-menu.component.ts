import { Component, OnInit, HostListener, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { RadioGroupItem } from '../radio-group/radio-group.component';

export enum AlphaState {
  Any = 'Any',
  Yes = 'Yes',
  No = 'No'
}

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  @ViewChild('searchInput') searchInput: ElementRef;

  alphaFilterItems: RadioGroupItem[];
  alphaFilterValue = AlphaState.Any.toString();

  constructor() {
    this.fillAlphaFilter();
  }

  ngOnInit() {
  }

  @HostListener('window:keydown',['$event'])
  keydown(event: KeyboardEvent) {
    if (event.keyCode === 114 || (event.ctrlKey && event.keyCode === 70)) {
      event.preventDefault();
      this.selectSearchField();
    }
  }

  fillAlphaFilter() {
    this.alphaFilterItems = [
      <RadioGroupItem>{
        text: 'Any',
        value: AlphaState.Any.toString(),
      },
      <RadioGroupItem>{
        text: 'Yes',
        value: AlphaState.Yes.toString(),
      },
      <RadioGroupItem>{
        text: 'No',
        value: AlphaState.No.toString(),
      }
    ];

    this.alphaFilterValue = AlphaState.Any.toString();
  }

  selectSearchField() {
    this.searchInput.nativeElement.select();
  }

  onChange(field: string, value: any) {
    this[field] = value;
    console.log(`changed ${field} to ${value}`);
  }
}
