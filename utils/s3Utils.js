const { S3Client, DeleteObjectCommand , DeleteObjectsCommand, PutObjectCommand} = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ✅ Insert image to S3
exports.insertImageToS3 = async (file) => {
    try {
        const fileName = `uploads/${Date.now()}_${file.originalname}`;
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        };
        await s3.send(new PutObjectCommand(params));
        return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
    } catch (error) {
        throw new Error("Error uploading image");
    }
};

// ✅ Extract file name from S3 URL
exports.extractFileName = (imageUrl) => imageUrl?.split(".com/")[1] || null;

// ✅ Batch delete images from S3
exports.batchDeleteImagesFromS3 = async (imageKeys) => {
    try {
        if (!imageKeys.length) return;
        const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Delete: { Objects: imageKeys.map((Key) => ({ Key })), Quiet: false },
        };
        await s3.send(new DeleteObjectsCommand(deleteParams));
    } catch (s3Error) {
        console.error("Error deleting images from S3:", s3Error);
    }
};

// ✅ Delete image from S3
exports.deleteImageFromS3 = async (s3Key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: s3Key,
  };
  const command = new DeleteObjectCommand(params);
  await s3.send(command);
};
