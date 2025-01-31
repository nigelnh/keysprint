import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CompletionModal from './CompletionModal';

const DEFAULT_TEXT = 'The quick brown fox jumps over the lazy dog.';

export default function TypingTest() {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [isCorrect, setIsCorrect] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [useRandomSentence, setUseRandomSentence] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchQuote();
  }, [useRandomSentence]);

  const fetchQuote = async () => {
    if (!useRandomSentence) {
      setText(DEFAULT_TEXT);
      return;
    }

    try {
      // This API provides random sentences
      const response = await axios.get('https://api.quotable.io/random', {
        params: {
          minLength: 50,  // Minimum length of quote
          maxLength: 100  // Maximum length of quote
        }
      });
      setText(response.data.content);

      // Immediately fetch next quote and store it for faster response
      const nextResponse = await axios.get('https://api.quotable.io/random', {
        params: {
          minLength: 50,
          maxLength: 100
        }
      });
      localStorage.setItem('nextQuote', nextResponse.data.content);
    } catch (error) {
      console.error('Error fetching quote:', error);
      // Try to use stored quote if available
      const storedQuote = localStorage.getItem('nextQuote');
      if (storedQuote) {
        setText(storedQuote);
        localStorage.removeItem('nextQuote');
      } else {
        setText(DEFAULT_TEXT);
      }
    }
  };

  // Pre-fetch next quote when component mounts
  useEffect(() => {
    const preloadNextQuote = async () => {
      try {
        const response = await axios.get('https://api.quotable.io/random', {
          params: {
            minLength: 50,
            maxLength: 100
          }
        });
        localStorage.setItem('nextQuote', response.data.content);
      } catch (error) {
        console.error('Error pre-fetching quote:', error);
      }
    };
    preloadNextQuote();
  }, []);

  const calculateWpm = (inputLength) => {
    if (!startTime) return 0;
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
    const wordsTyped = inputLength / 5; // Assume average word length is 5 characters
    return Math.round(wordsTyped / timeElapsed);
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setUserInput(input);

    if (!startTime && input.length === 1) {
      setStartTime(Date.now());
    }

    const isMatch = text.startsWith(input);
    setIsCorrect(isMatch);
    setWpm(calculateWpm(input.length));

    if (input === text) {
      setShowModal(true); // Show modal instead of alert
    }
  };

  const resetTest = async () => {
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setIsCorrect(true);
    // Fetch new quote only if random sentences are enabled
    if (useRandomSentence) {
      await fetchQuote();
    } else {
      setText(DEFAULT_TEXT);
    }
    inputRef.current?.focus();
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetTest();
  };

  const handleOptionChange = async (useRandom) => {
    setUseRandomSentence(useRandom);
    // Reset with new quote
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setIsCorrect(true);
    if (useRandom) {
      await fetchQuote();
    } else {
      setText(DEFAULT_TEXT);
    }
    inputRef.current?.focus();
  };

  return (
    <div className="typing-test">
      <div className="stats">
        <span>WPM: {wpm}</span>
        <button onClick={resetTest}>Reset</button>
      </div>
      
      <div className="text-display">
        {text.split('').map((char, index) => {
          let charClass = '';
          if (index < userInput.length) {
            charClass = userInput[index] === char ? 'correct' : 'incorrect';
          }
          return (
            <span key={index} className={charClass}>
              {char}
            </span>
          );
        })}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        className={isCorrect ? 'correct-input' : 'incorrect-input'}
        placeholder="Start typing..."
        autoFocus
      />

      <div className="sentence-options">
        <button 
          className={`option-button ${!useRandomSentence ? 'active' : ''}`}
          onClick={() => handleOptionChange(false)}
        >
          Default Sentence
        </button>
        <button 
          className={`option-button ${useRandomSentence ? 'active' : ''}`}
          onClick={() => handleOptionChange(true)}
        >
          Random Sentences
        </button>
      </div>

      {showModal && (
        <CompletionModal 
          wpm={wpm} 
          onClose={handleModalClose}
        />
      )}
    </div>
  );
} 