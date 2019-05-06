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
  private _isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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

  get isLoading(): boolean {
    return this._isLoading.value;
  }

  get isLoadingSource(): Observable<boolean> {
    return this._isLoading;
  }

  public filterSprites(filter: any) {
    Object.assign(this._filters, filter);
    this.loadSpritesInfo();
  }

  public loadSpritesInfo() {
    const params = this._filters || {};

    this._isLoading.next(true);
    this.httpClient.get(environment.backendUrl + '/search', { params })
      .subscribe((res: any[]) => {
        res.forEach(sprite => {
          sprite.path = environment.artUrl + sprite.path;
          sprite.preview = environment.previewsUrl + sprite.name;
        });
        this._sprites.next(res);
        this._isLoading.next(false);
        console.log(res);
      });
  }

}
