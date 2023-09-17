import mongoose from "mongoose";
import slugify from "slugify";

const categoryShcema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Please provide name!"],
  },
  slug: {
    type: String,
    lowercase: true,
  },
});

categoryShcema.pre("save", function (next) {
  this.slug = slugify(this.name);
  next();
});

const Category = mongoose.model("Category", categoryShcema);

export default Category;
