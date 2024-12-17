import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query; // ID akan diambil dari query parameter untuk operasi berdasarkan ID

  if (req.method === "GET") {
    if (id) {
      // GET berdasarkan ID
      try {
        const recipe = await prisma.recipe.findUnique({
          where: { id: parseInt(id as string) },
          include: {
            category: true,
            user: true,
            comments: true,
            ratings: true,
          },
        });

        if (!recipe) {
          return res.status(404).json({ error: "Recipe not found." });
        }

        return res.status(200).json(recipe);
      } catch (error) {
        console.error("Error fetching recipe by ID:", error);
        return res.status(500).json({ error: "Failed to fetch recipe." });
      }
    } else {
      // GET semua data
      try {
        const recipes = await prisma.recipe.findMany({
          include: {
            category: true,
            user: true,
            comments: true,
            ratings: true,
          },
        });
        return res.status(200).json(recipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        return res.status(500).json({ error: "Failed to fetch recipes." });
      }
    }
  } else if (req.method === "POST") {
    // POST (menambahkan data baru)
    const { title, ingredients, instructions, categoryId, userId } = req.body;

    if (!title || !ingredients || !instructions || !categoryId || !userId) {
      return res.status(400).json({ error: "All fields are required." });
    }

    try {
      const newRecipe = await prisma.recipe.create({
        data: {
          title,
          ingredients,
          instructions,
          categoryId,
          userId,
        },
      });
      return res.status(201).json(newRecipe);
    } catch (error) {
      console.error("Error creating recipe:", error);
      return res.status(500).json({ error: "Failed to create recipe." });
    }
  } else if (req.method === "PUT") {
    // PUT (mengupdate data berdasarkan ID)
    if (!id) {
      return res.status(400).json({ error: "ID is required for updating." });
    }

    const { title, ingredients, instructions, categoryId, userId } = req.body;

    if (!title || !ingredients || !instructions || !categoryId || !userId) {
      return res.status(400).json({ error: "All fields are required." });
    }

    try {
      const updatedRecipe = await prisma.recipe.update({
        where: { id: parseInt(id as string) },
        data: {
          title,
          ingredients,
          instructions,
          categoryId,
          userId,
        },
      });
      return res.status(200).json(updatedRecipe);
    } catch (error) {
      console.error("Error updating recipe:", error);
      return res.status(500).json({ error: "Failed to update recipe." });
    }
  } else if (req.method === "DELETE") {
    // DELETE (menghapus data berdasarkan ID)
    if (!id) {
      return res.status(400).json({ error: "ID is required for deletion." });
    }

    try {
      await prisma.recipe.delete({
        where: { id: parseInt(id as string) },
      });
      return res.status(204).end(); // No content
    } catch (error) {
      console.error("Error deleting recipe:", error);
      return res.status(500).json({ error: "Failed to delete recipe." });
    }
  } else {
    // Jika metode tidak didukung
    return res.status(405).json({ error: "Method Not Allowed." });
  }
}
