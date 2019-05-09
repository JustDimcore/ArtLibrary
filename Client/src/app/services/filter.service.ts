import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {debounceTime} from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  onRefresh = new Subject();

  private _perPage = 20;

  private _spritesSource: BehaviorSubject<any[]> = new BehaviorSubject([]);
  private _isLoadingSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _load = new Subject();
  private _filters: any = { from: 0, count: this._perPage };


  get spritesSource(): Observable<any[]> {
    return this._spritesSource;
  }

  get sprites(): any[] {
    return this._spritesSource.value;
  }

  get isLoading(): boolean {
    return this._isLoadingSource.value;
  }

  get isLoadingSource(): Observable<boolean> {
    return this._isLoadingSource;
  }


  constructor(private httpClient: HttpClient) {
    this._load
      .pipe(
        debounceTime(100)
      )
      .subscribe(() => this.loadSpritesInfo(false));
  }

  public loadSprites(filter?: any) {
    this._filters.from = 0;
    if (filter) {
      Object.assign(this._filters, filter);
    }
    this._load.next();
  }

  public loadNextPage() {
    this.loadSpritesInfo(true);
  }

  private loadSpritesInfo(append: boolean) {
    const params = this._filters || {};

    if (append && this.isLoading) {
      return;
    }

    this._isLoadingSource.next(true);
    this.httpClient.get(environment.backendUrl + '/search', { params })
      .subscribe((res: any[]) => {
        res.forEach(sprite => {
          sprite.path = environment.artUrl + sprite.path;
          sprite.preview = environment.previewsUrl + sprite.name;
        });
        console.log(res);

        if (append) {
          res = this._spritesSource.value.concat(res);
        } else {
          this.onRefresh.next();
        }

        this._filters.from += this._perPage;

        this._spritesSource.next(res);
        this._isLoadingSource.next(false);
      });
  }
}
