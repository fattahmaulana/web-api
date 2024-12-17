import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query; // ID akan diambil dari query parameter untuk operasi berbasis ID

  if (req.method === "GET") {
    if (id) {
      // GET berdasarkan ID
      try {
        const comment = await prisma.comment.findUnique({
          where: { id: parseInt(id as string) },
          include: {
            recipe: true,
            user: true,
          },
        });

        if (!comment) {
          return res.status(404).json({ error: "Comment not found." });
        }

        return res.status(200).json(comment);
      } catch (error) {
        console.error("Error fetching comment by ID:", error);
        return res.status(500).json({ error: "Failed to fetch comment." });
      }
    } else {
      // GET semua komentar
      try {
        const comments = await prisma.comment.findMany({
          include: {
            recipe: true,
            user: true,
          },
        });
        return res.status(200).json(comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ error: "Failed to fetch comments." });
      }
    }
  } else if (req.method === "POST") {
    // POST (menambahkan komentar baru)
    const { text, recipeId, userId } = req.body;

    if (!text || !recipeId || !userId) {
      return res.status(400).json({ error: "All fields are required." });
    }

    try {
      const newComment = await prisma.comment.create({
        data: {
          text,
          recipeId,
          userId,
        },
      });
      return res.status(201).json(newComment);
    } catch (error) {
      console.error("Error creating comment:", error);
      return res.status(500).json({ error: "Failed to create comment." });
    }
  } else if (req.method === "PUT") {
    // PUT (mengupdate komentar berdasarkan ID)
    if (!id) {
      return res.status(400).json({ error: "ID is required for updating." });
    }

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required." });
    }

    try {
      const updatedComment = await prisma.comment.update({
        where: { id: parseInt(id as string) },
        data: { text },
      });
      return res.status(200).json(updatedComment);
    } catch (error) {
      console.error("Error updating comment:", error);
      return res.status(500).json({ error: "Failed to update comment." });
    }
  } else if (req.method === "DELETE") {
    // DELETE (menghapus komentar berdasarkan ID)
    if (!id) {
      return res.status(400).json({ error: "ID is required for deletion." });
    }

    try {
      await prisma.comment.delete({
        where: { id: parseInt(id as string) },
      });
      return res.status(204).end(); // No content
    } catch (error) {
      console.error("Error deleting comment:", error);
      return res.status(500).json({ error: "Failed to delete comment." });
    }
  } else {
    // Jika metode tidak didukung
    return res.status(405).json({ error: "Method Not Allowed." });
  }
}
