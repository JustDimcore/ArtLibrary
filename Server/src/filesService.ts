import fs from "fs";
import path from "path";

export class FileService {

  private _filesList: string[] = [];
  private _isDirty = true;

  constructor(private _dirPath: string) {
    fs.watch(_dirPath, {recursive : true} ,(event, filename) => {
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
    }
    this._filesList = this.getFilesList();
    this._isDirty = false;
  }
  
  private getFilesList(filePath?: string, outputList?: string[]): string[] {
    filePath = filePath || '';
    const list = outputList || [];
    var stats = fs.lstatSync(path.join(this._dirPath, filePath));
    if(stats.isDirectory())
    {
      const files = fs.readdirSync(path.join(this._dirPath, filePath));
      files.forEach(file => this.getFilesList(path.join(filePath, file), list))
    }
    else
      list.push(filePath);

    return list;
  }
}