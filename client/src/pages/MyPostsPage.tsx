import { useEffect, useState } from 'react';
import { FilePenLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PostCard } from '../components/PostCard';
import { useAuthStore } from '../store/authStore';
import api, { getErrorMessage } from '../lib/api';
import type { Post } from '../types';

export const MyPostsPage = () => {
  const user = useAuthStore((state) => state.user);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPosts = () => {
    if (!user) return;
    api
      .get<Post[]>('/posts', { params: { author: user.id } })
      .then(({ data }) => setPosts(data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(loadPosts, [user]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    try {
      await api.delete(`/posts/${id}`);
      setPosts((current) => current.filter((post) => post._id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My posts</h1>
          <p className="mt-1 text-base-content/60">Manage everything you have published.</p>
        </div>
        <Link to="/new" className="btn btn-primary gap-2">
          <FilePenLine className="size-4" /> Write
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : posts.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} editable onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="card bg-base-100 p-10 text-center shadow-sm">
          <p className="text-lg font-medium">You haven't written a post yet</p>
          <Link to="/new" className="btn btn-primary mx-auto mt-4 w-1/2">
            Write your first post
          </Link>
        </div>
      )}
    </div>
  );
};
