import * as fs from 'fs';
import * as path from 'path';
import { SpriteInfo } from './spriteInfo';
import * as sharp from 'sharp';
import { SpriteMetaService } from './spriteMetaService';
import { promisify } from 'util';

export class FileService {

  private _filesList: SpriteInfo[];
  private _isDirty = true;
  private _extensions = ['.jpeg', '.png', '.jpg', '.bmp', '.gif'];

  constructor(private _dirPath: string, private _projectMetaService: SpriteMetaService) {
  }

  watch() {
    fs.watch(this._dirPath, {recursive : true} , (event, filename) => {
      console.log(filename);
      console.log(event);
    });
  }

  public async getFilePaths() {
    if (this._isDirty) {
      await this.refreshFilesList();
    }
    
    return this._filesList;
  }

  public async refreshFilesList() {
    // create sprites directory
    if (!fs.existsSync(this._dirPath)) {
      await promisify(fs.mkdir)(this._dirPath, {recursive: true});
      //this.watch();
    }

    this._filesList = [];
    await this.refreshFilesListByPath();
    this._isDirty = false;
  }
  
  private async refreshFilesListByPath(filePath?: string): Promise<void> {
    filePath = filePath || '';
    const fullPath = path.join(this._dirPath, filePath);
    const stats = await promisify(fs.lstat)(fullPath);
    if (stats.isDirectory()) {
      const files = fs.readdirSync(fullPath);
      for (const file of files) {
        await this.refreshFilesListByPath(path.join(filePath, file));
      }
    } else if (this.isNeededExtension(filePath)) {
      await this.addSpriteInfo(filePath);
    }
  }

  async addSpriteInfo(filePath: string) {
    const fullPath = path.join(this._dirPath, filePath);
    const sprite = {} as SpriteInfo;
    sprite.path = filePath;
    sprite.name = path.basename(filePath);
    sprite.meta = await sharp(fullPath).metadata();
    sprite.projectMeta = await this._projectMetaService.getSpriteMeta(fullPath);
    const stat = await promisify(fs.stat)(fullPath);
    sprite.lastUpdate = stat.mtimeMs;

    const oldIndex = this._filesList.findIndex(file => file.name === sprite.name);
    if (oldIndex > -1) {
      this._filesList[oldIndex] = sprite;
    } else {
      this._filesList.push(sprite);
    }

    return sprite;
  }

  isNeededExtension(filePath: string) {
    for (const ext of this._extensions) {
      if (filePath.endsWith(ext)) {
        return true;
      }
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
