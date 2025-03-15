import express from 'express';
import auth from '../middleware/auth.js';
import Bookmark from '../models/Bookmark.js';

const router = express.Router();

// Create a bookmark - POST /api/bookmarks
router.post('/', auth, async (req, res) => {
  try {
    const { id, name, platform, start_time, url } = req.body;
    
    // Check if bookmark already exists
    const existingBookmark = await Bookmark.findOne({ 
      userId: req.user.id,
      contestId: id
    });
    
    if (existingBookmark) {
      return res.status(400).json({ msg: 'Contest already bookmarked' });
    }
    
    const newBookmark = new Bookmark({
      userId: req.user.id,
      contestId: id,
      name,
      platform,
      start_time,
      url
    });
    
    const bookmark = await newBookmark.save();
    res.json(bookmark);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all bookmarks - GET /api/bookmarks
router.get('/', auth, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user.id });
    res.json(bookmarks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a bookmark - DELETE /api/bookmarks/:id
import mongoose from 'mongoose';

router.delete('/:id', auth, async (req, res) => {
  try {
    const query = { contestId: req.params.id, userId: req.user.id };

    // Check if the provided ID is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      query.$or = [{ _id: req.params.id, userId: req.user.id }];
    }

    const bookmark = await Bookmark.findOne(query);

    if (!bookmark) {
      return res.status(404).json({ msg: 'Bookmark not found' });
    }

    await Bookmark.findByIdAndRemove(bookmark._id);
    res.json({ msg: 'Bookmark removed' });
  } catch (err) {
    console.error('Delete bookmark error:', err.message);
    res.status(500).send('Server Error');
  }
});


export default router;
