const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files'), false)
    }
    cb(null, true);
};

const upload = multer({ storage: storage,  fileFilter: imageFileFilter })

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmind, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not support on /imageUpload/' + req.params.dishId);
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmind, upload.single('imageFile'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmind, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not support on /imageUpload/' + req.params.dishId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmind, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not support on /imageUpload/' + req.params.dishId);
})

module.exports = uploadRouter;