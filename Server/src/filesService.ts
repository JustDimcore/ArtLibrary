import fs from "fs";
import path from "path";
import { SpriteInfo } from "./spriteInfo";
import sharp from "sharp";

export class FileService {

  private _filesList: SpriteInfo[];
  private _isDirty = true;
  private extensions = ['.jpeg','.png','.jpg','.bmp','.gif'];

  constructor(private _dirPath: string) {
    if (fs.existsSync(this._dirPath)){
      this.watch();
    }
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
    if (!fs.existsSync(this._dirPath)){
      fs.mkdirSync(this._dirPath, {recursive: true});
      this.watch();
    }
    this._filesList = await this.getFilesList();
    this._isDirty = false;
  }
  
  private async getFilesList(filePath?: string, outputList?: SpriteInfo[]): Promise<SpriteInfo[]> {
    filePath = filePath || '';
    const list = outputList || [];
    const fullPath = path.join(this._dirPath, filePath);
    var stats = fs.lstatSync(fullPath);
    if(stats.isDirectory())
    {
      const files = fs.readdirSync(fullPath);
      for(const file of files) {
        await this.getFilesList(path.join(filePath, file), list);
      }
    }
    else if(this.isNeededExtension(filePath)){
      const sprite = {} as SpriteInfo;
      sprite.path = filePath;
      sprite.name = path.basename(filePath);
      sprite.meta = await sharp(fullPath).metadata();

      if(fs.existsSync(fullPath + '.json')) {
        const buffer = fs.readFileSync(fullPath + '.json');
        sprite.json = buffer.toJSON();
      }
      list.push(sprite);
    }
    return list;
  }

  isNeededExtension(path: string) {
    for(const ext of this.extensions) {
      if(path.endsWith(ext))
        return true;
    }
    return false;
  }
}