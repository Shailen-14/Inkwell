import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <div className="card bg-base-100 p-12 text-center shadow-sm">
    <p className="text-6xl font-bold text-primary">404</p>
    <h1 className="mt-2 text-2xl font-semibold">Page not found</h1>
    <p className="mt-2 text-base-content/60">The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn btn-primary mt-6">
      Back home
    </Link>
  </div>
);
