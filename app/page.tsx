"use client";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "./context/authContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const [areCredsInvalid, setAreCredsInvalid] = useState<boolean>(false);
  const [loggingIn, setLoggingIn] = useState<boolean>(false);
  const user = useContext(AuthContext);
  if (user?.email) redirect("/todos");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  function handleSubmit() {
    setLoggingIn((prevState) => !prevState);
    setAreCredsInvalid(false);
    const email = emailRef.current!.value;
    const password = passwordRef.current!.value;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        if (areCredsInvalid) setAreCredsInvalid(false);
        setLoggingIn((prevState) => !prevState);
      })
      .catch((e) => {
        setAreCredsInvalid(true);
        setLoggingIn((prevState) => !prevState);
      });
  }
  return (
    <div className={styles.signinPage}>
      <div>
        <h1>To-Dos List App, Stay On The Track</h1>
        <div className={styles.form}>
          <h2>Login</h2>
          <input type="email" ref={emailRef} placeholder="email"></input>
          <input
            type="password"
            ref={passwordRef}
            placeholder="password"
          ></input>
          <button onClick={handleSubmit}>Login</button>
          {loggingIn && <p>Logging you in...</p>}
          {areCredsInvalid && <p>Invalid credentials!</p>}
          <p>
            Don't have an account? <a href="/signup">Signup</a>
          </p>
        </div>
      </div>
    </div>
  );
}
