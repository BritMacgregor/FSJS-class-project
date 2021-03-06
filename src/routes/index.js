// src/routes/index.js
const router = require('express').Router();
const mongoose = require('mongoose');

// Totally fake data
const FILES = [
  {id: 'a', title: 'cutecat1.jpg', description: 'A cute cat'},
  {id: 'b', title: 'uglycat1.jpg', description: 'Just kidding, all cats are cute'},
  {id: 'c', title: 'total_recall_poster.jpg', description: 'Quaid, start the reactor...'},
  {id: 'd', title: 'louisville_coffee.txt', description: 'Coffee shop ratings'},
];

//PATH TO /DOC
router.use('/doc', function(req, res, next) {
  res.end(`Documentation http://expressjs.com/`);
});

 //GET A LIST OF ALL FILES IN THE DB
 router.get('/file', function(req, res, next) {
   const File = mongoose.model('File');

   File.find({deleted: {$ne: true}}, function(err, files) {
     if (err) {
       console.log(err);
       return res.status(500).json(err);
     }

     res.json(files);
   });
 });

 //GET A SINGLE FILE BY PASSING ITS ID AS A URL
router.get('/file/:fileId', function(req, res, next) {
  const {fileId} = req.params;
  // same as 'const fileId = req.params.fileId'

  const file = FILES.find(entry => entry.id === fileId);
  if (!file) {
    return res.status(404).end(`Could not find file '${fileId}'`);
  }

  res.json(file);
});

//CREATE
//CREATES A NEW FILE
router.post('/file', function(req, res, next) {
  const File = mongoose.model('File');
  const fileData = {
    title: req.body.title,
    description: req.body.description,
  };

  File.create(fileData, function(err, newFile) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(newFile);
  });
});

//UPDATE
//UPDATES AN ELEMENT
router.put('/file/:fileId', function(req, res, next) {
  const File = mongoose.model('File');
  const fileId = req.params.fileId;

  File.findById(fileId, function(err, file) {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    if (!file) {
      return res.status(404).json({message: "File not found"});
    }

    file.title = req.body.title;
    file.description = req.body.description;

    file.save(function(err, savedFile) {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      res.json(savedFile);
    })

  })

});

//DELETE
//DELETES AN ELEMENT
router.delete('/file/:fileId', function(req, res, next) {
 const File = mongoose.model('File');
 const fileId = req.params.fileId;

 File.findById(fileId, function(err, file) {
   if (err) {
     console.log(err);
     return res.status(500).json(err);
   }
   if (!file) {
     return res.status(404).json({message: "File not found"});
   }

   file.deleted = true;

   file.save(function(err, doomedFile) {
     res.json(doomedFile);
   })

 })
});


// //ROUTE TO THE HOMEPAGE PUG TEMPLATE
// router.get('/', function(req, res, next) {
//   return res.render('index', { title: 'Home' });
// });
//
// //example of how to get a pug template homepage
// // app.get('/page', function(req, res, next){
// //   //get the data dynamically
// //   res.render('page', data);
// // })


module.exports = router;
