import { deleteToDo, editToDo } from "@/lib/actions";
import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { IoTrashBinOutline } from "react-icons/io5";
import { TiTickOutline } from "react-icons/ti";
import { RxCrossCircled } from "react-icons/rx";
import styles from "../todos/todos.module.css";

type TodoProps = {
  todo: string;
  id: string;
  refreshPage: Function;
};

const Todo: React.FC<TodoProps> = ({ todo, id, refreshPage }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  function handleEdit() {
    setIsEditing(true);
  }
  function handleSubmit(formData: FormData) {
    editToDo(formData)
      .then(() => {
        setIsEditing(false);
        refreshPage();
      })
      .catch((e) => {
        throw new Error(e);
      });
  }
  function handleDelete() {
    deleteToDo(id)
      .then(() => refreshPage())
      .catch((e) => {
        throw new Error(e);
      });
  }
  return (
    <div>
      {!isEditing && (
        <div className={styles.todo}>
          {todo}
          <span>
            <button onClick={handleEdit}>
              <CiEdit size={30} />
            </button>
            <button onClick={handleDelete}>
              <IoTrashBinOutline size={30} />
            </button>
          </span>
        </div>
      )}
      {isEditing && (
        <form action={handleSubmit} className={styles.editForm}>
          <input type="hidden" name="id" value={id}></input>
          <input defaultValue={todo} name="todo"></input>
          <div>
            <button type="submit">
              <TiTickOutline size={30} />
            </button>
            <button type="button" onClick={() => setIsEditing(false)}>
              <RxCrossCircled size={30} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Todo;
