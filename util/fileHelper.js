const fs = require('fs');

const deleteImage = (filePath) => {
  fs.unlink(filePath, (err) => {
    if(err){
      throw (err);
    }
  });
};

exports.deleteImage = deleteImage;