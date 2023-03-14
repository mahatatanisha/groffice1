import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../components/firebase";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState("");
  const [userid, setUserid] = useState("");
  const [mainRoomId, setMainRoomId] = useState("");
  const [mainRoomName, setMainRoomName] = useState("");
  const [mainRoomParticipants, setMainRoomParticipants] = useState("");
  const [userMainRoomDocId, setUserMainRoomDocId] = useState(null);
  const [subRoomName, setSubRoomName] = useState("");
  const [subRoomId, setSubRoomId] = useState(null);
  const [callFrom, setCallFrom] = useState(null);


  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function logOut() {
    return signOut(auth);
  }
  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      console.log("Auth", currentuser);
      //setUser(currentuser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider
      value={{
        callFrom, setCallFrom,
        subRoomId,
        setSubRoomId,
        subRoomName,
        setSubRoomName,
        userMainRoomDocId,
        setUserMainRoomDocId,
        mainRoomParticipants,
        setMainRoomParticipants,
        mainRoomName, 
        setMainRoomName,
        mainRoomId, 
        setMainRoomId, 
        userid, 
        setUserid, 
        user, 
        setUser, 
        logIn, 
        signUp, 
        logOut, 
        googleSignIn }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}