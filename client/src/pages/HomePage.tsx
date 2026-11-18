import { useEffect, useState, type FormEvent } from 'react';
import { BookOpenText, Search } from 'lucide-react';
import api, { getErrorMessage } from '../lib/api';
import { PostCard } from '../components/PostCard';
import type { Post } from '../types';

export const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    api
      .get<Post[]>('/posts', { params: search ? { q: search } : {} })
      .then(({ data }) => {
        if (active) {
          setPosts(data);
          setError('');
        }
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [search]);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const next = query.trim();
    if (next === search) return;
    setLoading(true);
    setError('');
    setSearch(next);
  };

  return (
    <div className="space-y-8">
      <section className="hero rounded-box bg-base-100 shadow-sm">
        <div className="hero-content flex-col items-start gap-6 px-4 py-10 md:flex-row md:justify-between">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold md:text-5xl">
              Stories worth <span className="text-primary">sharing</span>
            </h1>
            <p className="mt-4 text-base-content/70">
              A simple place to write, publish and read posts from the community.
            </p>
          </div>
          <BookOpenText className="size-24 text-primary/25" />
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold">Latest posts</h2>
          <form onSubmit={handleSearch} className="join">
            <input
              className="input input-bordered join-item w-full sm:w-64"
              placeholder="Search posts..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search posts"
            />
            <button className="btn btn-primary join-item" type="submit" aria-label="Search">
              <Search className="size-4" />
            </button>
          </form>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="h-44 animate-pulse rounded-box bg-base-100" />
            ))}
          </div>
        ) : posts.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="card bg-base-100 p-10 text-center shadow-sm">
            <p className="text-lg font-medium">No posts found</p>
            <p className="mt-1 text-base-content/60">
              {search ? 'Try another search term.' : 'Be the first to publish a post!'}
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
