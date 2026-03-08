const express = require("express");
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
  addCollaborator,
  removeCollaborator,
} = require("../controllers/noteController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Search must come before :id route
router.get("/search", protect, searchNotes);

router.route("/").get(protect, getNotes).post(protect, createNote);
router
  .route("/:id")
  .get(protect, getNoteById)
  .put(protect, updateNote)
  .delete(protect, deleteNote);

router.route("/:id/collaborators").post(protect, addCollaborator);

router.route("/:id/collaborators/:userId").delete(protect, removeCollaborator);

module.exports = router;
