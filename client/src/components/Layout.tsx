import { LogOut, Menu, PenLine, PlusCircle, UserRound } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ThemeSwitcher } from './ThemeSwitcher';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `btn btn-ghost btn-sm ${isActive ? 'btn-active text-primary' : ''}`;

export const Layout = () => {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  const navLinks = (
    <>
      <NavLink to="/" end className={navLinkClass}>
        Home
      </NavLink>
      {user && (
        <>
          <NavLink to="/new" className={navLinkClass}>
            Write
          </NavLink>
          <NavLink to="/my-posts" className={navLinkClass}>
            My Posts
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <div className="flex min-h-screen flex-col bg-base-200">
      <header className="navbar sticky top-0 z-40 bg-base-100/90 shadow-sm backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4">
          <div className="dropdown">
            <button className="btn btn-ghost btn-circle lg:hidden" aria-label="Open menu">
              <Menu className="size-5" />
            </button>
            <ul className="menu dropdown-content mt-3 w-40 rounded-box bg-base-100 p-2 shadow lg:hidden">
              <li>
                <Link to="/">Home</Link>
              </li>
              {user && (
                <>
                  <li>
                    <Link to="/new">Write</Link>
                  </li>
                  <li>
                    <Link to="/my-posts">My Posts</Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <Link to="/" className="btn btn-ghost gap-2 text-lg font-bold normal-case">
            <PenLine className="size-5 text-primary" /> Inkwell
          </Link>

          <nav className="hidden flex-1 items-center gap-1 lg:flex">{navLinks}</nav>

          <div className="ml-auto flex items-center gap-1">
            <ThemeSwitcher />
            {user ? (
              <>
                <div className="dropdown dropdown-end">
                  <button className="btn btn-ghost btn-circle" aria-label="Account menu">
                    <UserRound className="size-5" />
                  </button>
                  <ul className="menu dropdown-content z-50 mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
                    <li className="menu-title truncate">{user.email}</li>
                    <li>
                      <button type="button" onClick={signOut}>
                        <LogOut className="size-4" /> Log out
                      </button>
                    </li>
                  </ul>
                </div>
                <Link to="/new" className="btn btn-primary btn-sm hidden sm:flex">
                  <PlusCircle className="size-4" /> New post
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">
                  Log in
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <Outlet />
      </main>

      <footer className="footer footer-center bg-base-100 p-6 text-sm text-base-content/60">
        <aside>
          <p>Inkwell · Built with MERN, TypeScript, DaisyUI and Tailwind CSS</p>
        </aside>
      </footer>
    </div>
  );
};
