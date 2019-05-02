import fs from "fs";
import path from "path";
import { SpriteInfo } from "./spriteInfo";

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

  public getFilePaths() {
    if(this._isDirty)
      this.refreshFilesList();
    
    return this._filesList;
  }

  public refreshFilesList() {
    if (!fs.existsSync(this._dirPath)){
      fs.mkdirSync(this._dirPath, {recursive: true});
      this.watch();
    }
    this._filesList = this.getFilesList();
    this._isDirty = false;
  }
  
  private getFilesList(filePath?: string, outputList?: SpriteInfo[]): SpriteInfo[] {
    filePath = filePath || '';
    const list = outputList || [];
    const fullPath = path.join(this._dirPath, filePath);
    var stats = fs.lstatSync(fullPath);
    if(stats.isDirectory())
    {
      const files = fs.readdirSync(fullPath);
      files.forEach(file => this.getFilesList(path.join(filePath, file), list))
    }
    else if(this.isNeededExtension(filePath)){
      const sprite = {} as SpriteInfo;
      sprite.path = filePath;
      sprite.name = path.basename(filePath);
      if(fs.existsSync(fullPath + '.json')) {
        const buffer = fs.readFileSync(fullPath + '.json');
        if(buffer)
          sprite.meta = buffer.toJSON();
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