import express from "express";

import { BlogController } from "../../controllers";

export const blogRouter = express.Router();

// Single Blog
blogRouter
	.route("/:id")
	.get(BlogController.get)
	.post(BlogController.create)
	.put(BlogController.update)
	.delete(BlogController.remove);

// All Blogs
blogRouter.route("/all").get(BlogController.getAll);
