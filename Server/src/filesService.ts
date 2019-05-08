import fs, { PathLike } from "fs";
import path from "path";
import { SpriteInfo } from "./spriteInfo";
import sharp from "sharp";
import { SpriteMetaService } from "./spriteMetaService";
import { promisify } from "util";

export class FileService {

  private _filesList: SpriteInfo[];
  private _isDirty = true;
  private _extensions = ['.jpeg','.png','.jpg','.bmp','.gif'];

  constructor(private _dirPath: string, private _projectMetaService: SpriteMetaService) {
  }

  watch() {
    fs.watch(this._dirPath, {recursive : true} ,(event, filename) => {
      console.log(filename);
      console.log(event);
    });
  }

  public async getFilePaths() {
    if(this._isDirty)
      await this.refreshFilesList();
    
    return this._filesList;
  }

  public async refreshFilesList() {
    // create sprites directory
    if (!fs.existsSync(this._dirPath)){
      fs.mkdirSync(this._dirPath, {recursive: true});
      this.watch();
    }

    this._filesList = [];
    await this.refreshFilesListByPath();
    this._isDirty = false;
  }
  
  private async refreshFilesListByPath(filePath?: string, outputList?: SpriteInfo[]): Promise<void> {
    filePath = filePath || '';
    const fullPath = path.join(this._dirPath, filePath);
    var stats = fs.lstatSync(fullPath);
    if(stats.isDirectory())
    {
      const files = fs.readdirSync(fullPath);
      for(const file of files) {
        await this.refreshFilesListByPath(path.join(filePath, file));
      }
    }
    else if(this.isNeededExtension(filePath)){
      this.addSpriteInfo(filePath);
    }
  }

  async addSpriteInfo(filePath: string) {
    const fullPath = path.join(this._dirPath, filePath);
    console.log(fullPath);
    const sprite = {} as SpriteInfo;
    sprite.path = filePath;
    sprite.name = path.basename(filePath);
    sprite.meta = await sharp(fullPath).metadata();
    sprite.projectMeta = this._projectMetaService.getSpriteMeta(fullPath);

    this._filesList.push(sprite);
    return sprite;
  }

  isNeededExtension(path: string) {
    for(const ext of this._extensions) {
      if(path.endsWith(ext))
        return true;
    }
    return false;
  }

  async saveSprite(file: any): Promise<SpriteInfo> {
    const filePath = path.join(this._dirPath, file.name);

    await promisify(fs.writeFile)(filePath, file.data);
    console.log('saved file ' + file.name);
    const spriteInfo = await this.addSpriteInfo(file.name);
    console.log('saved sprite info ' + file.name);
    return spriteInfo;
  }
}