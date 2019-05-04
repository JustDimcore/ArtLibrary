import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private httpClient: HttpClient) { }

  private _sprites: BehaviorSubject<any[]> = new BehaviorSubject([]);

  private _filters: any = {};
  get filters() {
    return this._filters;
  }

  get spritesSource(): Observable<any[]> {
    return this._sprites;
  }

  get sprites(): any[] {
    return this._sprites.value;
  }

  public filterSprites(filter: any) {
    Object.assign(this._filters, filter);
    this.loadSpritesInfo();
  }

  public loadSpritesInfo() {
    const params = this._filters || {};

    this.httpClient.get(environment.backendUrl + '/search', { params })
      .subscribe((res: any[]) => {
        res.forEach(sprite => sprite.path = environment.cdnUrl + sprite.path);
        this._sprites.next(res);
        console.log(res);
      });
  }

}
