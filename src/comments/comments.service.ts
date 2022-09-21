import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from 'src/posts/schemas/post.schema';

import { CreateCommentDto, UpdateCommentDto } from './dto/request/';
import { Comment, CommentDocument } from './schemas/comment.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async createComment(
    authorId: string,
    postId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentModel.create({
      author: authorId,
      post: postId,
      ...createCommentDto,
    });

    await this.postModel.findByIdAndUpdate(postId, {
      $inc: { commentsCount: 1 },
      lastComment: comment.id,
    });

    return comment;
  }

  async findPostComments(postId: string): Promise<Comment[]> {
    return this.commentModel.find({ post: postId }).populate('author');
  }

  async findPostComment(postId: string, commentId: string): Promise<Comment> {
    const comment = await this.commentModel
      .findOne({
        post: postId,
        _id: commentId,
      })
      .populate('author');

    if (!comment)
      throw new NotFoundException(
        `Comment with postId: ${postId} and commentId: ${commentId} not found `,
      );

    return comment;
  }

  async updateComment(
    postId: string,
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<void> {
    await this.findPostComment(postId, commentId);

    return this.commentModel.findOneAndUpdate(
      { post: postId, _id: commentId },
      updateCommentDto,
    );
  }

  async removeComment(postId: string, commentId: string): Promise<void> {
    await this.findPostComment(postId, commentId);

    return this.commentModel.findOneAndRemove({ post: postId, _id: commentId });
  }
}
