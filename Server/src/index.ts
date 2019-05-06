import express, { Request, Response } from "express";
import path from "path";
import { FileService } from "./filesService";
import cors from 'cors';
import { SpriteMetaService } from "./spriteMetaService";
import { FilterService } from "./filterService";
import { PreviewService } from "./preview.service";

// App init
var artPath = 'public/art';
var previewPath = 'public/preview';
const port = process.env.PORT || 3000;
var app = express();
const fullArtPath = path.join(__dirname, artPath);
const fullPreviewPath = path.join(__dirname, previewPath);
const projectMetaService = new SpriteMetaService();
const fileService = new FileService(fullArtPath, projectMetaService);
const filterService = new FilterService();
const previewService = new PreviewService(fullArtPath, fullPreviewPath);

(async function() {
  // Get files list
  const filesList = await fileService.getFilePaths();
  console.log(`got files list: ${filesList.length} files`);

  previewService.updatePreviews(filesList, false);

  // Start listening
  app.use(cors());

  app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public/client/index.html'));
  });

  app.get('/search', (req: Request, res: Response) => {
    const filtered = req.query ? filterService.filter(filesList, req.query) : filesList;    
    res.send(filtered);
  });

  app.get('/list', (req: Request, res: Response) => {
    res.send(filesList);
  })

  app.use('/art', express.static(path.join(__dirname, 'public/art/')));
  app.use('/preview', express.static(path.join(__dirname, 'public/preview/')));

  app.use(express.static(path.join(__dirname, 'public/client/')));

  app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });
})();