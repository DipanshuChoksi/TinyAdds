import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Blog } from "../models/Blog.js";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set!");
    process.exit(1);
  }

  const jsonPath = "/tmp/parsed_blogs.json";
  if (!fs.existsSync(jsonPath)) {
    console.error(`JSON file not found at ${jsonPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(jsonPath, "utf-8");
  const blogsData = JSON.parse(rawData);

  console.log(`Connecting to MongoDB...`);
  await mongoose.connect(uri);

  console.log(`Connected! Current blogs count in MongoDB: ${await Blog.countDocuments()}`);

  console.log(`Removing existing blogs...`);
  const delResult = await Blog.deleteMany({});
  console.log(`Deleted ${delResult.deletedCount} existing blog(s).`);

  console.log(`Inserting ${blogsData.length} blogs into MongoDB...`);
  const inserted = await Blog.insertMany(blogsData);
  console.log(`Successfully inserted ${inserted.length} blogs!`);

  const total = await Blog.countDocuments();
  console.log(`Verified final count in MongoDB: ${total}`);

  const sample = await Blog.findOne({ isDisplay: true, isActive: true }).lean();
  console.log("\nSample migrated blog document:");
  console.log({
    _id: sample?._id,
    title: sample?.title,
    bannerImage: sample?.bannerImage,
    isActive: sample?.isActive,
    isDisplay: sample?.isDisplay,
    deletedAt: sample?.deletedAt,
    createdAt: sample?.createdAt,
    updatedAt: sample?.updatedAt,
    contentPreview: sample?.content?.slice(0, 80) + "..."
  });

  await mongoose.disconnect();
  console.log("\nMigration completed cleanly.");
}

run().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
