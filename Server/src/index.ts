import express, { Request, Response } from "express";
import path from "path";
import { FileService } from "./filesService";
import cors from 'cors';
import { SpriteMetaService } from "./spriteMetaService";
import { FilterService } from "./filterService";
import { PreviewService } from "./previewService";
import fileUpload from "express-fileupload";
import { NextFunction } from "connect";
import { SpriteInfo } from "./spriteInfo";


// App init
const artPath = process.env.ART_PATH || 'public/art';
const previewPath = process.env.PREVIEW_PATH || 'public/preview';
const port = process.env.PORT || 3000;
const app = express();
const fullArtPath = path.join(__dirname, artPath);
const fullPreviewPath = path.join(__dirname, previewPath);
const projectMetaService = new SpriteMetaService();
const fileService = new FileService(fullArtPath, projectMetaService);
const filterService = new FilterService();
const previewService = new PreviewService(fullArtPath, fullPreviewPath);

let spritesList: SpriteInfo[];

app.use(cors());
  app.use(fileUpload());

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public/client/index.html'));
});

app.get('/search', (req: Request, res: Response) => {
  const filtered = req.query ? filterService.filter(spritesList, req.query) : spritesList;    
  res.send(filtered);
});

app.get('/list', (req: Request, res: Response) => {
  res.send(spritesList);
});

app.use('/art', express.static(path.join(__dirname, 'public/art/')));
app.use('/preview', express.static(path.join(__dirname, 'public/preview/')));

app.post('/upload', (req: Request, res: Response) => {
  if(!req.files || !req.files['fileKey'])
  {
    console.log(req);
    res.status(503).send({error: 'No file'});
    return;
  }
  console.log(req.files);
  const fileKey = req.files['fileKey'];
  const files = (Array.isArray(fileKey) ? fileKey : [fileKey]) as any[];

  const filesPromises: Promise<SpriteInfo>[] = [];
  for(let i = 0; i < files.length; i++) {
    const file = files[i];
    filesPromises.push(fileService.saveSprite(file));
  }
  (async () => {
    const res = await Promise.all(filesPromises);
    previewService.updatePreviews(res, true);
  })();
});

app.use(express.static(path.join(__dirname, 'public/client/')));

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);


(async function() {
  // Get sprites list
  spritesList = await fileService.getFilePaths();
  console.log(`got files list: ${spritesList.length} files`);

  previewService.updatePreviews(spritesList, true);
  app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });
})();

function logErrors(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  } else {
    next(err);
  }
}

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  res.status(500);
  res.render('error', { error: err });
}
