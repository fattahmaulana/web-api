export const metadata = {
  title: "Web Resep CRUD",
  description: " simple CRUD resep",
};
import "./globals.css";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>Admin - Aplikasi Resep Makanan</h1>
          
        </header>
        <div className="layout">
          {/* Sidebar */}
          <aside className="sidebar">
            <h2>Tabel</h2>
            <ul>
              <li><a href="/">Resep</a></li>
            </ul>
          </aside>

          {/* Main Content */}
          <main className="main-content">{children}</main>
        </div>
        <footer>
          <p>&copy; {new Date().getFullYear()} CRUD API RESEP - Maulana Abdul Fattah</p>
        </footer>
      </body>
    </html>
  );
}
