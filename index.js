var express = require('express');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var app = express();
var cors = require('cors');
var sharp = require('sharp');
var path = require('path');
var readChunk = require('read-chunk');
var fileType = require('file-type');
var fs = require('fs');
/* Cross Origin */
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/fileupload', upload.single('photo'), function (req, res) {
  sharp('./' + req.file.path).toBuffer().then(
    (data) => {
      sharp(data).resize(150).toFile('./' + req.file.path, (err, info) => {
        console.log('oke');
      });
    }
  ).catch(
    (err) => {
      console.log(err);
    }
  )
  res.json({ message: 'Success' });
});

app.get('/thumbnail/:id', function (req, res) {
  // Validate that req.params.id is 16 bytes hex string
  if (/^[0-9A-F]{32}$/i.test(req.params.id)) {
    const filePath = path.join(`uploads`, req.params.id);
    const buffer = readChunk.sync(filePath, 0, 4100);
    // Get the stored image type for this image
    const storedMimeType = fileType(buffer);
    res.setHeader('Content-Type', storedMimeType.mime);
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.sendStatus(400);
  }
});

app.listen(4000, function () {
  console.log('app running');
})