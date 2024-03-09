"use client";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../context/authContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { redirect } from "next/navigation";
import styles from "../page.module.css";

const Signup: React.FC = () => {
  const [areCredsInvalid, setAreCredsInvalid] = useState<boolean>(false);
  const [signingUp, setSigningUp] = useState<boolean>(false);
  const [invalidMessage, setInvalidMessage] = useState<string>("");
  const user = useContext(AuthContext);
  if (user?.email) redirect("/todos");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  function handleSubmit() {
    setSigningUp((prevState) => !prevState);
    setAreCredsInvalid(false);
    const email = emailRef.current!.value;
    const password = passwordRef.current!.value;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        if (areCredsInvalid) setAreCredsInvalid(false);
        setSigningUp((prevState) => !prevState);
        console.log(userCred);
      })
      .catch((e) => {
        console.log(e);
        setAreCredsInvalid(true);
        if (password.length >= 6)
          setInvalidMessage("This email is already registered!");
        else setInvalidMessage("Password should be atleast 6 characters long!");
        setSigningUp((prevState) => !prevState);
      });
  }
  return (
    <div className={styles.signinPage}>
      <div>
        <h1>To-Dos List App, Stay On The Track</h1>
        <div className={styles.form}>
          <h2>Signup</h2>
          <input type="email" ref={emailRef} placeholder="email"></input>
          <input
            type="password"
            ref={passwordRef}
            placeholder="password"
          ></input>
          <button onClick={handleSubmit}>Signup</button>
          {signingUp && <p>Signing you up...</p>}
          {areCredsInvalid && <p>{invalidMessage}</p>}
          <p>
            Have an account? <a href="/">Sigin</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
