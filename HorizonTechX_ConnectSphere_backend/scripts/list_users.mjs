import dns from 'dns';
import mongoose from 'mongoose';
import env from '../src/configs/env.config.js';
import { User, Post, Follow, Comment } from '../src/models/index.js';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.log("DNS setServers error:", e.message);
}

async function listUsers() {
  await mongoose.connect(env.mongoUri);
  console.log("Connected to DB");
  const users = await User.find({}).select('username fullName email createdAt').lean();
  console.log(`Found ${users.length} users:`);
  users.forEach(u => {
    console.log(`- ID: ${u._id} | username: ${u.username} | name: ${u.fullName} | email: ${u.email}`);
  });
  await mongoose.disconnect();
}

listUsers().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
