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
    title: 'The day my coffee fought back',
    content:
      'I asked the coffee machine for "something strong." It took that personally and brewed what can only be described as liquid confidence. Three sirens and one very alert hamster later, I decided to make peace and drink it anyway.',
  },
  {
    title: 'A very serious review of socks',
    content:
      'Socks are the unsung heroes of modern life. They keep feet warm, prevent blisters, and quietly disappear in the laundry with the patience of a saint. Ten out of ten would wear again, assuming they ever return.',
  },
  {
    title: 'How to train your houseplant',
    content:
      'Step one: give it light. Step two: give it water. Step three: accept that it has its own plans. My fern has been thriving on neglect and mild encouragement, which honestly describes my entire approach to adulthood.',
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
