import React, { useState, createContext, useContext } from 'react'
import '../cssfiles/login.css'
import GoogleIcon from '@mui/icons-material/Google';
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { Alert } from "react-bootstrap";
import { db } from "./firebase";
import {

  collection,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";

export const userDetails = createContext();
function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn, googleSignIn, setUser, setUserid } = useUserAuth();
  const navigate = useNavigate();

  const usersCollectionRef = collection(db, "Users");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await logIn(email, password);
      const q = query(usersCollectionRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        setUser(doc.data().name);
        setUserid(doc.id);
      });

      
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/main-chat");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="login">
      <h1>Gr_O_ffice</h1>
      <form className='Signup_form' onSubmit={handleSubmit}>
        <h3>Log In</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id="customCheck1"
            />
            <label className="custom-control-label" htmlFor="customCheck1">
              Remember me
            </label>
          </div>
        </div>
        <div className="d-grid">
          <button type="submit" className="shadow-none btn btn-default">
            Submit
          </button>
        </div>
        <div className="google-signin">
          <div className="google">
            <a onClick={handleGoogleSignIn} href=""><GoogleIcon fontSize='large' /></a>

          </div>
          <h6>Sign-in with google</h6>
        </div>

        <p className="forgot-password text-right">
          Forgot <a href="#">password?</a>
        </p>
      </form>
      <div className="p-4 box mt-3 text-center">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </div>
    </div>




  )
}

export default Login
// export function useUserDetails() {
//   return useContext(userDetails);
// }