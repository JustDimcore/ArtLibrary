import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {FilterService} from '../services/filter.service';
import {debounceTime} from 'rxjs/internal/operators';
import {PresetsService} from '../services/presets.service';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @ViewChild('searchInput') searchInput: ElementRef;

  searchExample = 'progress, background, experience';
  displayHelp = false;

  private _skipHelpHiding = false;

  defaultPreset = {
    search: '',
  };

  form = new FormGroup({
      search: new FormControl(),
    }
  );

  constructor(private _filterService: FilterService, private _presetService: PresetsService) { }

  ngOnInit() {
    this.form.valueChanges
      .pipe(
        debounceTime(200)
      )
      .subscribe(ch => {
        this._presetService.updateCurrentState(this.form.value);
        this._filterService.loadSprites(this.form.value);
      });

    this._presetService.currentPreset.subscribe(preset => this.setPreset(preset));
  }

  @HostListener('window:keydown', ['$event'])
  keydown(event: KeyboardEvent) {
    // F3 and ctrl+f
    if (event.keyCode === 114 || (event.ctrlKey && event.keyCode === 70)) {
      event.preventDefault();
      this.selectSearchField();
    }
  }

  @HostListener('window:click', ['$event'])
  click(event) {
    if (this._skipHelpHiding) {
      this._skipHelpHiding = false;
    } else {
      this.displayHelp = false;
    }
  }

  selectSearchField() {
    this.searchInput.nativeElement.select();
  }

  setPreset(preset) {
    for (const prop in this.defaultPreset) {
      if (preset.hasOwnProperty(prop)) {
        this.form.controls[prop].setValue(preset[prop]);
      }
    }
  }

  showHelp() {
    this.displayHelp = !this.displayHelp;
    this._skipHelpHiding = true;
  }

  setExample() {
    this.form.controls['search'].setValue(this.searchExample);
  }
}
