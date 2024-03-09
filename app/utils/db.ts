import prisma from "@/prisma";

export const connect = async () => {
  try {
    // Connecting our application to the database.
    await prisma.$connect();
  } catch (err) {
    throw new Error(err as string);
  }
};
