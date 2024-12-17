"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./globals.css";

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit"); // Ambil ID dari query parameter

  // State untuk semua data
  const [recipes, setRecipes] = useState([]);

  // State untuk form edit
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [userId, setUserId] = useState("");

  // Fetch semua resep
  useEffect(() => {
    fetch("/api/recipes")
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch((err) => console.error("Error fetching recipes:", err));
  }, []);

  // Fetch data berdasarkan ID jika editId tersedia
  useEffect(() => {
    if (!editId) return;

    fetch(`/api/recipes?id=${editId}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title || "");
        setIngredients(data.ingredients || "");
        setInstructions(data.instructions || "");
        setCategoryId(data.categoryId || "");
        setUserId(data.userId || "");
      })
      .catch((err) => console.error("Error fetching recipe:", err));
  }, [editId]);

  // Fungsi submit untuk update data
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/recipes?id=${editId}`, {
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
        alert("Resep Sukses diupdated!");
        setRecipes((prev) =>
          prev.map((recipe) =>
            recipe.id === parseInt(editId)
              ? { ...recipe, title, ingredients, instructions, categoryId, userId }
              : recipe
          )
        );
        closeEditForm();
      } else {
        console.error("Gagal untuk update resep");
      }
    } catch (error) {
      console.error("Error updating resep:", error);
    }
  };

  // Fungsi untuk menutup form edit
  const closeEditForm = () => {
    router.push("/"); // Redirect ke halaman utama
  };

  // Fungsi untuk menghapus data
  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this recipe?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/recipes?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Recipe deleted successfully!");
        setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
      } else {
        console.error("Failed to delete recipe");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <nav>
          <a href="/recipes/create">Tambah Resep</a>
        </nav>
        {/* Tabel untuk daftar resep */}
        <table>
          <thead>
            <tr>
              <th>Resep</th>
              <th>Bahan Bahan</th>
              <th>Cara Membuat</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => (
              <tr key={recipe.id}>
                <td>{recipe.title}</td>
                <td>{recipe.ingredients}</td>
                <td>{recipe.instructions}</td>
                <td>
                  <button onClick={() => router.push(`/?edit=${recipe.id}`)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(recipe.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Form Edit */}
        {editId && (
          <div className="edit-form">
            <h2>Edit Resep</h2>
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
              <button type="submit">Update Data</button>
              <button type="button" onClick={closeEditForm}>
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </Suspense>
  );
}
