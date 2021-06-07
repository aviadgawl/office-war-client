import './player.css';

export default function Player(props) {

  const onAttack = () => {
    props.attack(props.player.id);
  }

  const onHeal = () => {
    props.heal(props.player.id);
  }

  return (
    <div>
      <div className="card">
        <img src={props.player.img} className="card-img-top player-img" alt="players img" />
        <div className="card-body">
          <h5 className="card-title">{props.player.name} {props.player.hp === 0 && '(DEAD)'}</h5>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Mana: {props.player.mana}</li>
          <li className="list-group-item">Attack: {props.player.attack}</li>
          <li className="list-group-item">HP: {props.player.hp}</li>
        </ul>
        <div className="card-body">
            <button className="btn btn-outline-danger" disabled={props.player.hp <= 0} onClick={onAttack}>Attack</button>
            <button className="btn btn-outline-success" disabled={props.player.hp <= 0} onClick={onHeal}>Heal</button>
        </div>
      </div>
    </div>
  );
};