import mongoose from 'mongoose';
const notesSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const notesModel = mongoose.model('Notes', notesSchema);
export default notesModel;