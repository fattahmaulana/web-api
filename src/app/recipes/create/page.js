"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./styles.css";

export default function CreateRecipePage() {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [userId, setUserId] = useState("");
  const [categories, setCategories] = useState([]); // State untuk menyimpan kategori
  const router = useRouter();

  // Ambil data kategori dari API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
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
        router.push("/"); // Kembali ke halaman utama
      } else {
        console.error("Failed to create recipe");
      }
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };

  return (
    <div>
      <h1>Tambah Resep Baru</h1>
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
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Pilih Kategori</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary">Tambah Data</button>
      </form>
    </div>
  );
}
