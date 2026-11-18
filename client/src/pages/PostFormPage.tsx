import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../lib/api';
import type { Post } from '../types';

export const PostFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api
      .get<Post>(`/posts/${id}`)
      .then(({ data }) => {
        setTitle(data.title);
        setContent(data.content);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { title: title.trim(), content: content.trim() };
      const { data } = isEdit
        ? await api.put<Post>(`/posts/${id}`, payload)
        : await api.post<Post>('/posts', payload);
      navigate(`/posts/${data._id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to={isEdit ? `/posts/${id}` : '/'} className="btn btn-ghost btn-sm gap-1">
        <ArrowLeft className="size-4" /> Back
      </Link>

      <div className="card bg-base-100 shadow-sm">
        <form className="card-body gap-4 p-6 md:p-10" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold">{isEdit ? 'Edit post' : 'Write a new post'}</h1>

          {error && <div className="alert alert-error">{error}</div>}

          <label className="form-control w-full">
            <span className="label-text font-medium">Title</span>
            <input
              className="input input-bordered w-full"
              placeholder="Give your post a title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={140}
              required
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text font-medium">Content</span>
            <textarea
              className="textarea textarea-bordered h-64 w-full"
              placeholder="Write your story..."
              value={content}
              onChange={(event) => setContent(event.target.value)}
              required
            />
          </label>

          <div className="card-actions justify-end">
            <button type="submit" className="btn btn-primary gap-2" disabled={saving}>
              {saving ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <Save className="size-4" />
              )}
              {isEdit ? 'Save changes' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
