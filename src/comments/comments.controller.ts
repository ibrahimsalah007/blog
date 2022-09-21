import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { AuthGuard } from 'src/common/guards';

import { CommentsService } from './comments.service';

import { CreateCommentDto, UpdateCommentDto } from './dto/request';
import { Comment } from './schemas/comment.schema';

@ApiTags('Comments')
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiBearerAuth()
  @ApiCreatedResponse({ type: Comment })
  @UseGuards(AuthGuard)
  @Post()
  createComment(
    @Param('postId') postId: string,
    @CurrentUser('id') userId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(userId, postId, createCommentDto);
  }

  @ApiResponse({ type: Comment, isArray: true })
  @Get()
  findPostComments(@Param('postId') postId: string) {
    return this.commentsService.findPostComments(postId);
  }

  @ApiResponse({ type: Comment })
  @Get(':commentId')
  findPostComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ) {
    return this.commentsService.findPostComment(postId, commentId);
  }

  @ApiBearerAuth()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  @Patch(':commentId')
  updateComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    //todo: Add Policy to check if post owned by user

    return this.commentsService.updateComment(
      postId,
      commentId,
      updateCommentDto,
    );
  }

  @ApiBearerAuth()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  @Delete(':commentId')
  removeComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ) {
    //todo: Add Policy to check if post owned by user

    return this.commentsService.removeComment(postId, commentId);
  }
}
