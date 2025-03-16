import { google } from "googleapis";
import googleapis from "googleapis";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY, // Set API key here if needed
});


// YouTube API configuration
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
export const PLAYLIST_IDS = {
  'LeetCode': 'PLcXpkI9A-RZI6FhydNz3JBt_-p_i25Cbr',
  'Codeforces': 'PLcXpkI9A-RZLUfBSNp-YQBCOezZKbDSgB',
  'CodeChef': 'PLcXpkI9A-RZIZ6lsE0KCcLWeKNoG45fYr'
};

/**
 * Fetches all videos from a YouTube playlist (handles pagination)
 * @param {string} playlistId - The ID of the YouTube playlist
 * @returns {Promise<Array>} - Array of video items
 */
export const fetchPlaylistVideos = async (playlistId) => {
    try {
      let videos = [];
      let nextPageToken = null;
  
      do {
        const response = await youtube.playlistItems.list({
          key: YOUTUBE_API_KEY,
          part: 'snippet',
          playlistId: playlistId,
          maxResults: 50,
          pageToken: nextPageToken,
        });
  
        videos = videos.concat(response.data.items);
        nextPageToken = response.data.nextPageToken || null; // Get next page token
      } while (nextPageToken); // Keep fetching if there are more pages
      console.log(`hello:${videos}`)
      return videos;
    } catch (error) {
      console.error('Error fetching playlist videos:', error);
      throw error;
    }
  };
  

/**
 * Searches for a video in a playlist based on a contest title
 * @param {string} platform - The platform (LeetCode, Codeforces, CodeChef)
 * @param {string} contestTitle - The title of the contest
 * @returns {Promise<Object|null>} - Matching video or null if not found
 */
export const findVideoByContestTitle = async (platform, contestTitle) => {
  try {
    const playlistId = PLAYLIST_IDS[platform];
    if (!playlistId) {
      throw new Error(`No playlist ID found for platform: ${platform}`);
    }
    
    const videos = await fetchPlaylistVideos(playlistId);
    
    // Clean up the contest title for better matching
    const cleanTitle = contestTitle.toLowerCase()
      .replace(/contest/g, '')
      .replace(/round/g, 'round ')
      .replace(/div\./g, 'div')
      .replace(/division/g, 'div')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Find the best matching video
    let bestMatch = null;
    let bestMatchScore = 0;
    
    for (const video of videos) {
      const videoTitle = video.snippet.title.toLowerCase();
      
      // Calculate a simple match score
      let score = 0;
      const titleWords = cleanTitle.split(' ');
      
      for (const word of titleWords) {
        if (word.length > 2 && videoTitle.includes(word)) {
          score += 1;
        }
      }
      
      if (score > bestMatchScore) {
        bestMatchScore = score;
        bestMatch = video;
      }
    }
    
    // Return the best match if it's good enough
    if (bestMatchScore >= 2) {
      return {
        videoId: bestMatch.snippet.resourceId.videoId,
        title: bestMatch.snippet.title,
        url: `https://www.youtube.com/watch?v=${bestMatch.snippet.resourceId.videoId}`
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error finding video by contest title:', error);
    throw error;
  }
};

export default {
  fetchPlaylistVideos,
  findVideoByContestTitle,
  PLAYLIST_IDS
};