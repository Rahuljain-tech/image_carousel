import React, { useContext, useCallback } from 'react';
import { AppContext } from '../context/AppContext';

const Navbar = React.memo(({ emblaApi }) => {
  const { chapters } = useContext(AppContext);

  const handleClick = useCallback(
    (bookNumber) => {
      if (!emblaApi) {
        console.log('embla api not connected')
        return;
      }

      // Defining book ranges
      const bookRanges = {
        1: [1, 7],   
        2: [8, 14],  
        3: [15, 21], 
      };

      const [start, end] = bookRanges[bookNumber];
      console.log(`Book ${bookNumber}: start ${start}, end ${end}`); 

      // Find the index of the start chapter, it help in scrolling to first chapters of each book
      const startChapterIndex = chapters.findIndex((ch) => ch.id === start);
      console.log(`Start chapter index for Book ${bookNumber}: ${startChapterIndex}`);

      if (startChapterIndex !== -1) {
        emblaApi.scrollTo(startChapterIndex);
      } else {
        console.warn(`No chapter found for ID: ${start}`); 
      }
    },
    [emblaApi, chapters]
  );

  return (
    <div className="flex justify-center mt-4 space-x-4">
      <button
        onClick={() => handleClick(1)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
      >
        Book 1
      </button>
      <button
        onClick={() => handleClick(2)}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
      >
        Book 2
      </button>
      <button
        onClick={() => handleClick(3)}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
      >
        Book 3
      </button>
    </div>
  );
});

export default Navbar;
