import mongoose from 'mongoose';

const BookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to prevent duplicate bookmarks
BookmarkSchema.index({ userId: 1, contestId: 1 }, { unique: true });

const Bookmark = mongoose.model('Bookmark', BookmarkSchema);
export default Bookmark;
