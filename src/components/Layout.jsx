import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <nav className="flex gap-4">
          <Link to="/">Before</Link>
          <Link to="/after">After</Link>
          <Link to="/after-homework">After + 宿題</Link>
        </nav>
      </header>

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
