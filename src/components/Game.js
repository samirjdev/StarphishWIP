import React, { useState, useEffect } from 'react';
import EmailCard from './Card';
import Typography from '@mui/material/Typography';
import { useKeyPress } from '../hooks/useKeyPress';

const Game = () => {
  const [emails, setEmails] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const leftPress = useKeyPress('ArrowLeft');
  const rightPress = useKeyPress('ArrowRight');

  // Fetch emails from backend
  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await fetch('/api/emails'); // Adjust the URL as needed
      const data = await response.json();
      setEmails(data);
    } catch (error) {
      console.error('Failed to fetch emails:', error);
    }
  };

  useEffect(() => {
    if (leftPress) {
      handleSwipe(false); // Assuming left swipe means "Phishing"
    } else if (rightPress) {
      handleSwipe(true); // Assuming right swipe means "Real"
    }
  }, [leftPress, rightPress, emails]);

  const handleSwipe = (isReal) => {
    if (emails.length === 0) return; // Guard clause if emails are not yet loaded
    
    if ((isReal && !emails[currentIndex].IsPhishing) || (!isReal && emails[currentIndex].IsPhishing)) {
      setScore(score + 1);
    }
    setCurrentIndex((currentIndex + 1) % emails.length);
  };

  if (emails.length === 0) return <div>Loading...</div>; // Or any other loading state

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}> {/* Ensure full viewport width */}
      <Typography variant="h5" style={{ position: 'absolute', top: 10, right: 16, zIndex: 1000 }}>
        {score}
      </Typography>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <EmailCard
          title={emails[currentIndex].Title} // Ensure you're passing the title
          email={emails[currentIndex].Content}
          isPhishing={emails[currentIndex].IsPhishing}
        />
      </div>
    </div>
  );
};


export default Game;
