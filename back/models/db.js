import mongoose from "mongoose";

main().catch((err) => console.log(err));

export async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27018/test");
}
