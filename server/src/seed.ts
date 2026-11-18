import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { Post } from './models/Post.js';
import { User } from './models/User.js';

dotenv.config();

const DEMO = {
  name: 'Demo Author',
  email: 'demo@blog.test',
  password: 'password123',
};

const posts = [
  {
    title: 'Welcome to Inkwell',
    content:
      'Inkwell is a small blogging app built with the MERN stack and TypeScript. Sign in, write a post, and share your ideas with the world.\n\nUse the theme switcher in the navbar to try light, dark, cupcake, or forest mode.',
  },
  {
    title: 'Why MVC keeps this app simple',
    content:
      'The server is split into models, views, and controllers. Models describe the data, controllers hold the business logic, and routes decide which controller runs. The React client is the view layer and talks to the API with Axios.',
  },
  {
    title: 'A quick note on authentication',
    content:
      'Passwords are hashed with bcryptjs before they are stored. After login, the server signs a JWT and the client sends it back in the Authorization header for protected actions like creating, editing, and deleting posts.',
  },
];

const seed = async (): Promise<void> => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/inkwell_db';
  await connectDB(uri);

  const password = await bcrypt.hash(DEMO.password, 10);
  const user = await User.findOneAndUpdate(
    { email: DEMO.email },
    { $set: { name: DEMO.name, password } },
    { new: true, upsert: true },
  );

  await Post.deleteMany({ author: user._id });
  await Post.insertMany(posts.map((post) => ({ ...post, author: user._id })));

  console.log(`Seeded ${posts.length} posts for ${DEMO.email} / ${DEMO.password}`);
  process.exit(0);
};

seed();
