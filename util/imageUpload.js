const cloudinary = require('cloudinary');

const cloudinaryUpload = (file) => {
  return new Promise((resolve, reject) => {

    console.log(file);

    cloudinary.v2.uploader.upload_stream({
        // eager: [{
        //   width: 400,
        //   height: 300,
        //   crop: "pad"
        // }],
        tags: "howtotech_img",
        resource_type: 'raw',
        public_id: 'howtotech',
      }, (error, result) => {
        if (error)
          reject(error);
        console.log(result);
        resolve(result);
      })
      .end(file.buffer);
  });
}

module.exports = {
  cloudinaryUpload
}