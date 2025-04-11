import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white px-6 py-4 shadow-md">
        {/* <nav className="flex flex-wrap gap-6 text-lg font-semibold"> */}
        <nav className="bg-red-500 text-white p-4 flex flex-wrap gap-6 text-lg font-semibold">
          <Link to="/" className="hover:underline">
            Before
          </Link>
          <Link to="/after" className="hover:underline">
            After
          </Link>
          <Link to="/after-homework" className="hover:underline">
            After + 宿題fff
          </Link>
        </nav>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
