import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userXP, setUserXP] = useState(null);
  const [books, setBooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  
  const [bookmarks, setBookmarks] = useLocalStorage('bookmarks', []);

  // Fetching user XP
  const fetchUserXP = async () => {
    try {
      const response = await axios.get('https://mocki.io/v1/711ee638-acc4-47aa-b0d1-c63fe3c2b85c');
      console.log(response.data.xp)
      setUserXP(response.data.xp); 
    } catch (err) {
      console.error('Error fetching user XP:', err);
      setError(true);
    }
  };

  // Fetching chapters data
  const fetchChapters = async () => {
    try {
      const response = await axios.get('https://mocki.io/v1/306e1e4d-22c0-4645-90cc-5cb048238f56');
        console.log(response.data.books);
      setChapters(response.data.books.chapters);
    } catch (err) {
      console.error('Error fetching chapters:', err);
      setError(true);
    }
  };


  const fetchBooks = async () => {
    try {
        const response = await fetch('https://mocki.io/v1/306e1e4d-22c0-4645-90cc-5cb048238f56'); 
        const data = await response.json();
        setBooks(data.books);
        // Flatten the chapters for all books
        const allChapters = data.books.flatMap(book => book.chapters); //it helps in arranging all the chapters in one array
        setChapters(allChapters);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
};


  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchUserXP(), fetchBooks()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const addBookmark = (chapterId) => {
    if (!bookmarks.includes(chapterId)) {
      setBookmarks([...bookmarks, chapterId]);
    }
  };

  const removeBookmark = (chapterId) => {
    setBookmarks(bookmarks.filter((id) => id !== chapterId));
  };

  return (
    <AppContext.Provider
      value={{
        userXP,
        books,
        chapters,
        loading,
        error,
        bookmarks,
        addBookmark,
        removeBookmark,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
