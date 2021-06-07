import './login.css';

export default function Login(props) {

  let player = { name: '', img: '', mana: 2, hp: 6, attack: 1 };

  let onLogin = () => {
    props.login(player);
  }

  let onNameChange = (event) => {
    player.name = event.target.value;
  }

  let onImgChange = (event) => {
    player.img = event.target.value;
  }

  return (
    <div className="container">
      <div className="row login-row">
        <div className="col">
          <div className="input-group input-group-lg">
            <span className="input-group-text">Name:</span>
            <input type="text" placeholder="Username" onChange={onNameChange}></input>
          </div>
        </div>
      </div>
      <div className="row login-row">
        <div className="col">
          <div className="input-group input-group-lg">
            <span className="input-group-text">Img:</span>
            <input type="text" placeholder="http://google.com/img" onChange={onImgChange}></input>
          </div>
        </div>
      </div>
      <div className="row login-row">
        <div className="col">
          <button className="btn btn-lg btn-dark" onClick={onLogin}>Login</button>
        </div>
      </div>
    </div>
  );
};