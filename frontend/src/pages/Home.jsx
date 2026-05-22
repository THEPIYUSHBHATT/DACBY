import { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import { fetchStoriesAPI, toggleBookmarkAPI } from '../services/storyService';
import { getMyBookmarksAPI } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const socket = io(backendUrl);

const Home = () => {
  const [stories, setStories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect to login if user isn't logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchStories = async (p = 1) => {
    try {
      const { data } = await fetchStoriesAPI(p, 10);
      setStories(data.stories);
      setPage(data.page);
      setTotalPages(data.pages);
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStories(page);
      getMyBookmarksAPI().then(({ data }) => setBookmarkedIds(data.map(b => b._id)));
    }

    // Listen for real-time scraped stories
    socket.on('newScrape', () => {
      console.log('New data scraped! Refreshing feed...');
      if (user) fetchStories(page); // Reload feed to show newest
    });

    return () => {
      socket.off('newScrape');
    };
  }, [page, user]);

  const toggleBookmark = async (id) => {
    if (!user) return alert("Please login to bookmark!");
    try {
      const { data } = await toggleBookmarkAPI(id);
      setBookmarkedIds(data.bookmarks);
    } catch (error) {
      console.error(error);
      alert("Error toggling bookmark");
    }
  };

  // Prevent UI flashing during redirect
  if (!user) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>Top Hacker News Stories</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {stories.map((story, index) => (
          <li key={story._id} style={{ padding: '1rem', borderBottom: '1px solid #ccc', display:'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <a href={story.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#000', fontWeight: 'bold' }}>
                {index + 1 + (page - 1) * 10}. {story.title}
              </a>
              <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#555' }}>
                {story.points} points by {story.author} | {story.comments}
              </p>
            </div>
            {user && (
              <button 
                onClick={() => toggleBookmark(story._id)} 
                style={{ 
                  cursor: 'pointer', 
                  background: 'transparent', 
                  border: 'none', 
                  fontSize: '1.5rem',
                  color: bookmarkedIds.includes(story._id) ? 'gold' : '#ccc'
                }}
              >
                ★
              </button>
            )}
          </li>
        ))}
      </ul>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default Home;