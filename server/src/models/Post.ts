import { Schema, model, type Document, type Model, type Types } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

type PostModel = Model<IPost>;

const postSchema = new Schema<IPost, PostModel>(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    content: { type: String, required: true, trim: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export const Post = model<IPost, PostModel>('Post', postSchema);
