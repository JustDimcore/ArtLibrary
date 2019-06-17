export class TagService {

    private _tagsCache: string[] = [];


    public getTags() {
        return this._tagsCache;
    }

    public updateTagsCache(spritesList: any[]) {
        const tags = spritesList
            .filter(s => s.projectMeta && s.projectMeta.tags)
            .map(s => s.projectMeta.tags)
            .reduce((a, b) => a.concat(b), []);

        this.addTags(tags);
    }

    public addTags(tags: string[]) {
        this._tagsCache = this._tagsCache.concat(tags);
        // leave unique tags only
        // TODO: Optimize it
        this._tagsCache = Array.from(new Set<string>(this._tagsCache));
    }
}
