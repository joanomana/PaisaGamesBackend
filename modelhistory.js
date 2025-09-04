import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, enum: ['create_review', 'edit_review', 'delete_review'], required: true },
  review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
  details: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('History', HistorySchema);
