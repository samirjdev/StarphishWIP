useEffect(() => {
  const handleKeyDown = (e) => {
    if (emails.length === 0) return; // Don't do anything if there are no emails left

    if (e.key === 'ArrowLeft') {
      // Trigger swipe left
      swiped('left', emails[currentIndex].ID, emails[currentIndex].IsPhishing);
    } else if (e.key === 'ArrowRight') {
      // Trigger swipe right
      swiped('right', emails[currentIndex].ID, emails[currentIndex].IsPhishing);
    }
  };

  // Add event listener
  window.addEventListener('keydown', handleKeyDown);

  // Remove event listener on cleanup
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [emails, currentIndex]); // Depend on emails and currentIndex
