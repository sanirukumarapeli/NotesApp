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
  toggleFavorite,
  getFavoriteNotes,
  getSharedNotes,
} = require("../controllers/noteController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Search, favorites, shared must come before :id route
router.get("/search", protect, searchNotes);
router.get("/favorites", protect, getFavoriteNotes);
router.get("/shared", protect, getSharedNotes);

router.route("/").get(protect, getNotes).post(protect, createNote);
router
  .route("/:id")
  .get(protect, getNoteById)
  .put(protect, updateNote)
  .delete(protect, deleteNote);

router.put("/:id/favorite", protect, toggleFavorite);
router.route("/:id/collaborators").post(protect, addCollaborator);

router.route("/:id/collaborators/:userId").delete(protect, removeCollaborator);

module.exports = router;
