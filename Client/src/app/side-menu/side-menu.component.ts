import {Component, OnInit, HostListener, ViewChild, ElementRef, OnChanges, SimpleChanges} from '@angular/core';
import {RadioGroupItem} from '../radio-group/radio-group.component';
import {FormControl, FormGroup, Validators} from '@angular/forms';

export enum SimpleState {
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

  defaultPresetName = 'New preset';
  searchExample = 'progress, background, experience';
  displayHelp = false;

  alphaFilterItems = [SimpleState.Any, SimpleState.Yes, SimpleState.No];
  sliceFilterItems = [SimpleState.Any, SimpleState.Yes, SimpleState.No];

  form = new FormGroup({
      search: new FormControl(),
      xMin: new FormControl('', [Validators.min(0)]),
      xMax: new FormControl('', [Validators.min(0)]),
      yMin: new FormControl('', [Validators.min(0)]),
      yMax: new FormControl('', [Validators.min(0)]),
      alpha: new FormControl(''),
      slice: new FormControl(''),
    }
  );

  defaultPreset = {
    search: '',
    alpha: SimpleState.Any,
    slice: SimpleState.Any,
    xMin: '',
    xMax: '',
    yMin: '',
    yMax: '',
  };

  presetName: string;

  presets = [];

  constructor() {
    this.resetForm();
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(ch => console.log(ch));
    this.loadPresetFromStorage();
  }

  @HostListener('window:keydown', ['$event'])
  keydown(event: KeyboardEvent) {
    if (event.keyCode === 114 || (event.ctrlKey && event.keyCode === 70)) {
      event.preventDefault();
      this.selectSearchField();
    }
  }

  @HostListener('window:click', ['$event'])
  click(event) {
    if (this.displayHelp) {
      this.displayHelp = false;
    }
  }


  selectSearchField() {
    this.searchInput.nativeElement.select();
  }

  onChange() {
    console.log('changed');
  }

  changeFilter(field: string, value: any) {
    this[field] = value;
    this.onChange();
  }

  showHelp() {
    setTimeout(() => {
      this.displayHelp = !this.displayHelp;
    });
  }

  setExample() {
    this.form.controls.search.setValue(this.searchExample);
  }

  savePreset() {
    const preset = this.getCurrentPreset();
    console.log(preset);
    let newPresetName = this.presetName || this.form.controls.search.value || this.defaultPresetName;
    newPresetName = newPresetName.trim();
    let count = 1;
    let temp = newPresetName;
    while (this.presets.find(pr => pr.presetName === temp)) {
      count++;
      temp = `${newPresetName} (${count})`;
    }
    preset['presetName'] = temp;
    this.presetName = undefined;
    this.presets.push(preset);

    this.savePresetsInStorage();
  }

  getCurrentPreset() {
    const preset = {};
    for (const prop in this.defaultPreset) {
      if (this.defaultPreset.hasOwnProperty(prop)) {
        preset[prop] = this.form.controls[prop].value;
      }
    }
    return preset;
  }

  setPreset(preset) {
    for (const prop in this.defaultPreset) {
      if (preset.hasOwnProperty(prop)) {
        this.form.controls[prop].setValue(preset[prop]);
      }
    }
  }

  removePreset(index) {
    this.presets.splice(index, 1);
    this.savePresetsInStorage();
  }

  loadPreset(index) {
    this.setPreset(this.presets[index]);
  }

  resetForm() {
    this.setPreset(this.defaultPreset);
  }

  savePresetsInStorage() {
    localStorage.setItem('presets', JSON.stringify(this.presets));
  }

  loadPresetFromStorage() {
    this.presets = JSON.parse(localStorage.getItem('presets')) || [];
  }
}
