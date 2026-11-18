import { CalendarDays, Clock3, Pencil, Trash2, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Post } from '../types';

interface PostCardProps {
  post: Post;
  onDelete?: (id: string) => void;
  editable?: boolean;
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export const PostCard = ({ post, onDelete, editable = false }: PostCardProps) => {
  const excerpt = post.content.length > 160 ? `${post.content.slice(0, 160)}…` : post.content;

  return (
    <article className="card bg-base-100 shadow-sm transition hover:shadow-md">
      <div className="card-body">
        <div className="flex flex-wrap items-center gap-2 text-xs text-base-content/60">
          <span className="badge badge-primary badge-outline gap-1">
            <UserRound className="size-3" /> {post.author?.name || 'Unknown'}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3" /> {formatDate(post.createdAt)}
          </span>
          {post.updatedAt !== post.createdAt && (
            <span className="flex items-center gap-1">
              <Clock3 className="size-3" /> edited
            </span>
          )}
        </div>

        <h2 className="card-title mt-2 text-xl">
          <Link to={`/posts/${post._id}`} className="hover:text-primary">
            {post.title}
          </Link>
        </h2>
        <p className="whitespace-pre-line text-base-content/70">{excerpt}</p>

        <div className="card-actions mt-2 items-center justify-between">
          <Link to={`/posts/${post._id}`} className="btn btn-ghost btn-sm">
            Read more
          </Link>
          {editable && (
            <div className="flex gap-1">
              <Link
                to={`/edit/${post._id}`}
                className="btn btn-ghost btn-sm"
                aria-label="Edit post"
              >
                <Pencil className="size-4" />
              </Link>
              <button
                type="button"
                className="btn btn-ghost btn-sm text-error"
                onClick={() => onDelete?.(post._id)}
                aria-label="Delete post"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
