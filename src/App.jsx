import { useEffect, useState } from "react";
import "./App.css";
import YoutubeEmbed from "./YoutubeEmbed";
import AutoComplete from "./Autocomplete";

import winner from "./assets/win.png";
import matches from "./assets/matches.json";

// Game states: 
// 0 = not started 
// 1 = started 
// 2 = ended

const App = () => {
  const [gameState, setGameState] = useState(0)
  const [round, setRound] = useState(0)
  const [currentRoundScore, setCurrentRoundScore] = useState(0)

  const handleGameStateChange = (newState) => {
    setGameState(newState)
  }

  const handleRoundChange = () => {
    const newRound = round + 1
    if (newRound >= 5) {
      console.log("game end")
    } else {
      setRound(newRound)
    }  
  }

  const handleGiveUp = () => {
    setCurrentRoundScore(0)
    setRound(round+1)
  }

  useEffect(() => {
    
  }, [round])

  return (
    <div className="main">
      <h1>{gameState}</h1>
      <h1>sampdle</h1>
      <h3>{new Date().toLocaleDateString('fi-FI')}</h3>
      {gameState == 0 &&
      <>
        <button onClick={() => handleGameStateChange(1)}>Go</button>
      </>
      }
      {gameState == 1 &&
        <>
          <button onClick={() => handleGiveUp()}>give up</button>
          <h2></h2>
          <button onClick={() => handleGameStateChange(2)}>stop game</button>
        </>
      }
      {gameState == 2 &&
      <>
        <h1>Youre winner</h1>
      </>
      }
    </div>
  );
};

export default App;
