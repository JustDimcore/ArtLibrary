import * as fs from 'fs';
import { promisify } from 'util';

export class SpriteMetaService {
    async getSpriteMeta(fullPath: string): Promise<{}> { 
        if (await promisify(fs.exists)(fullPath + '.json')) {
            const buffer = await promisify(fs.readFile)(fullPath + '.json');
            return JSON.parse(buffer.toString('utf8'));
        }
        return null;
    }

    saveSpriteMeta(fullPath: string, spriteMeta: {}) {
        fs.writeFileSync(fullPath + '.json', spriteMeta);
    }
}
