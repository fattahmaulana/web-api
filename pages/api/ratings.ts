import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query; // ID akan diambil dari query parameter untuk operasi berbasis ID

  if (req.method === "GET") {
    if (id) {
      // GET berdasarkan ID
      try {
        const rating = await prisma.rating.findUnique({
          where: { id: parseInt(id as string) },
          include: {
            recipe: true,
            user: true,
          },
        });

        if (!rating) {
          return res.status(404).json({ error: "Rating not found." });
        }

        return res.status(200).json(rating);
      } catch (error) {
        console.error("Error fetching rating by ID:", error);
        return res.status(500).json({ error: "Failed to fetch rating." });
      }
    } else {
      // GET semua rating
      try {
        const ratings = await prisma.rating.findMany({
          include: {
            recipe: true,
            user: true,
          },
        });
        return res.status(200).json(ratings);
      } catch (error) {
        console.error("Error fetching ratings:", error);
        return res.status(500).json({ error: "Failed to fetch ratings." });
      }
    }
  } else if (req.method === "POST") {
    // POST (menambahkan rating baru)
    const { score, recipeId, userId } = req.body;

    if (!score || !recipeId || !userId) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (score < 1 || score > 5) {
      return res
        .status(400)
        .json({ error: "Score must be between 1 and 5." });
    }

    try {
      const newRating = await prisma.rating.create({
        data: {
          score,
          recipeId,
          userId,
        },
      });
      return res.status(201).json(newRating);
    } catch (error) {
      console.error("Error creating rating:", error);
      return res.status(500).json({ error: "Failed to create rating." });
    }
  } else if (req.method === "PUT") {
    // PUT (mengupdate rating berdasarkan ID)
    if (!id) {
      return res.status(400).json({ error: "ID is required for updating." });
    }

    const { score } = req.body;

    if (!score) {
      return res.status(400).json({ error: "Score is required." });
    }

    if (score < 1 || score > 5) {
      return res
        .status(400)
        .json({ error: "Score must be between 1 and 5." });
    }

    try {
      const updatedRating = await prisma.rating.update({
        where: { id: parseInt(id as string) },
        data: { score },
      });
      return res.status(200).json(updatedRating);
    } catch (error) {
      console.error("Error updating rating:", error);
      return res.status(500).json({ error: "Failed to update rating." });
    }
  } else if (req.method === "DELETE") {
    // DELETE (menghapus rating berdasarkan ID)
    if (!id) {
      return res.status(400).json({ error: "ID is required for deletion." });
    }

    try {
      await prisma.rating.delete({
        where: { id: parseInt(id as string) },
      });
      return res.status(204).end(); // No content
    } catch (error) {
      console.error("Error deleting rating:", error);
      return res.status(500).json({ error: "Failed to delete rating." });
    }
  } else {
    // Jika metode tidak didukung
    return res.status(405).json({ error: "Method Not Allowed." });
  }
}
