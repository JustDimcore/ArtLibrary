import { SpriteInfo } from "./spriteInfo";

type Filter = (files: any[], filterString: string) => any[];     

export class FilterService {

    private _filters: {[key: string]: Filter} = {
        search: FilterService.filterByString,
        alpha: FilterService.filterByAlpha,
        xMin: FilterService.byMinX,
        xMax: FilterService.byMaxX,
        yMin: FilterService.byMinY,
        yMax: FilterService.byMaxY,
    };

    filter(files: SpriteInfo[], query: any): any[] {
        for(const filter in this._filters) {
            if(this._filters.hasOwnProperty(filter)) {
                const str = query[filter];
                files = str ? this._filters[filter](files, str) : files;
            }
        }
        return files;
    }

    private static filterByString(files: SpriteInfo[], filterString: string): SpriteInfo[] {
        const words = filterString.split(',').map(param => param.toLowerCase().trim());
        const filtered = files.filter(file => words.some(word => FilterService.checkByWord(file, word)))
        return filtered;
    }

    private static checkByWord(file: SpriteInfo, word: string): boolean {
        return file.name.toLowerCase().includes(word);
    }

    private static filterByAlpha(files: SpriteInfo[], filterString: string): SpriteInfo[] {
        filterString = filterString.toLowerCase();
        let flag = ['true', 'yes'].indexOf(filterString) > -1;
        if(!flag) {
            if(['false', 'no'].indexOf(filterString) > -1)
                flag = false;
            else
                return files;
        }

        const filtered = files.filter(file => Boolean(file.meta.hasAlpha) == flag);
        return filtered;
    }

    private static byMinX(sprites: SpriteInfo[], filterString: string): SpriteInfo[] {
        const value = Number.parseInt(filterString);
        if(Number.isNaN(value))
            return sprites;
        return sprites.filter(sprite => sprite.meta.width >= value);
    }

    private static byMaxX(sprites: SpriteInfo[], filterString: string): SpriteInfo[] {
        const value = Number.parseInt(filterString);
        if(Number.isNaN(value))
            return sprites;
        return sprites.filter(sprite => sprite.meta.width <= value);
    }

    private static byMinY(sprites: SpriteInfo[], filterString: string): SpriteInfo[] {
        const value = Number.parseInt(filterString);
        if(Number.isNaN(value))
            return sprites;
        return sprites.filter(sprite => sprite.meta.height >= value);
    }

    private static byMaxY(sprites: SpriteInfo[], filterString: string): SpriteInfo[] {
        const value = Number.parseInt(filterString);
        if(Number.isNaN(value))
            return sprites;
        return sprites.filter(sprite => sprite.meta.height <= value);
    }
}