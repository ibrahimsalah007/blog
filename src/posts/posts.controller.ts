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

import { PostsService } from './posts.service';

import { CreatePostDto, UpdatePostDto } from './dto/request';
import { CurrentUser } from 'src/common/decorators';
import { AuthGuard } from 'src/common/guards';
import { Post as PostSchema } from './schemas/post.schema';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiCreatedResponse({ type: CreatePostDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  createPost(
    @CurrentUser('id') userId: string,
    @Body()
    createPostDto: CreatePostDto,
  ) {
    return this.postsService.createPost(userId, createPostDto);
  }

  @ApiResponse({ type: PostSchema, isArray: true })
  @Get()
  findPosts() {
    return this.postsService.findPosts();
  }

  @Get(':postId')
  findPost(@Param('postId') postId: string) {
    return this.postsService.findPostById(postId);
  }

  @ApiBearerAuth()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  @Patch(':postId')
  updatePost(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.updatePost(postId, updatePostDto);
  }

  @ApiBearerAuth()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  @Delete(':postId')
  remove(@Param('postId') postId: string) {
    return this.postsService.removePost(postId);
  }
}
