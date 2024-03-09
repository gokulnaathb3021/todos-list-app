import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import styles from "../todos/todos.module.css";

const Header = () => {
  return (
    <div className={styles.header}>
      <h1>To-Dos List</h1>
      <button onClick={() => signOut(auth)}>Signout</button>
    </div>
  );
};

export default Header;
