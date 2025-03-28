const path = require("path");

module.exports = {
  IsFileUploaded(fileObj) {
    for (let key in fileObj) {
      if (fileObj.hasOwnProperty(key)) {
        return true;
      } else {
        return false;
      }
    }
  },
  uploadDir: path.join(__dirname, "../public/uploads/"),
};
