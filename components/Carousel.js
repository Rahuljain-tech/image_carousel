import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import useEmblaCarousel from 'embla-carousel-react';
import { FaLock, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

const Carousel = ({ defaultScrollSpeed = 10 }) => {
  const { userXP, chapters, loading, error, bookmarks, addBookmark, removeBookmark } = useContext(AppContext);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    skipSnaps: false,
  });
  const [shakeSlide, setShakeSlide] = useState(null);
  const [scrollSpeed, setScrollSpeed] = useState(defaultScrollSpeed);

  


  // To handle mouse wheel scrolling
  const onWheel = useCallback(
    (event) => {
        if (!emblaApi) {
          console.log("Embla API not connected.");
          return;
        }
        
        event.preventDefault();
  
       
        const delta = event.deltaY > 0 ? scrollSpeed : -scrollSpeed;
        console.log('Scrolling by delta:', delta);
  
        
        emblaApi.scrollBy(delta, true);  // true enables smooth scrolling
      },
      [emblaApi, scrollSpeed]
  );

  useEffect(() => {
    const emblaNode = emblaRef.current;
    if (!emblaApi || !emblaNode) return;

  
    const handleWheel = (e) => onWheel(e);
    emblaNode.addEventListener('wheel', handleWheel);

    return () => {
      emblaNode.removeEventListener('wheel', handleWheel);
    };
  }, [emblaApi, onWheel, emblaRef]);



  const handleSlideClick = (chapter) => {
    if (userXP < chapter.unlockXp) {
      // Triggers shake animation
      setShakeSlide(chapter.id);
      setTimeout(() => setShakeSlide(null), 500);
    } else {
      console.log(`Navigating to chapter ${chapter.id}`);
    }
  };

  const toggleBookmark = (chapterId) => {
    if (bookmarks.includes(chapterId)) {
      removeBookmark(chapterId);
    } else {
      addBookmark(chapterId);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error loading data.</div>;

  return (
    <div className="w-full px-4">
      {/* Scroll Speed Control */}
      <div className="flex justify-end mb-2">
        <label htmlFor="scrollSpeed" className="mr-2">Scroll Speed:</label>
        <input
          id="scrollSpeed"
          type="range"
          min="1"
          max="20"
          value={scrollSpeed}
          onChange={(e) => setScrollSpeed(Number(e.target.value))}
          className="slider"
        />
        <span className="ml-2">{scrollSpeed}</span>
      </div>

      {/* Carousel */}
      <div className="embla overflow-hidden" role="region" aria-label="Image Carousel" ref={emblaRef}>
        <div className="embla__container flex flex-nowrap">
          {chapters?.length > 0 ? (
      chapters.map((chapter) => {
        const isLocked = userXP < chapter.unlockXp;
        const isBookmarked = bookmarks.includes(chapter.id);
            return (
              <div
                className="embla__slide flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
                key={chapter.id}
              >
                <motion.div
                  className="relative cursor-pointer"
                  onClick={() => handleSlideClick(chapter)}
                  animate={shakeSlide === chapter.id ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleSlideClick(chapter);
                    }
                  }}
                  aria-label={
                    isLocked
                      ? `${chapter.title} is locked. Unlock with ${chapter.unlockXp} XP.`
                      : `Navigate to ${chapter.title}`
                  }
                >
                  <img
                    src={chapter.imageUrl}
                    alt={chapter.title}
                    className={`w-full h-64 object-cover rounded ${
                      isLocked ? 'grayscale' : ''
                    }`}
                    loading="lazy"
                  />
                  {isLocked && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <FaLock className="text-white text-4xl" aria-hidden="true" />
                    </div>
                  )}
                  {/* Bookmark Button */}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(chapter.id);
                      }}
                      className="text-white bg-black bg-opacity-50 p-1 rounded-full focus:outline-none"
                      aria-label={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
                    >
                      {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
                    </button>
                  </div>
                  <div className="mt-2 text-center text-lg font-semibold">{chapter.title}</div>
                </motion.div>
              </div>
            );
          })
        ) : (
            <p>No chapters available</p>
          )}
        </div>
      </div>

      {/* Navbar */}
      {emblaApi && <Navbar emblaApi={emblaApi}  />}
    </div>
  );
};

export default Carousel;
