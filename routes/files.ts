var express = require('express');
var router = express.Router();
const AWS = require('aws-sdk');
const multer = require('multer');
const upload = multer();

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

router.post('/', upload.single('file'), function (req, res, next) {
	const { file } = req;

	s3.upload({
		Bucket: 'travelwise-test',
		Key: file.originalname,
		Body: file.buffer
	}, function (err, data) {
		if (err) throw err;
		res.send(data.Location);
	})
});

module.exports = router;