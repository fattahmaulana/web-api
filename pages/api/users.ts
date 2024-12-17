import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    if (id) {
      // GET berdasarkan ID
      try {
        const user = await prisma.user.findUnique({
          where: { id: parseInt(id as string) },
        });

        if (!user) {
          return res.status(404).json({ error: "User not found." });
        }

        return res.status(200).json(user);
      } catch (error) {
        console.error("Error fetching user by ID:", error);
        return res.status(500).json({ error: "Failed to fetch user." });
      }
    } else {
      // GET semua data
      try {
        const users = await prisma.user.findMany();
        return res.status(200).json(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Failed to fetch users." });
      }
    }
  } else if (req.method === "POST") {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    try {
      const newUser = await prisma.user.create({
        data: { username, email, password },
      });
      return res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ error: "Failed to create user." });
    }
  } else if (req.method === "PUT") {
    if (!id) {
      return res.status(400).json({ error: "ID is required for updating." });
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id as string) },
        data: { username, email, password },
      });
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ error: "Failed to update user." });
    }
  } else if (req.method === "DELETE") {
    if (!id) {
      return res.status(400).json({ error: "ID is required for deletion." });
    }

    try {
      await prisma.user.delete({
        where: { id: parseInt(id as string) },
      });
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ error: "Failed to delete user." });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed." });
  }
}
