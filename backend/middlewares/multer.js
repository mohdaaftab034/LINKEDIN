import multer from "multer";

const storage = multer.memoryStorage(); // stores files in memory (buffer)
const upload = multer({ storage });

export default upload;