import React from 'react';
import './my-player.css';

export default function MyPlayer(props) {
    const [hpClassName, setHPClassName] = React.useState('list-group-item');
    const hpRef = React.useRef(props.player.hp)

    React.useEffect(() => {
        if (props.player.hp > hpRef.current) setHPClassName('list-group-item my-player-hp-plus');
        else if (props.player.hp < hpRef.current) setHPClassName('list-group-item my-player-hp-minus');

        hpRef.current = props.player.hp;
    }, [props.player.hp]);

    React.useEffect(() => {
        const timeout = setTimeout(() => setHPClassName('list-group-item'), 1000);

        return () => clearTimeout(timeout);
    }, [hpClassName]);

    const onJoinGame = () => {
        props.joinGame();
    }

    return (
        <div>
            <div className="card">
                <div className="row g-0">
                    <div className="col-md-4">
                        <img className="img-fluid my-player-img" alt="player img" src={props.player.img}></img>
                    </div>

                    <div className="col-md-8">
                        <div className="card-body">
                            <div className="card-header">
                                <b>ID:</b> {props.player.id}
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item"><b>Name:</b> {props.player.name}</li>
                                <li className="list-group-item"><b>Mana:</b> {props.player.mana} <b>Cooldown:</b> {props.manaTimer}</li>
                                <li className="list-group-item"><b>Attack:</b> {props.player.attack}</li>
                                <li className={hpClassName}><b>HP:</b> {props.player.hp}</li>
                            </ul>
                            {!props.joined && <button className="btn btn-dark" onClick={onJoinGame}>Join Game</button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}