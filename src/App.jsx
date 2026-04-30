import { useEffect, useState, useRef } from "react";
import "./App.css";
import YoutubeEmbed from "./YoutubeEmbed";
import AutoComplete from "./Autocomplete";

import winnerImage from "./assets/win.png";
import loserImage from "./assets/cat.png";
import matchesData from "./assets/matches.json";

const App = () => {
  const [gameState, setGameState] = useState(0);
  const [round, setRound] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [dailyRounds, setDailyRounds] = useState([]);
  const [currentRoundData, setCurrentRoundData] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [lastPoints, setLastPoints] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [userGuesses, setUserGuesses] = useState([]);
  const [livePoints, setLivePoints] = useState(1000);

  const startTimeRef = useRef(null);
  const nextButtonRef = useRef(null);

  useEffect(() => {
    const todayStr = new Date().toLocaleDateString('fi-FI');
    const todayData = matchesData.find(m => m.date === todayStr);
    console.log(matchesData)
    console.log(todayStr)
    console.log(todayData)
    setDailyRounds(todayData ? todayData.rounds : matchesData?.[0]?.rounds || []);
  }, []);

  // NEW SCORE LOGIC:
  // 0-5s: 1000 points (Grace period)
  // 5s+: -10 points per second
  useEffect(() => {
    let interval;
    if (gameState === 1 && !showResult) {
      interval = setInterval(() => {
        const timeInSeconds = (performance.now() - startTimeRef.current) / 1000;
        let calculatedPoints;

        if (timeInSeconds <= 5) {
          calculatedPoints = 1000;
        } else {
          // Every 1.0s after grace period is -10 points
          const penalty = (timeInSeconds - 5) * 10;
          calculatedPoints = 1000 - penalty;
        }

        setLivePoints(Math.max(0, Math.floor(calculatedPoints)));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [gameState, showResult, round]);

  useEffect(() => {
    if (gameState === 1 && dailyRounds.length > 0) {
      setCurrentRoundData(dailyRounds[round]);
      setShowResult(false);
      setLivePoints(1000);
      startTimeRef.current = performance.now();
    }
  }, [gameState, round, dailyRounds]);

  useEffect(() => {
    if (showResult && nextButtonRef.current) {
      const timer = setTimeout(() => {
        nextButtonRef.current.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [showResult]);

  const handleSubmit = (guess) => {
    if (showResult || !currentRoundData) return;

    const cleanToWords = (str) => {
      if (!str) return [];
      return str.toLowerCase()
        .replace(/\bpt\b/g, "part")
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(word => word.length > 1);
    };

    const userClean = guess.toLowerCase().replace(/[^a-z0-9]/g, "");
    const artistWords = cleanToWords(currentRoundData.sample.artist);
    const titleWords = cleanToWords(currentRoundData.sample.title);

    const artistMatchCount = artistWords.filter(word => userClean.includes(word)).length;
    const titleMatchCount = titleWords.filter(word => userClean.includes(word)).length;

    const artistOk = artistMatchCount >= Math.min(2, artistWords.length);
    const titleOk = titleMatchCount >= Math.min(2, titleWords.length);

    const match = artistOk && titleOk;
    const points = match ? livePoints : 0;

    setUserGuesses(prev => [...prev, {
      original: `${currentRoundData.original.artist} - ${currentRoundData.original.title}`,
      sample: `${currentRoundData.sample.artist} - ${currentRoundData.sample.title}`,
      guess: guess || "Skipped",
      points: points
    }]);

    setLastPoints(points);
    setIsCorrect(match);
    setTotalScore(prev => prev + points);
    setShowResult(true);
  };

  const nextRound = () => {
    const next = round + 1;
    if (next >= dailyRounds.length) setGameState(2);
    else setRound(next);
  };

  return (
    <div className="main">
      <h1>sampdle</h1>
      <h3>{new Date().toLocaleDateString('fi-FI')}</h3>

      {gameState === 0 && (
        <div className="start-screen">
          <p>Identify the artist and the title of the song that used the sample!</p>
          <button onClick={() => setGameState(1)}>Start Game</button>
        </div>
      )}

      {gameState === 1 && currentRoundData && (
        <div className="game-screen">
          <div className="game-header">
            <h2>Round {round + 1} / {dailyRounds.length}</h2>
            {!showResult &&
              <div className={`live-points ${livePoints === 1000 ? 'perfect' : livePoints > 800 ? 'dropping' : 'critical'}`}>
                Points: {livePoints}
              </div>
            }
          </div>

          {!showResult ? (
            <div className="guess-area">
              <h3>Original Source:</h3>
              <YoutubeEmbed embedId={currentRoundData.original.youtubeId} startTime={currentRoundData.original.startTime} />
              <AutoComplete onSubmit={handleSubmit} />
            </div>
          ) : (
            <div className="result-area">
              <h2 className={isCorrect ? "text-success" : "text-danger"}>
                {isCorrect ? `Correct! +${lastPoints} pts` : "Incorrect! 0 pts"}
              </h2>
              <p>Answer: <strong>{currentRoundData.sample.artist} - {currentRoundData.sample.title}</strong></p>
              <YoutubeEmbed embedId={currentRoundData.sample.youtubeId} startTime={currentRoundData.sample.startTime} />
              <button ref={nextButtonRef} onClick={nextRound} className="next-btn">Next Round</button>
            </div>
          )}
        </div>
      )}

      {gameState === 2 && (
        <div className="end-screen">
          <img src={totalScore >= 4000 ? winnerImage : loserImage} alt="Result" className="end-img" />
          <h1>{totalScore < 4000 && "PASKA PELI"}</h1>
          <p className="final-score">Total Score: {totalScore} / 5000</p>
          <div className="summary-table">
            <table>
              <thead><tr><th>Original</th><th>Sample</th><th>Your Guess</th><th>Pts</th></tr></thead>
              <tbody>
                {userGuesses.map((g, i) => (
                  <tr key={i}>
                    <td>{g.original}</td><td>{g.sample}</td>
                    <td className={g.points > 0 ? "text-success" : "text-danger"}>{g.guess}</td>
                    <td>{g.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={() => window.location.reload()} className="next-btn">Try Again</button>
        </div>
      )}
    </div>
  );
};

export default App;
