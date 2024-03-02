import React, { useState, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import EmailCard from './Card'; // Ensure this is correctly pointing to your EmailCard component file
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import './Game.css'; // Make sure this points to your CSS file

const Game = () => {
  const [emails, setEmails] = useState([]);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState();

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
    const handleKeyDown = (e) => {
      if (emails.length === 0 || currentIndex >= emails.length) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const isPhishing = emails[currentIndex].IsPhishing;
        const emailId = emails[currentIndex].ID;
        const direction = e.key === 'ArrowLeft' ? 'left' : 'right';
        
        // Perform the swipe action
        swiped(direction, emailId, isPhishing);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Remove event listener on cleanup
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [emails, currentIndex]); // Ensure currentIndex is included in the dependency array

  const swiped = (direction, emailId, isPhishing) => {
    console.log('Swiping ' + direction);
    // Assuming left swipe means "Phishing" and right means "Real"
    const swipeCorrect = (direction === 'left' && isPhishing) || (direction === 'right' && !isPhishing);
    if (swipeCorrect) {
      setScore((prevScore) => prevScore + 1);
      setLastDirection(direction);

    }

    // Remove the swiped email from the state
    setEmails((prevEmails) => prevEmails.filter(email => email.ID !== emailId));
  };

  const onCardLeftScreen = (emailId) => {
    console.log(emailId + ' left the screen!');
  };

  const fixedCardStyle = {
    width: '400px', // Set your desired width
    height: '500px', // Set your desired height
    // Add any additional styles as needed
  };
  

  return (
    <div className="game">
      <Typography variant="h5" className="score" style={{userSelect: 'none'}}>
        {score}
      </Typography>
      <div className="cardContainer">
      {
       emails.map((email, index) => (
          <div key={email.ID} style={{ position: 'absolute', zIndex: emails.length - index }}>
           <TinderCard
              onSwipe={(dir) => swiped(dir, email.ID, email.IsPhishing)}
              onCardLeftScreen={() => onCardLeftScreen(email.ID)}
              preventSwipe={['up', 'down']}
              style={{ ...fixedCardStyle }} // Apply the fixed dimensions here
           >
              <EmailCard
              title={email.Title}
               email={email.Content}
               isPhishing={email.IsPhishing}
               style={fixedCardStyle} // Apply the fixed dimensions to your EmailCard as well
        />
      </TinderCard>
    </div>
  ))
}
      </div>
    </div>
  );
};

export default Game;
