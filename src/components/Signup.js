import React, { useState }  from 'react'
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import {db} from "./firebase";
import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
  } from "firebase/firestore";

function Signup() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [flag, setFlag] = useState(null); 
    const { signUp } = useUserAuth();
    let navigate = useNavigate();

    const userCollection = collection(db, "Users");
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
          await signUp(email, password);
          setFlag("true");
          navigate("/");
          const user = {
            name,
            email,
            password,
          };
          addDoc(userCollection, user);
          console.log(user);
        
        } catch (err) {
          setError(err.message);
        }
      };

    
        
    

    const addUser = (user) => {
        return addDoc(userCollection, user);
      }
  return (
    <div className="login">
        <h1>Gr_O_ffice</h1>
      <form className='Signup_form' onSubmit={handleSubmit}>
        <h3>Sign In</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="mb-3">
          <label>Name</label>
          <input
            type="name"
            className="form-control"
            placeholder="Enter your full name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
        
        <div className="d-grid">
          <button type="submit" onClick={addUser} className="shadow-none btn btn-default">
            Submit
          </button>
        </div>
        </form>
        <div className="p-4 box mt-3 text-center">
        Already have an account? <Link to="/">Log In</Link>
      </div>
    </div>
  )
}

export default Signup