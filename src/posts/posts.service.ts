import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from './../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) { }
  async create(createPostDto: CreatePostDto) {
    const { title, content, tags } = createPostDto;
    return this.prisma.post.create({
      data: {
        title,
        content,
        tags: {
          // 隐式关联直接在这里 connectOrCreate
          connectOrCreate: tags.map((tagName) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        },
      },
      // 隐式关联的 include 非常简单，直接把关联字段设为 true
      include: {
        tags: true,
      },
    });
  }
  findAll() {
    return this.prisma.post.findMany({
      include: {
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    });;
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        tags: true,
      },
    })
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    const { title, content, tags } = updatePostDto;
    return this.prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        tags: {
          // 1. 先断开所有旧关联 (隐式关联中 set: [] 非常高效)
          set: [],
          // 2. 重新连接或创建新标签
          connectOrCreate: tags.map(tagName => ({
            where: { name: tagName },
            create: { name: tagName }
          }))
        }
      }
    })
  }

  remove(id: number) {
    return this.prisma.post.delete({ where: { id } });
  }
}
