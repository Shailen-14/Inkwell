import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarDays, Pencil, Trash2, UserRound } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api, { getErrorMessage } from '../lib/api';
import type { Post } from '../types';

export const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    api
      .get<Post>(`/posts/${id}`)
      .then(({ data }) => {
        if (active) setPost(data);
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
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    try {
      await api.delete(`/posts/${id}`);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );

  if (error || !post) {
    return (
      <div className="space-y-4">
        <div className="alert alert-error">{error || 'Post not found'}</div>
        <Link to="/" className="btn btn-primary">
          Back to posts
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === post.author?._id;

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <Link to="/" className="btn btn-ghost btn-sm gap-1">
        <ArrowLeft className="size-4" /> All posts
      </Link>

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body p-6 md:p-10">
          <div className="flex flex-wrap items-center gap-3 text-sm text-base-content/60">
            <span className="badge badge-primary gap-1">
              <UserRound className="size-3" /> {post.author?.name || 'Unknown'}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3" />
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold md:text-4xl">{post.title}</h1>
          <div className="post-content mt-6 text-base-content/80">{post.content}</div>

          {isOwner && (
            <div className="card-actions mt-8 border-t border-base-200 pt-6">
              <Link to={`/edit/${post._id}`} className="btn btn-outline btn-sm gap-1">
                <Pencil className="size-4" /> Edit
              </Link>
              <button
                type="button"
                className="btn btn-error btn-outline btn-sm gap-1"
                onClick={handleDelete}
              >
                <Trash2 className="size-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
