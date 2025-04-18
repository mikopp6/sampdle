import { useState } from "react";
import "./App.css";
import YoutubeEmbed from "./YoutubeEmbed";
import AutoComplete from "./Autocomplete";

import winner from "./assets/win.png";
import originals from "./assets/originals.json";
import samples from "./assets/samples.json";

const App = () => {
  const [gameStart, setGameStart] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [counter, setCounter] = useState(0);
  const [guessed, setGuessed] = useState(false);
  const [currentOriginal, setCurrentOriginal] = useState(originals[0]);
  const [currentSample, setCurrentSample] = useState(samples[0]);
  

  const handleSubmit = (e) => {
    // e.preventDefault();
    // const form = e.target;
    // const formData = new FormData(form);
    // const formJson = Object.fromEntries(formData.entries());

    // if (currentSample.title.includes(formJson.guess)) {
    //   setGuessed(true);
    // } else {
    //   console.log(formJson.guess);
    // }
    console.log(e);
    setGuessed(true);
  };

  const handleNext = () => {
    console.log(counter);
    console.log(originals.length);
    if (counter + 1 > originals.length - 1) setGameOver(true);
    else {
      setCurrentSample(samples[counter + 1]);
      setCurrentOriginal(originals[counter + 1]);
      setCounter(counter + 1);
      setGuessed(false);
    }
  };

  return (
    <div className="main">
      <h1 className="header">sampdle</h1>
      {gameOver && <img src={winner}></img>}
      {gameStart === true && gameOver === false ? (
        <div className="card">
          {guessed === true ? (
            <>
              <YoutubeEmbed
                embedId={currentSample.youtubeId}
                startTime={currentSample.startTime}
              />
              <button className="guessNextButton" onClick={handleNext}>Next</button>
            </>
          ) : (
            <>
              <YoutubeEmbed
                embedId={currentOriginal.youtubeId}
                startTime={currentOriginal.startTime}
              />
              <AutoComplete onSubmit={(guess) => handleSubmit(guess)} />
            </>
          )}
        </div>
      ) : (
        <div className="card">
          <button autoFocus={true} onClick={() => setGameStart(true)}>Start</button>
        </div>
      )}
    </div>
  );
};

export default App;
