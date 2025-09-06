/**
 * Node modules
 */
import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 10 * 1024 * 1024,
  },
});
