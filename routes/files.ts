var router = require("express").Router();
const AWS = require("aws-sdk");
const multer = require("multer");
const upload = multer();
const client = require("../utils/apollo");

const { ADD_FILE } = require("../utils/queries");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

router.post("/upload", upload.single("file"), function(req, res) {
  const { file } = req;
  const { companyId, title } = req.body;
  try {
    s3.upload(
      {
        Bucket: "travelwise-test",
        Key: `${file.originalname}:${Date.now()}`,
        Body: file.buffer
      },
      (err, { Location }) => {
        if (err) throw err;
        client
          .mutate({
            mutation: ADD_FILE,
            variables: { companyId, location: Location, title }
          })
          .then(({ data }) => {
            res.send(data.insert_files.returning);
          });
      }
    );
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
