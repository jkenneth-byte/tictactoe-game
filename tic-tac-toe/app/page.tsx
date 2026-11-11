"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";

type Player = "X" | "O" | null;

const calculateWinner = (squares: Player[]) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
};

export default function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [scores, setScores] = useState({ X: 0, O: 0, Draws: 0 });

  const winData = calculateWinner(board);
  const winner = winData?.winner;
  const winningLine = winData?.line || [];
  const isDraw = !winner && !board.includes(null);

  const handleSquareClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    const currentPlayer = xIsNext ? "X" : "O";
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const newWinData = calculateWinner(newBoard);
    if (newWinData?.winner) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        // Match confetti colors to the new UI colors
        colors:
          newWinData.winner === "X"
            ? ["#60a5fa", "#3b82f6"]
            : ["#f87171", "#ef4444"],
      });
      setScores((prev) => ({
        ...prev,
        [newWinData.winner as string]:
          prev[newWinData.winner as keyof typeof prev] + 1,
      }));
    } else if (!newBoard.includes(null)) {
      setScores((prev) => ({ ...prev, Draws: prev.Draws + 1 }));
    }

    setXIsNext(!xIsNext);
  };

  const startNextGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  const resetMatch = () => {
    setBoard(Array(9).fill(null));
    setScores({ X: 0, O: 0, Draws: 0 });
    setXIsNext(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 font-sans text-white">
      <Card className="w-full max-w-md bg-neutral-900 border-neutral-800 shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="text-center pb-4 pt-8">
          <CardTitle className="text-xl font-light tracking-[0.2em] text-white">
            TIC TAC TOE
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8 px-6 pb-8">
          {/* Scoreboard - Logical Color Mapping */}
          <div className="flex justify-between items-center bg-neutral-950/50 p-4 rounded-xl border border-neutral-800/50">
            <div
              className={`flex flex-col items-center w-1/3 transition-opacity ${xIsNext && !winner && !isDraw ? "opacity-100" : "opacity-40"}`}
            >
              <span className="text-xs font-light tracking-wider text-blue-400 mb-1">
                PLAYER X
              </span>
              <span className="text-3xl font-light text-white">{scores.X}</span>
            </div>

            <div className="flex flex-col items-center w-1/3 border-x border-neutral-800/50">
              <span className="text-xs font-light tracking-wider text-white/60 mb-1">
                DRAWS
              </span>
              <span className="text-3xl font-light text-white">
                {scores.Draws}
              </span>
            </div>

            <div
              className={`flex flex-col items-center w-1/3 transition-opacity ${!xIsNext && !winner && !isDraw ? "opacity-100" : "opacity-40"}`}
            >
              <span className="text-xs font-light tracking-wider text-red-400 mb-1">
                PLAYER O
              </span>
              <span className="text-3xl font-light text-white">{scores.O}</span>
            </div>
          </div>

          {/* Game Board */}
          <div className="grid grid-cols-3 gap-2 aspect-square">
            {board.map((square, i) => {
              const isWinningSquare = winningLine.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => handleSquareClick(i)}
                  disabled={!!square || !!winner}
                  className={`
                    relative flex items-center justify-center rounded-xl text-5xl transition-all duration-300
                    ${!square && !winner ? "bg-neutral-800/40 hover:bg-neutral-800 active:scale-[0.97] cursor-pointer" : "bg-neutral-900 cursor-default"}
                    ${isWinningSquare && square === "X" ? "bg-blue-950/30 border-blue-500/50 shadow-[0_0_20px_rgba(96,165,250,0.15)]" : ""}
                    ${isWinningSquare && square === "O" ? "bg-red-950/30 border-red-500/50 shadow-[0_0_20px_rgba(248,113,113,0.15)]" : ""}
                    ${!isWinningSquare ? "border border-neutral-800" : ""}
                  `}
                >
                  <span
                    className={`
                    font-light transform transition-all duration-300
                    ${square ? "scale-100 opacity-100" : "scale-50 opacity-0"}
                    ${square === "X" ? "text-blue-400" : ""}
                    ${square === "O" ? "text-red-400" : ""}
                    ${isWinningSquare && square === "X" ? "drop-shadow-[0_0_12px_rgba(96,165,250,0.6)]" : ""}
                    ${isWinningSquare && square === "O" ? "drop-shadow-[0_0_12px_rgba(248,113,113,0.6)]" : ""}
                  `}
                  >
                    {square}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Status Message */}
          <div className="h-6 flex items-center justify-center text-sm font-light tracking-wide text-white/80">
            {winner ? (
              <span
                className={`animate-pulse ${winner === "X" ? "text-blue-400" : "text-red-400"}`}
              >
                PLAYER {winner} WINS
              </span>
            ) : isDraw ? (
              <span>MATCH DRAWN</span>
            ) : (
              <span>
                TURN:{" "}
                <span className={xIsNext ? "text-blue-400" : "text-red-400"}>
                  PLAYER {xIsNext ? "X" : "O"}
                </span>
              </span>
            )}
          </div>

          {/* Game Controls */}
          <div className="flex gap-4">
            <Button
              onClick={startNextGame}
              disabled={!winner && !isDraw}
              className="flex-1 bg-white text-black hover:bg-neutral-200 font-medium rounded-lg h-12 transition-all"
            >
              <Play className="w-4 h-4 mr-2" /> Next Game
            </Button>
            <Button
              onClick={resetMatch}
              variant="outline"
              className="flex-1 border-neutral-700 bg-transparent hover:bg-neutral-800 text-white font-medium rounded-lg h-12 transition-all"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
