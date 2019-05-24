import {Component, Input, OnInit} from '@angular/core';
import {SpriteInfo} from "../../../../../Server/src/spriteInfo";

@Component({
  selector: 'app-sprite',
  templateUrl: './sprite.component.html',
  styleUrls: ['./sprite.component.scss']
})
export class SpriteComponent implements OnInit {

  @Input() sprite: SpriteInfo;

  constructor() { }

  ngOnInit() {
  }

}
