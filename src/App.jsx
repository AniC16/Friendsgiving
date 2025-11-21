import { useMemo, useState } from "react";
import { categories } from "./gameData";


function QuestionModal({ activeClue, onClose }) {
  const [showAnswer, setShowAnswer] = useState(false);

  if (!activeClue) return null;
  const { category, clue } = activeClue;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title">
            {category.name} – ${clue.value}
          </div>
          <button className="modal-close" onClick={() => onClose(clue)}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {clue.image && (
            <div className="modal-image-wrapper">
              <img src={clue.image} alt="Who is this?" />
            </div>
          )}

          <div className="modal-label">Question</div>
          <div className="modal-question">{clue.question}</div>

          <div className="modal-answer-section">
            <div className="modal-answer-header">
              <span>Answer</span>
              <button
                className="ghost-btn"
                onClick={() => setShowAnswer((prev) => !prev)}
              >
                {showAnswer ? "Hide Answer" : "Show Answer"}
              </button>
            </div>
            <div className={`modal-answer ${showAnswer ? "visible" : ""}`}>
              {showAnswer ? clue.answer || "You know this one 😈" : ""}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="primary-btn" onClick={() => onClose(clue)}>
            Mark as Used
          </button>
        </div>
      </div>
    </div>
  );
}

function GameBoard({ usedIds, onTileClick }) {
  const maxRows = useMemo(
    () => Math.max(...categories.map((c) => c.clues.length)),
    []
  );

  return (
    <div className="board-container">
      <div className="board-grid">
        {categories.map((cat) => (
          <div key={cat.id} className="category-header">
            {cat.name}
          </div>
        ))}

        {Array.from({ length: maxRows }).map((_, rowIdx) =>
          categories.map((cat) => {
            const clue = cat.clues[rowIdx];
            if (!clue) {
              return <div key={`${cat.id}-row-${rowIdx}`} />;
            }

            const used = usedIds.has(clue.id);
            return (
              <button
                key={clue.id}
                className={`clue-tile ${used ? "used" : ""}`}
                onClick={() => !used && onTileClick(cat, clue)}
                disabled={used}
              >
                {!used ? `$${clue.value}` : "✓"}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [players, setPlayers] = useState([
    { name: "Player 1", score: 0 },
    { name: "Player 2", score: 0 },
  ]);
  const [usedIds, setUsedIds] = useState(new Set());
  const [activeClue, setActiveClue] = useState(null);

  const handleChangeScore = (index, delta, newName, isNameChange = false) => {
    setPlayers((prev) =>
      prev.map((p, i) => {
        if (i !== index) return p;
        if (isNameChange) {
          return { ...p, name: newName };
          }
        return { ...p, score: p.score + delta };
      })
    );
  };

  const handleCloseModal = (clue) => {
    setUsedIds((prev) => {
      const next = new Set(prev);
      next.add(clue.id);
      return next;
    });
    setActiveClue(null);
  };

  if (!started) {
    return (
      <div className="landing">
        <div className="landing-bg" />
        <div className="landing-overlay" />
        <div className="landing-content">
          <h1>Friendsgiving Jeopardy</h1>
          <p>
            A chaotic recap of road trips, Edge lore, quotes, and blurry photos.
          </p>
          <button className="primary-btn big" onClick={() => setStarted(true)}>
            Enter the Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-root">
      <div className="app-bg" />
      <header className="app-header">
        <h1>Friendsgiving Jeopardy 2025</h1>
        <p>Click a tile, read the question, then decide who gets the points.</p>
      </header>

      


      <GameBoard
        usedIds={usedIds}
        onTileClick={(category, clue) => setActiveClue({ category, clue })}
      />

      <QuestionModal activeClue={activeClue} onClose={handleCloseModal} />
    </div>
  );
}
