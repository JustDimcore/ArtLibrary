import fs from "fs";

export class SpriteMetaService {
    getSpriteMeta(fullPath: string): {} { 
        if(fs.existsSync(fullPath + '.json')) {
            const buffer = fs.readFileSync(fullPath + '.json');
            return buffer.toJSON();
        }
    }

    saveSpriteMeta(fullPath: string, spriteMeta: {}) {
        fs.writeFileSync(fullPath + '.json', spriteMeta);
    }
}