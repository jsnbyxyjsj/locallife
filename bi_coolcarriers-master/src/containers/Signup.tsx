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

function Signup() {
  const { setIsAuthenticated } = useAppContext();
  const [userEmail, setUserEmail] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isConfirmationCodeRequired, setIsConfirmationCodeRequired] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isEmailValid = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSignup = async () => {
    let username = userEmail;
    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          email: userEmail,
        },
      });
      setIsConfirmationCodeRequired(true);
    } catch (e: any) {
      console.log(e);
      if (e.message) {
        e = e.message;
      }
      alert(e);
    }
  };

  const handleConfirmation = async () => {
    try {
      setLoading(true);
      await Auth.confirmSignUp(userEmail, verificationCode);
      const user = await Auth.signIn(userEmail, password);
      console.log("Login successful", user);
      setIsAuthenticated(true);
    } catch (e: any) {
      console.log(e);
      if (e.message) {
        e = e.message;
      }
      setLoading(false);
      alert(e);
    }
  };

  return (
    <div className="Signup">
      <div className="Signup__logo">
        <img src={isoLogo}></img>
        <h1>COOLDATA - © 2023 </h1>
        <span>Statistics system with data information provided</span>
      </div>
      <div className="Signup__background-image"></div>
      <div className="Signup__card">
        <h1 className="Signup__card-title">Register</h1>
        {!isConfirmationCodeRequired ? (
          <div>
            <div className="Signup__card-input-container">
              <img src={userIcon} className="Signup__card-input-img-left"></img>
              <input
                type="text"
                value={userFullName}
                onChange={(e) => setUserFullName(e.target.value)}
                placeholder="Full name"
                autoComplete="off"
              />
            </div>
            <div className="Signup__card-input-container">
              <img src={userIcon} className="Signup__card-input-img-left"></img>
              <input
                type="text"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Email"
                autoComplete="off"
              />
            </div>
            <div className="Signup__card-input-container">
              <img src={lockIcon} className="Signup__card-input-img-left"></img>
              <input
                type={!showPassword ? "password" : "text"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="off"
              />
              <img
                src={eyeIcon}
                className="Signup__card-input-img-right"
                onClick={() => setShowPassword(!showPassword)}
              ></img>
            </div>
            <div className="Signup__card-input-container">
              <img src={lockIcon} className="Signup__card-input-img-left"></img>
              <input
                type={!showPassword ? "password" : "text"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                autoComplete="off"
              />
              <img
                src={eyeIcon}
                className="Signup__card-input-img-right"
                onClick={() => setShowPassword(!showPassword)}
              ></img>
            </div>
            <button
              onClick={handleSignup}
              disabled={
                !isEmailValid(userEmail) ||
                !password ||
                password !== confirmPassword
              }
            >
              Sign up
            </button>
          </div>
        ) : (
          <div>
            <span>Verification code:</span>
            <div className="Signup__card-input-code">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="* * * * * *"
                autoComplete="off"
              />
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
                onClick={handleConfirmation}
                disabled={verificationCode.length < 6}
              >
                Confirm
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // return (
  //   <div className="Signup">
  //     <Row className="justify-content-center">
  //       <div className="Signup__card">
  //         <Row className="justify-content-center">
  //           <img src={isoLogo}></img>
  //         </Row>
  //         <h1 className="Signup__card-title">Sign Up</h1>
  //         {!isConfirmationCodeRequired ? (
  //           <>
  //             <div className="signup-input">
  //               <label>Username:</label>
  //               <input
  //                 type="text"
  //                 value={username}
  //                 onChange={(e) => setUsername(e.target.value)}
  //               />
  //             </div>
  //             <div className="signup-input">
  //               <label>Password:</label>
  //               <input
  //                 type="password"
  //                 value={password}
  //                 onChange={(e) => setPassword(e.target.value)}
  //               />
  //             </div>
  //             <div className="signup-input">
  //               <label>Confirm password:</label>
  //               <input
  //                 type="password"
  //                 value={confirmPassword}
  //                 onChange={(e) => setConfirmPassword(e.target.value)}
  //               />
  //             </div>
  //             <Row className="justify-content-center">
  //               <Col className="text-align-center">
  //                 <Button
  //                   className="signup-button"
  //                   onClick={handleSignup}
  //                   disabled={password !== confirmPassword || password === ""}
  //                 >
  //                   Sign Up
  //                 </Button>
  //               </Col>
  //             </Row>
  //             <Row
  //               className="justify-content-center"
  //               style={{ marginTop: "20px" }}
  //             >
  //               <Col className="text-align-center">
  //                 <a href="#" onClick={() => navigate("/login")}>
  //                   Go to Login
  //                 </a>
  //               </Col>
  //             </Row>
  //           </>
  //         ) : (
  //           <>
  //             <div className="signup-input">
  //               <label>Verification Code:</label>
  //               <input
  //                 type="text"
  //                 value={verificationCode}
  //                 onChange={(e) => setVerificationCode(e.target.value)}
  //               />
  //             </div>
  //             <Row className="justify-content-center">
  //               <Col xs={5} lg={5} className="text-align-center">
  //                 <Button
  //                   className="signup-button"
  //                   onClick={handleConfirmation}
  //                 >
  //                   Confirm
  //                 </Button>
  //               </Col>
  //             </Row>
  //           </>
  //         )}
  //       </div>
  //     </Row>
  //   </div>
  // );
}

export default Signup;
