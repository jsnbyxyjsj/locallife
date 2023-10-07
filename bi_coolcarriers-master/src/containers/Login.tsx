import { useState } from "react";
import { useAppContext } from "../libs/contextLib";
import { Auth } from "aws-amplify";

// === Images ===
import isoLogo from "../assets/images/iso_logo.svg";
import userIcon from "../assets/images/userIcon.svg";
import lockIcon from "../assets/images/lockIcon.svg";
import eyeIcon from "../assets/images/eyeIcon.png";

// === Components ===
import { ColorRing } from "react-loader-spinner";

function Login() {
  const { setIsAuthenticated } = useAppContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await Auth.signIn(username, password);
      setIsAuthenticated(true);
    } catch (e: any) {
      console.log(e);
      if (e.message) {
        e = e.message
      }
      setLoading(false);
      alert(e);
    }
  };

  const isEmailValid = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  return (
    <div className="Login">
      <div className="Login__logo">
        <img src={isoLogo}></img>
        <h1>COOLDATA - © 2023 </h1>
        <span>Statistics system with data information provided</span>
      </div>
      <div className="Login__background-image"></div>
      <div className="Login__card">
        <h1 className="Login__card-title">Login</h1>
        <div className="Login__card-input-container">
          <img src={userIcon} className="Login__card-input-img-left"></img>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Email"
          />
        </div>
        <div className="Login__card-input-container">
          <img src={lockIcon} className="Login__card-input-img-left"></img>
          <input
            type={!showPassword ? "password" : "text"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <img
            src={eyeIcon}
            className="Login__card-input-img-right"
            onClick={() => setShowPassword(!showPassword)}
          ></img>
        </div>
        {loading ? (
          <ColorRing
            visible={true}
            height="60"
            width="60"
            ariaLabel="blocks-loading"
            wrapperStyle={{ marginTop: "30px" }}
            wrapperClass="blocks-wrapper"
            colors={["#1D8CEA", "#3154A1", "#80CAEE", "#1D8CEA", "#1D8CEA"]}
          />
        ) : (
          <button
            onClick={handleLogin}
            disabled={!isEmailValid(username) || !password}
          >
            Sign in
          </button>
        )}
      </div>
    </div>
  );
}

export default Login;
