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
filesList.forEach(file => console.log(path.join(directoryPath, file)));
console.log(`got files list: ${filesList.length} files`);

// Start listening
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