import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import * as Mongoose from 'mongoose';

import { ApiProperty } from '@nestjs/swagger';

export type CommentDocument = Comment & Mongoose.Document;

@Schema()
export class Comment {
  @ApiProperty()
  @Prop()
  content: string;

  @ApiProperty()
  @Prop({
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  })
  post: string;

  @ApiProperty()
  @Prop({
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  author: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
