// Multer + Cloudinary
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { env } = require("../config/environmentVariables");

const MAX_FILE_SIZE = env.MAX_FILE_SIZE * 1024 * 1024; // convert MB to Bytes

// configure storage for multer
// multer.memoryStorge() - when you use multer.memoryStorage(), the uploaded file is stored in memory (RAM) as a Buffer. `req.file.buffer` contains the raw binary data of the uploaded file.
const storage = new multer.memoryStorage();

// Define file type filter
const fileFilter = function (req, file, cb) {
	console.log("fileUploadService.js: fileFilter(): file: ", file);

	// Define accepted mime types and corresponding file extensions
	const acceptedTypes = [
		"image/jpeg",
		"image/jpg",
		"image/png",
		"image/webp",
	];

	// Check if the uploaded file's MIME type is in the accepted types array
	if (acceptedTypes.includes(file.mimetype)) {
		cb(null, true); // Accept file
	} else {
		cb(
			new Error(
				"Invalid file type, only JPEG, JPG, PNG and WebP, files are allowed."
			),
			false
		); // Reject file
	}
};

// Initialize multer instance with storage and file type filter
const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: MAX_FILE_SIZE,
	},
});

// Setup cloudinary for cloud based file uploads
cloudinary.config({
	cloud_name: env.CLOUDINARY_CLOUD_NAME,
	api_key: env.CLOUDINARY_API_KEY,
	api_secret: env.CLOUDINARY_API_SECRET,
});

module.exports = { upload, cloudinary };
