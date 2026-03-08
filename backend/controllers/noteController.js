const Note = require("../models/Note");
const User = require("../models/User");
const mongoose = require("mongoose");

// @desc    Get all notes for current user (owned + collaborated)
// @route   GET /api/notes
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      $or: [{ owner: req.user._id }, { "collaborators.user": req.user._id }],
    })
      .populate("owner", "name email")
      .populate("collaborators.user", "name email")
      .sort({ isPinned: -1, updatedAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
const getNoteById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const note = await Note.findById(req.params.id)
      .populate("owner", "name email")
      .populate("collaborators.user", "name email");

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check access
    const isOwner = note.owner._id.toString() === req.user._id.toString();
    const isCollaborator = note.collaborators.some(
      (c) => c.user._id.toString() === req.user._id.toString(),
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a note
// @route   POST /api/notes
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const note = await Note.create({
      title,
      content: content || "",
      owner: req.user._id,
    });

    const populated = await note.populate("owner", "name email");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
const updateNote = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Owner or editor can update
    const isOwner = note.owner.toString() === req.user._id.toString();
    const isEditor = note.collaborators.some(
      (c) =>
        c.user.toString() === req.user._id.toString() && c.role === "editor",
    );

    if (!isOwner && !isEditor) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this note" });
    }

    const { title, content, isPinned } = req.body;
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (isPinned !== undefined && isOwner) note.isPinned = isPinned;

    const updated = await note.save();
    await updated.populate("owner", "name email");
    await updated.populate("collaborators.user", "name email");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the owner can delete this note" });
    }

    await note.deleteOne();
    res.json({ message: "Note removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search notes (full-text)
// @route   GET /api/notes/search?q=keyword
const searchNotes = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const notes = await Note.find({
      $and: [
        { $text: { $search: q } },
        {
          $or: [
            { owner: req.user._id },
            { "collaborators.user": req.user._id },
          ],
        },
      ],
    })
      .populate("owner", "name email")
      .populate("collaborators.user", "name email")
      .sort({ score: { $meta: "textScore" } });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add collaborator to a note
// @route   POST /api/notes/:id/collaborators
const addCollaborator = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const { email, role } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Collaborator email is required" });
    }

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the owner can manage collaborators" });
    }

    const collaborator = await User.findOne({ email });
    if (!collaborator) {
      return res
        .status(404)
        .json({ message: "User not found with that email" });
    }

    if (collaborator._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot add yourself as a collaborator" });
    }

    const alreadyAdded = note.collaborators.find(
      (c) => c.user.toString() === collaborator._id.toString(),
    );
    if (alreadyAdded) {
      return res
        .status(400)
        .json({ message: "User is already a collaborator" });
    }

    note.collaborators.push({
      user: collaborator._id,
      role: role || "viewer",
    });

    await note.save();
    await note.populate("owner", "name email");
    await note.populate("collaborators.user", "name email");

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove collaborator from a note
// @route   DELETE /api/notes/:id/collaborators/:userId
const removeCollaborator = async (req, res) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(req.params.id) ||
      !mongoose.Types.ObjectId.isValid(req.params.userId)
    ) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the owner can manage collaborators" });
    }

    note.collaborators = note.collaborators.filter(
      (c) => c.user.toString() !== req.params.userId,
    );

    await note.save();
    await note.populate("owner", "name email");
    await note.populate("collaborators.user", "name email");

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
  addCollaborator,
  removeCollaborator,
};
