import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface RadioGroupItem {
  text: string;
  value: string;
}

@Component({
  selector: 'app-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.scss']
})
export class RadioGroupComponent {

  @Input() items: RadioGroupItem[];
  @Input() selectedValue: string;
  @Output() selectedValueChange = new EventEmitter();

  onSelectionChange(selected: Event) {
    this.selectedValue = selected.target['value'];
    this.selectedValueChange.emit(this.selectedValue);
  }
}
