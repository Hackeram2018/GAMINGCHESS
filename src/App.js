import React, { useState, useEffect } from 'react';
import Chessboard from 'chessboardjsx';
import { Chess } from 'chess.js';
import { collection, addDoc } from "firebase/firestore";



export default function App() {
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [game, setGame] = useState(new Chess());
  const [gameOver, setGameOver] = useState();

  useEffect(() => {
    if(game.in_check() && !(game.game_over())) {
      alert("Tu has quedado en jaque")
      }
    if(game.in_checkmate()) {
      setGameOver({
        info1: "Jaque mate - ",
        info2: '${game.turno() == "w" ? "blanca" : "negra"} pierde'
      })
    }
    if(game.in_draw()) {
      setGameOver({
        info1: "Tablas - ",
        info2:'tie'
      } )
    }  
    if(game.in_stalemate()) {
      setGameOver({
        info1: "Stalemate - ",
        info2:'tie'
      } )
    } 
    if(game.insufficient_material()) {
      setGameOver({
        info1: "Material insuficiente - ",
        info2:'tie'
      } )
    } 
    if(game.in_threefold_repetition()) {
      setGameOver({
        info1: "Tablas por triple repetición - ",
        info2:'tie'
      } )
    } 
  }, [fen])

  function dropPiece ({sourceSquare, targetSquare, piece})  {
    const promotions = game.moves({ verbose: true}).filter((m) => m.promotion);
    let promotionTo = undefined;
    if(promotions.some((p) => '${p.from}:${p.to}' == '${sourceSquare}:${targetSquare}')) {
      promotionTo = prompt("Promociona tu peon en: r (torre), b (alfil), q (reina), or n (caballo).");
      if(!(promotionTo == "r" || promotionTo == "b" || promotionTo == "q" || promotionTo == "n")) {
        alert("Si tu no pones una valida posición de promoción, tu peon sera automaticámente promocionado en reina.");
        promotionTo = "q";
      }
    }
    let validMove = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: promotionTo,
    });
    if(validMove) {
      setFen(game.fen())
    }
    console.log(sourceSquare, targetSquare, piece);
  }
  
  return (
    <div>
      {gameOver ? <p>{gameOver.info1} {gameOver.info2}</p> : <></>}
      <Chessboard position={fen} onDrop={dropPiece}/>
    </div>
  )
}

