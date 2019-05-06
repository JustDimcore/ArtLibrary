import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-sprite-finder',
  templateUrl: './sprite-finder.component.html',
  styleUrls: ['./sprite-finder.component.scss']
})
export class SpriteFinderComponent implements OnInit {

  filters: any;
  showFileDropArea: boolean;

  constructor() { }

  ngOnInit() {
  }

  onFilterChange(newFilters: any) {
    this.filters = newFilters;
  }

  dragCounter = 0;
  @HostListener('window:dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }

  @HostListener('window:dragenter', ['$event'])
  onDragEnter(event: DragEvent) {
    console.log('enter');
    this.showFileDropArea = true;
    this.dragCounter++;
  }

  @HostListener('window:dragleave', ['$event'])
  onDragLeave(event: DragEvent) {
    console.log('leave');
    this.dragCounter--;
    if(this.dragCounter === 0)
      this.showFileDropArea = false;
  }

  @HostListener('window:drop', ['$event'])
  onDragDrop(event: DragEvent) {
    console.log('drop');
    event.preventDefault();
    event.stopPropagation();
    this.showFileDropArea = false;
    this.dragCounter = 0;
    return true;
  }
}
