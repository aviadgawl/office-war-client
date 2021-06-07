import './login.css';

export default function Login(props) {
  let username = '';
  let image = '';

  let onLogin = () => {
    props.login(username , image);
  }

  let onNameChange = (event) => {
    username = event.target.value;
  }

  let onImgChange = (event) => {
    image = event.target.value;
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