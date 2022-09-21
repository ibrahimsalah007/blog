import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Post, PostDocument } from './schemas/post.schema';

import { CreatePostDto, UpdatePostDto } from './dto/request';
import { Comment, CommentDocument } from 'src/comments/schemas/comment.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  async createPost(userId: string, createPostDto: CreatePostDto) {
    return this.postModel.create({ ...createPostDto, author: userId });
  }

  async findPosts(): Promise<Post[]> {
    return this.postModel
      .find({ published: true })
      .populate('author')
      .populate({
        path: 'lastComment',
        populate: {
          path: 'author',
          model: 'User',
        },
      });
  }

  async findPostById(postId: string): Promise<Post> {
    const post = await this.postModel
      .findById(postId)
      .populate('author')
      .populate({
        path: 'lastComment',
        populate: {
          path: 'author',
          model: 'User',
        },
      });

    if (!post) throw new NotFoundException(`Post with id: ${postId} not found`);

    return post;
  }

  async updatePost(
    postId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<void> {
    await this.findPostById(postId);

    this.postModel.findByIdAndUpdate(postId, updatePostDto);
  }

  async removePost(postId: string): Promise<void> {
    await this.findPostById(postId);

    await this.commentModel.deleteMany({ post: postId });

    await this.postModel.findByIdAndRemove(postId);
  }
}
