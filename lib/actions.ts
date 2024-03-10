"use server";

import { connect } from "@/app/utils/db";
import prisma from "@/prisma";

export async function createToDo(formData: FormData) {
  try {
    await connect();
    const { email, todo } = Object.fromEntries(formData);
    const emailString = email?.toString() ?? "";
    const todoString = todo?.toString() ?? "";
    const createdToDo = await prisma.todo.create({
      data: { email: emailString, todo: todoString },
    });
    return createdToDo;
  } catch (e) {
    console.log(e);
    throw new Error("Failed to create new a todo.");
  }
}

export async function fetchToDos(email: string, pageNum: number) {
  const ITEM_PER_PAGE = 4;
  try {
    await connect();
    const count = (await prisma.todo.findMany({ where: { email } })).length;
    const todos = await prisma.todo.findMany({
      where: { email },
      orderBy: { date: "desc" },
      take: 4,
      skip: (pageNum - 1) * 4,
    });
    return { todos, count };
  } catch (e) {
    console.log(e);
    throw new Error("Failed to fetch todos!");
  }
}

export async function fetchCertainToDos(
  q: string,
  email: string,
  pageNum: number
) {
  const regex = new RegExp(q, "i");
  try {
    await connect();
    const count = (
      await prisma.todo.findMany({
        where: {
          todo: {
            contains: regex.source,
            mode: "insensitive",
          },
          email,
        },
      })
    ).length;
    const todosContainingQ = await prisma.todo.findMany({
      where: {
        todo: {
          contains: regex.source,
          mode: "insensitive",
        },
        email,
      },
      orderBy: { date: "desc" },
      take: 4,
      skip: (pageNum - 1) * 4,
    });
    return { todosContainingQ, count };
  } catch (e) {
    throw new Error("Couldn't fetch those certain todos.");
  }
}

export async function editToDo(formData: FormData) {
  try {
    await connect();
    const { id, todo } = Object.fromEntries(formData);
    const todoString = todo?.toString() ?? "";
    const idString = id?.toString() ?? "";
    const postedTodo = await prisma.todo.update({
      data: { todo: todoString },
      where: { id: idString },
    });
    return postedTodo;
  } catch (e) {
    console.log(e);
    throw new Error("Couldn't update the todo!");
  }
}

export async function deleteToDo(id: string) {
  try {
    await connect();
    const idString = id?.toString() ?? "";
    const deletedTodo = await prisma.todo.delete({ where: { id: idString } });
    return deletedTodo;
  } catch (e) {
    throw new Error("Couldn't delete the todo.");
  }
}
