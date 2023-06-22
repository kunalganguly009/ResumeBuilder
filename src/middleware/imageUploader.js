// Image uploader
const multer = require('multer');
const path = require('path');

let storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname + '/../../uploads/'));
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now())
	}
});

function fileFilter (req, file, cb) {

    if(!(file.mimetype in ["jpeg", "jpg", "png"])){
        cb(null, false)
    }else{
        cb(null, true)
    }
}

let upload = multer({ storage: storage }, fileFilter=fileFilter);

module.exports = upload;