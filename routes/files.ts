var router = require("express").Router();
const AWS = require("aws-sdk");
const multer = require("multer");
const upload = multer();
const client = require("../utils/apollo");
const gql = require("graphql-tag");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

router.post("/", upload.single("file"), function(req, res, next) {
  const { file } = req;
  const { companyId, title } = req.body;

  s3.upload(
    {
      Bucket: "travelwise-test",
      Key: file.originalname,
      Body: file.buffer
    },
    (err, { Location }) => {
      if (err) throw err;
      const ADD_FILE = gql`
        mutation addFile(
          $companyId: Int!
          $location: String!
          $title: String!
        ) {
          insert_files(
            objects: {
              company_id: $companyId
              location: $location
              title: $title
            }
          ) {
            returning {
              id
              company_id
              location
              title
            }
          }
        }
      `;
      client
        .mutate({
          mutation: ADD_FILE,
          variables: { companyId, location: Location, title }
        })
        .then(({ data }) => {
          res.send(data.insert_files.returning);
        })
        .catch(err => {
          res.status(400).send(err);
        });
    }
  );
});

module.exports = router;
