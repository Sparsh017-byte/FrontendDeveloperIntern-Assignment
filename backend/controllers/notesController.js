import notesModel from "../models/notes.js";

export const createNote = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const note = await notesModel.create({
      title,
      description,
      status: status || "pending",
      user: req.user._id,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getNotes = async (req, res) => {
  try {
    const notes = await notesModel.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await notesModel.findById(id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Forbidden" });

    note.title = req.body.title ?? note.title;
    note.description = req.body.description ?? note.description;
    note.status = req.body.status ?? note.status;

    await note.save();
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await notesModel.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    
    await notesModel.deleteOne({ _id: id });

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
