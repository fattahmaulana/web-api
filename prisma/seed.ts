import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Membuat pengguna (User)
  const user1 = await prisma.user.create({
    data: {
      username: 'user1',
      email: 'user1@example.com',
      password: 'password123',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'user2',
      email: 'user2@example.com',
      password: 'password456',
    },
  });

  // Membuat kategori (Category)
  const category1 = await prisma.category.create({
    data: {
      name: 'Makanan Sehat',
    },
  });

  const category2 = await prisma.category.create({
    data: {
      name: 'Makanan Cepat Saji',
    },
  });

  // Membuat resep (Recipe)
  const recipe1 = await prisma.recipe.create({
    data: {
      title: 'Resep Brokoli Panggang',
      ingredients: 'Brokoli, Minyak Zaitun, Garam',
      instructions: 'Panggang brokoli dengan minyak zaitun.',
      categoryId: category1.id,
      userId: user1.id,
    },
  });

  const recipe2 = await prisma.recipe.create({
    data: {
      title: 'Resep Burger Cepat Saji',
      ingredients: 'Roti, Daging, Keju',
      instructions: 'Masak daging, letakkan di roti dan tambahkan keju.',
      categoryId: category2.id,
      userId: user2.id,
    },
  });

  // Menambahkan komentar (Comment) untuk resep
  const comment1 = await prisma.comment.create({
    data: {
      text: 'Resep ini enak banget!',
      userId: user1.id,
      recipeId: recipe1.id,
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      text: 'Burgernya sangat lezat!',
      userId: user2.id,
      recipeId: recipe2.id,
    },
  });

  // Menambahkan rating (Rating) untuk resep
  const rating1 = await prisma.rating.create({
    data: {
      score: 5,
      userId: user1.id,
      recipeId: recipe1.id,
    },
  });

  const rating2 = await prisma.rating.create({
    data: {
      score: 4,
      userId: user2.id,
      recipeId: recipe2.id,
    },
  });

  console.log('Semua data berhasil di-seed!');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
