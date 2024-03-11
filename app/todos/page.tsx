"use client";
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
import ConditionalP from "../components/ConditionalP";

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
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalTodos, setTotalTodos] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [fetchingFailed, setFetchingFailed] = useState<boolean>(false);

  function refreshPage() {
    setNum((prevNum) => prevNum + 1);
  }

  useEffect(() => {
    setIsFetching(true);
  }, []);

  useEffect(() => {
    if (isSearching) {
      const todoInput = document.getElementById(
        "todoInput"
      ) as HTMLInputElement | null;
      fetchCertainToDos(
        todoInput?.value as string,
        user?.email as string,
        pageNum
      )
        .then((data) => {
          if (fetchingFailed) setFetchingFailed(false);
          setTotalTodos(data.count);
          setTodos(data.todosContainingQ);
        })
        .catch((e) => {
          setFetchingFailed(true);
          throw new Error(e);
        });
    } else
      fetchToDos(user?.email as string, pageNum)
        .then((data) => {
          if (fetchingFailed) setFetchingFailed(false);
          setIsFetching(false);
          setTotalTodos(data.count ?? 0);
          setTodos(data.todos);
        })
        .catch((error) => {
          setFetchingFailed(true);
          throw new Error(error);
        });
  }, [num, pageNum]);

  function handleCreate(formData: FormData) {
    const { todo } = Object.fromEntries(formData);
    if (!todo) return;
    createToDo(formData)
      .then(() => {
        fetchToDos(user?.email as string, pageNum)
          .then((data) => {
            if (fetchingFailed) setFetchingFailed(false);
            setTotalTodos(data.count);
            setTodos(data.todos);
          })
          .catch((error) => {
            setFetchingFailed(true);
            throw new Error(error);
          });
      })
      .catch((error) => {
        setFetchingFailed(true);
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
    setPageNum(1);
    fetchCertainToDos(
      todoInput?.value as string,
      user?.email as string,
      pageNum
    )
      .then((data) => {
        if (fetchingFailed) setFetchingFailed(false);
        setTotalTodos(data.count);
        setTodos(data.todosContainingQ);
      })
      .catch((e) => {
        setFetchingFailed(true);
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
    setPageNum(1);
    setNum((prevNum) => prevNum + 1);
  }

  const hasPrev = 4 * (pageNum - 1) > 0;
  const hasNext = 4 * (pageNum - 1) + 4 < totalTodos;

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
            <button type="submit" hidden={isSearching}>
              <CiCirclePlus size={30} />
            </button>
            <button type="button" onClick={handleSearch} hidden={isSearching}>
              <FcSearch size={30} />
            </button>
          </div>
        </form>
        {isFetching && (
          <ConditionalP text="Fetching your To-Dos..."></ConditionalP>
        )}
        {todos.length === 0 && !isSearching && !isFetching && (
          <ConditionalP text="No To-Dos yet. Add one🚀"></ConditionalP>
        )}
        {todos.length === 0 && isSearching && (
          <ConditionalP text="No matching To-Dos found!"></ConditionalP>
        )}
        {!fetchingFailed && (
          <TodosList todos={todos} refreshPage={refreshPage} />
        )}
        {totalTodos > 4 && (
          <div className={styles.pagination}>
            <button
              disabled={!hasPrev}
              onClick={() => {
                setPageNum((currPageNum) => currPageNum - 1);
              }}
            >
              Previous
            </button>
            <button
              disabled={!hasNext}
              onClick={() => {
                setPageNum((currPageNum) => currPageNum + 1);
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Todos;
