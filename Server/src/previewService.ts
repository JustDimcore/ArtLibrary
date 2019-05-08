import { SpriteInfo } from "./spriteInfo";
import fs from "fs";
import path from "path";
import sharp, { OutputInfo } from "sharp";
import { promisify } from "util";


export class PreviewService {

  public previewWidth: number = process.env.PreviewWidth ? Number.parseInt(process.env.PreviewWidth) : 256;
  public previewHeight: number = process.env.PreviewHeight ? Number.parseInt(process.env.PreviewHeight) : 256;
  public compressionLevel: number = process.env.PreviewCompressionLevel ? Number.parseInt(process.env.PreviewCompressionLevel) : 9;
  public quality: number = process.env.PreviewQuality ? Number.parseInt(process.env.PreviewQuality) : 80; // TODO: Add png quality supporting. Requires precompiled libimagequant for libvips


  private _previews: string[];

  constructor(private _originalsPath: string, private _previewsPath: string) {
    
  }

  public async updatePreviews(sprites: SpriteInfo[], meesingOnly: boolean) {
    if(!this._previews) {
      await this.init();
    }

    if (meesingOnly) {
      sprites = sprites.filter(sprite => !this._previews.includes(sprite.name));
    }

    await this.createPreviews(sprites);
  }

  public async init() {
    if (await promisify(fs.exists)(this._previewsPath)) {
      await promisify(fs.unlink)(this._previewsPath);
    }

    await promisify(fs.mkdir)(this._previewsPath, {recursive: true});
    const files = await promisify(fs.readdir)(this._previewsPath);
    console.log(`got preview files: ${files.length} items`);
    this._previews = files;
  }

  private async createPreviews(sprites: SpriteInfo[]) {
    console.log(`prewiews creating for ${sprites.length} images`);
    const promises: Promise<OutputInfo>[] = [];
    sprites.forEach(sprite => {
      console.log(`${sprite.name} preview creating`);
      const inputPath = path.join(this._originalsPath, sprite.path);
      const outputPath = path.join(this._previewsPath, sprite.name);
      const image = sharp(inputPath);
      const preview = image.resize(this.previewWidth, this.previewHeight, {fit: 'inside', withoutEnlargement: true})

      const promise = preview
        .toFormat(sprite.meta.format, {quality: this.quality, compressionLevel: this.compressionLevel})
        .toFile(outputPath);
      
      promise.catch(error => {
        console.log(`Error: ${sprite.name}: ${error}`);
      })

      promises.push(promise);
    });

    const promiseResult = await Promise.all(promises).catch(error => console.log(error));
    console.log(`created new ${sprites.length} previews`);
    return promiseResult;
  }
}