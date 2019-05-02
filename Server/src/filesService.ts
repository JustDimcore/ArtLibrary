import fs from "fs";
import path from "path";

export class FileService {

  private _filesList: string[] = [];
  private _isDirty = true;

  constructor(private _dirPath: string) {

  }

  public getFilePaths() {
    if(this._isDirty)
      this.refreshFilesList();
    
    return this._filesList;
  }

  public refreshFilesList() {
    this._filesList = this.getFilesList(this._dirPath);
    this._isDirty = false;
  }
  
  private getFilesList(filePath: string, outputList?: string[]): string[] {
    const list = outputList || [];
    var stats = fs.lstatSync(filePath);
    if(stats.isDirectory())
    {
      const files = fs.readdirSync(filePath);
      files.forEach(file => this.getFilesList(path.join(filePath, file), list))
    }
    else
      list.push(filePath);

    return list;
  }
}