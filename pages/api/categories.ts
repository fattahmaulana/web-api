import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    if (id) {
      // GET berdasarkan ID
      try {
        const category = await prisma.category.findUnique({
          where: { id: parseInt(id as string) },
        });

        if (!category) {
          return res.status(404).json({ error: "Category not found." });
        }

        return res.status(200).json(category);
      } catch (error) {
        console.error("Error fetching category by ID:", error);
        return res.status(500).json({ error: "Failed to fetch category." });
      }
    } else {
      // GET semua data
      try {
        const categories = await prisma.category.findMany();
        return res.status(200).json(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({ error: "Failed to fetch categories." });
      }
    }
  } else if (req.method === "POST") {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required." });
    }

    try {
      const newCategory = await prisma.category.create({
        data: { name },
      });
      return res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error creating category:", error);
      return res.status(500).json({ error: "Failed to create category." });
    }
  } else if (req.method === "PUT") {
    if (!id) {
      return res.status(400).json({ error: "ID is required for updating." });
    }

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required." });
    }

    try {
      const updatedCategory = await prisma.category.update({
        where: { id: parseInt(id as string) },
        data: { name },
      });
      return res.status(200).json(updatedCategory);
    } catch (error) {
      console.error("Error updating category:", error);
      return res.status(500).json({ error: "Failed to update category." });
    }
  } else if (req.method === "DELETE") {
    if (!id) {
      return res.status(400).json({ error: "ID is required for deletion." });
    }

    try {
      await prisma.category.delete({
        where: { id: parseInt(id as string) },
      });
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting category:", error);
      return res.status(500).json({ error: "Failed to delete category." });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed." });
  }
}
