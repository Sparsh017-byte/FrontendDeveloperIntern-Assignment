import express from 'express'
import { createNote, getNotes, updateNote, deleteNote } from '../controllers/notesController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router();

router.use(protect);
router.get('/', getNotes);
router.post('/', createNote);
router.patch('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
