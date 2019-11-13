var router = require("express").Router();
const AWS = require("aws-sdk");
const multer = require("multer");
const upload = multer();
const client = require("../utils/apollo.ts");
const { calculateFileSize } = require("../utils/fileHelper.ts");
const { ADD_FILE, GET_FILE } = require("../utils/queries.ts");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

router.post("/upload", upload.single("file"), function(req, res) {
  const { file } = req;
  const { companyId, title } = req.body;
  const key = `${Date.now()}-${file.originalname}`;
  try {
    s3.upload(
      {
        Bucket: `travelwise-test/${companyId}`,
        Key: key,
        Body: file.buffer
      },
      (err, { Location }) => {
        if (err) throw err;
        client
          .mutate({
            mutation: ADD_FILE,
            variables: {
              companyId,
              location: Location,
              title: title ? title : file.originalname,
              key,
              fileSize: calculateFileSize(file.size)
            }
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

router.post("/download", function(req, res) {
  const { fileId: id, companyId } = req.body;
  client
    .query({
      variables: {
        id
      },
      query: GET_FILE
    })
    .then(({ data }) => {
      const options = {
        Bucket: `travelwise-test/${companyId}`,
        Key: data.files[0].key
      };
      res.attachment(data.files[0].key);
      const fileStream = s3.getObject(options).createReadStream();
      fileStream.pipe(res);
    });
});

module.exports = router;
