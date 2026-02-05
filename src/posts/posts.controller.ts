import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UpdateCoverDto } from './dto/update-cover.dto';
import { AdminGuard } from '../auth/admin.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get('search')
  search(@Query('q') keyword: string) {
    return this.postsService.search(keyword);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }

  @Put(':id/cover')
  @UseGuards(AdminGuard)
  updateCover(@Param('id') id: string, @Body() updateCoverDto: UpdateCoverDto) {
    return this.postsService.updateCover(+id, updateCoverDto.coverConfig);
  }
}
