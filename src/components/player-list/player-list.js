import './player-list.css';
import Player from '../player/player';

export default function PlayerList(props) {
  const onAttack = (effectedPlayerId) => {
    props.attack(effectedPlayerId);
  }

  const onHeal = (effectedPlayerId) => {
    props.heal(effectedPlayerId);
  }

  return (
    <div>
        <h1>Players:</h1>
        {props.players.map((x,i) => <div key={i} className="player-list-player"><Player attack={onAttack} heal={onHeal} player={x}></Player></div> )}
    </div>
  );
};