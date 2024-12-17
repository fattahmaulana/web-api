"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditRecipePage() {
  const { id } = useParams(); // Menangkap ID dari URL
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [userId, setUserId] = useState("");
  const router = useRouter();

  // Fetch data dari API berdasarkan ID
  useEffect(() => {
    if (!id) return;

    console.log("Fetching recipe data for ID:", id);

    fetch(`/api/recipes?id=${id}`) // Fetch data dari API
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched recipe data:", data);

        setTitle(data.title || "");
        setIngredients(data.ingredients || "");
        setInstructions(data.instructions || "");
        setCategoryId(data.categoryId || "");
        setUserId(data.userId || "");
      })
      .catch((err) => console.error("Error fetching recipe:", err));
  }, [id]);

  if (!title && !ingredients && !instructions) {
    return <p>Loading...</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/recipes?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          ingredients,
          instructions,
          categoryId: parseInt(categoryId),
          userId: parseInt(userId),
        }),
      });

      if (response.ok) {
        console.log("Recipe updated successfully!");
        router.push("/recipes"); // Redirect ke halaman utama
      } else {
        console.error("Failed to update recipe");
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  return (
    <div>
      <h1>Edit Recipe</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
        ></textarea>
        <textarea
          placeholder="Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
        ></textarea>
        <input
          type="number"
          placeholder="Category ID"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <button type="submit">Update Recipe</button>
      </form>
    </div>
  );
}
