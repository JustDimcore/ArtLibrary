import express, { Request, Response } from "express";
import path from "path";
import { FileService } from "./filesService";

// App init
var artPath = 'public/art';
const port = process.env.PORT || 3000;
var app = express();

// Get files list
const directoryPath = path.join(__dirname, artPath);
const fileService = new FileService(directoryPath);
const filesList = fileService.getFilePaths();
filesList.forEach(file => console.log(file));
console.log(`got files list: ${filesList.length} files`);

// Start listening
app.use((req, res, next) => {

  console.log('set headers');
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Pass to next layer of middleware
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public/client/index.html'));
});

app.get('/list', (req: Request, res: Response) => {
  res.send(filesList);
})

app.use('/art', express.static(path.join(__dirname, 'public/art/')));

app.use(express.static(path.join(__dirname, 'public/client/')));

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});