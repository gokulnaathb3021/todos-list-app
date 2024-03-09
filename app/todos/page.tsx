"use client";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { redirect } from "next/navigation";
import styles from "./todos.module.css";
import { createToDo, fetchCertainToDos, fetchToDos } from "@/lib/actions";
import TodosList from "../components/Todos";
import { CiCirclePlus } from "react-icons/ci";
import { FcSearch } from "react-icons/fc";
import { RxCrossCircled } from "react-icons/rx";
import Header from "../components/Header";

type X = {
  id: string;
  todo: string;
  email: string;
  date: Date;
};

const Todos: React.FC = () => {
  const user = useContext(AuthContext);
  if (!user) redirect("/");

  const [todos, setTodos] = useState<X[]>([]);
  const [num, setNum] = useState<number>(1);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  function refreshPage() {
    setNum((prevNum) => prevNum + 1);
  }

  useEffect(() => {
    fetchToDos(user?.email as string)
      .then((data) => {
        setTodos(data.todos);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [num]);

  function handleCreate(formData: FormData) {
    const { todo } = Object.fromEntries(formData);
    if (!todo) return;
    createToDo(formData)
      .then(() => {
        fetchToDos(user?.email as string)
          .then((data) => {
            setTodos(data.todos);
          })
          .catch((error) => {
            throw new Error(error);
          });
      })
      .catch((error) => {
        throw new Error(error);
      });
    const todoInput = document.getElementById(
      "todoInput"
    ) as HTMLInputElement | null;
    if (todoInput !== null) {
      todoInput.value = "";
    }
  }

  function handleSearch() {
    const todoInput = document.getElementById(
      "todoInput"
    ) as HTMLInputElement | null;
    if (todoInput?.value) setIsSearching(true);
    fetchCertainToDos(todoInput?.value as string, user?.email as string)
      .then((data) => {
        setTodos(data);
      })
      .catch((e) => {
        throw new Error(e);
      });
  }

  function abortSearch() {
    const todoInput = document.getElementById(
      "todoInput"
    ) as HTMLInputElement | null;
    if (todoInput !== null) {
      todoInput.value = "";
    }
    setIsSearching(false);
    setNum((prevNum) => prevNum + 1);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundImage:
          "url(https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        height: "100vh",
      }}
    >
      <Header />
      <div className={styles.content}>
        <form action={handleCreate} className={styles.form}>
          <div className={styles.inputsAndCross}>
            <input
              type="hidden"
              value={user?.email as string}
              name="email"
            ></input>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                placeholder="todo"
                type="text"
                name="todo"
                id="todoInput"
              ></input>
              {isSearching && (
                <span onClick={abortSearch}>
                  <RxCrossCircled size={30} cursor="pointer" />
                </span>
              )}
            </div>
          </div>

          <div className={styles.submitAndSearch}>
            <button type="submit">
              <CiCirclePlus size={30} />
            </button>
            <button type="button" onClick={handleSearch}>
              <FcSearch size={30} />
            </button>
          </div>
        </form>

        <TodosList todos={todos} refreshPage={refreshPage} />
      </div>
    </div>
  );
};

export default Todos;
