// ✅ Import Multer
const multer = require('multer');
const storage = multer.memoryStorage();
const { S3Client, PutObjectCommand, DeleteObjectCommand  } = require('@aws-sdk/client-s3');


// ✅ Initialize Multer
const upload = multer({ storage });
module.exports = upload;
