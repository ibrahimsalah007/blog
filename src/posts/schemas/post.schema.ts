import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import * as Mongoose from 'mongoose';
import { User } from 'src/users/schema/user.schema';

export type PostDocument = Post & Mongoose.Document;

@Schema({ timestamps: true })
export class Post {
  @ApiProperty()
  @Prop()
  title: string;

  @ApiProperty()
  @Prop()
  content: string;

  @ApiProperty()
  @Prop({ unique: true })
  slug: string;

  @ApiProperty()
  @Prop({
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  author: User;

  @ApiProperty()
  @Prop({
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  })
  lastComment: string;

  @ApiProperty()
  @Prop()
  cover: string;

  @ApiProperty()
  @Prop()
  tags: string[];

  @ApiProperty()
  @Prop()
  likesCount: number;

  @ApiProperty()
  @Prop()
  commentsCount: number;

  @ApiProperty()
  @Prop()
  published: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.pre('save', function () {
  const post = this;
  post.slug = `${post.title}-${Math.random().toString().substring(2, 6)}`;
});
