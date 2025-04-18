import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import autocompletelist from "./assets/autocompletelist.json";

const AutocompleteInput = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null); 
  
  const data = autocompletelist;

  const handleGuessClick = () => {
    onSubmit(inputValue);
    setInputValue("");
    setSuggestions([]);
    setActiveIndex(-1);
  }

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 2) {
      const filtered = data.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setActiveIndex(-1);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        setInputValue(suggestions[activeIndex]);
        setSuggestions([]);
        setActiveIndex(-1);
      } else {
        handleGuessClick();
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSuggestions([]);
    setActiveIndex(-1);
  };

  const handleMouseEnter = (index) => {
    setActiveIndex(index);
  };

  const handleClickOutside = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="autocomplete-container" ref={containerRef}>
      <input
        autoFocus={true}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => handleMouseEnter(index)}
              className={index === activeIndex ? "active" : ""}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      <button className="guessNextButton" onClick={() => handleGuessClick()} type="submit">Guess</button>
    </div>
  );
};
AutocompleteInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default AutocompleteInput;
