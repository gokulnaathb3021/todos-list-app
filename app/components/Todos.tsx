import styles from "../todos/todos.module.css";
import Todo from "./Todo";

type todo = {
  id: string;
  todo: string;
  email: string;
};

type TodosProps = {
  todos: todo[];
  refreshPage: Function;
};

const TodosList: React.FC<TodosProps> = ({ todos, refreshPage }) => {
  return (
    <div className={styles.list}>
      {todos.map((todo) => (
        <Todo
          key={todo.id}
          id={todo.id}
          todo={todo.todo}
          refreshPage={refreshPage}
        />
      ))}
    </div>
  );
};
export default TodosList;
