import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

import React from 'react';
import Login from './components/login/login';
import MyPlayer from './components/my-player/my-player';
import PlayerList from './components/player-list/player-list';
import { HubConnectionBuilder } from '@microsoft/signalr';

function App() {

  const [myPlayerState, setMyPlayerState] = React.useState(null);
  const [connection, setConnection] = React.useState(null);
  const [playerJoined, setPlayerJoined] = React.useState(false);
  const [players, setPlayers] = React.useState([]);
  const [manaTimerCount, setManaTimerCount] = React.useState(0);
  const otherPlayers = React.useMemo(() => (players || []).filter(player => player.id !== myPlayerState.id), [players, myPlayerState]);

  const myPlayerStateRef = React.useRef();
  const connectionRef = React.useRef();

  React.useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl('http://aviads10-pc:5000/gameHub')
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    window.addEventListener('beforeunload', function (e) {
      newConnection.stop();
    }, false);

    // return () => { newConnection.stop(); };
  }, []);

  React.useEffect(() => {
    myPlayerStateRef.current = myPlayerState;
    connectionRef.current = connection;

    if (myPlayerState !== null && myPlayerState.hp === 0) connection.stop();
  }, [myPlayerState, connection]);

  React.useEffect(() => {
    if (myPlayerState?.mana !== 0 || !myPlayerState?.id) return;

    setManaTimerCount(15);
    const manaInterval = setInterval(() => {
      setManaTimerCount(count => {
        if (count > 0) return count - 1;
        else {
          connectionRef.current.invoke('RefreshMessage', myPlayerState.id, '');
          clearInterval(manaInterval);
          return count;
        };
      });
    }, 1000);

    return () => clearInterval(manaInterval);
  }, [myPlayerState?.mana, myPlayerState?.id]);

  const onLogin = (myPlayer) => {

    connection.start().then(result => {
      console.log('Connected!')

      connection.on('ReceiveConnID', connId => {
        myPlayer.id = connId;
        setMyPlayerState(myPlayer);
      });

      connection.on('ConnectionLost', serverPlayers => {
        updatePlayers(serverPlayers);
      });

      connection.on('JoinGameMessage', serverPlayers => {
        updatePlayers(serverPlayers, true);
      });

      connection.on('AttackMessage', serverPlayers => {
        updatePlayers(serverPlayers);
      });

      connection.on('HealMessage', serverPlayers => {
        updatePlayers(serverPlayers);
      });

      connection.on('RefreshMessage', serverPlayers => {
        updatePlayers(serverPlayers);
      });

    }).catch(function (err) {
      console.log(err.toString());
    });
  }

  const onJoinGame = async () => {

    if (connection.connectionStarted) {
      try {
        await connection.invoke('JoinGameMessage', myPlayerState.id, JSON.stringify(myPlayerState));
      }
      catch (e) {
        console.log(e);
      }
    }
    else {
      alert('No connection to server yet.');
    }
  }

  const onAttack = (effectedPlayerId) => {
    let isValid = beforeActionValidation();
    if (isValid) {

      const actionMessage = {
        reciverId: effectedPlayerId,
        giverId: myPlayerState.id
      }

      connection.invoke('AttackMessage', myPlayerState.id, JSON.stringify(actionMessage));
    }
  }

  const onHeal = (effectedPlayerId) => {
    let isValid = beforeActionValidation();
    if (isValid) {

      const actionMessage = {
        reciverId: effectedPlayerId,
        giverId: myPlayerState.id
      }

      connection.invoke('HealMessage', effectedPlayerId, JSON.stringify(actionMessage));
    }
  }

  const beforeActionValidation = () => {
    if (myPlayerState.mana === null) {
      alert('must be logged in.');
      return false;
    }

    if (myPlayerState.mana <= 0) {
      alert('insufficient mana.');
      return false;
    }

    return true;
  }

  const updatePlayers = (serverPlayers, markJoin) => {
    const players = JSON.parse(serverPlayers);

    setMyPlayerState(previousPlayerState => {
      const myPlayerUpdated = players.filter(x => x.id === previousPlayerState.id)[0];
      if (myPlayerUpdated !== undefined) {

        if (markJoin) setPlayerJoined(true);
        return myPlayerUpdated;
      } else {
        return previousPlayerState;
      }
    });

    setPlayers(players);
  }

  return (
    <div className="app-container">
      <div className="container">
        <div className="row justify-content-md-center">
          <div className="col-md-auto">
            {myPlayerState === null && <Login login={onLogin}></Login>}
            {(myPlayerState !== null && myPlayerState.hp > 0) && <MyPlayer joined={playerJoined} joinGame={onJoinGame} manaTimer={manaTimerCount} player={myPlayerState}></MyPlayer>}
          </div>
        </div>
        <div className="row justify-content-md-center">
          <div className="col">
            {otherPlayers.length > 0 && myPlayerState.hp > 0 && <PlayerList attack={onAttack} heal={onHeal} players={otherPlayers}></PlayerList>}
          </div>
        </div>
        <div className="row justify-content-md-center">
          <div className="col-md-auto">
            {(myPlayerState !== null && myPlayerState.hp === 0) && <h1>Game Over</h1>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
