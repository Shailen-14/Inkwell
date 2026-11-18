import type { Response } from 'express';
import { Post } from '../models/Post.js';
import type { AuthRequest } from '../types/index.js';

const populateAuthor = { path: 'author', select: 'name email' };

export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter: Record<string, unknown> = {};

    if (typeof req.query.author === 'string') filter.author = req.query.author;
    if (typeof req.query.q === 'string' && req.query.q.trim()) {
      const search = req.query.q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.title = { $regex: search, $options: 'i' };
    }

    const posts = await Post.find(filter).populate(populateAuthor).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const getPostById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id).populate(populateAuthor);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    res.json(post);
  } catch {
    res.status(404).json({ message: 'Post not found' });
  }
};

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body as Record<string, unknown>;

    if (
      typeof title !== 'string' ||
      typeof content !== 'string' ||
      !title.trim() ||
      !content.trim()
    ) {
      res.status(400).json({ message: 'Title and content are required' });
      return;
    }

    const post = await Post.create({
      title: title.trim(),
      content: content.trim(),
      author: req.user!.id,
    });
    await post.populate(populateAuthor);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    if (post.author.toString() !== req.user!.id) {
      res.status(403).json({ message: 'You can only edit your own posts' });
      return;
    }

    const { title, content } = req.body as Record<string, unknown>;
    if (
      typeof title !== 'string' ||
      typeof content !== 'string' ||
      !title.trim() ||
      !content.trim()
    ) {
      res.status(400).json({ message: 'Title and content are required' });
      return;
    }

    post.title = title.trim();
    post.content = content.trim();
    await post.save();
    await post.populate(populateAuthor);
    res.json(post);
  } catch {
    res.status(404).json({ message: 'Post not found' });
  }
};

export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    if (post.author.toString() !== req.user!.id) {
      res.status(403).json({ message: 'You can only delete your own posts' });
      return;
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch {
    res.status(404).json({ message: 'Post not found' });
  }
};
