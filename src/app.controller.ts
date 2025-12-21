import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service'

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) { }

  @Get('test-db')
  async testDb() {
    const newPost = await this.prisma.post.create({
      data: {
        title: '我的第一篇Prisma文章',
        content: '测试接口导入的数据',
        published: true,
      }
    })

    const allPosts = await this.prisma.post.findMany()
    return {
      message: 'Database connection successful!',
      data: allPosts
    }
  }


@Get('test-tags-v2')
async testTagsV2() {
  const result = await this.prisma.post.create({
    data: {
      title: '学习 Prisma 多对多关联',
      content: '今天成功配置了 Post 和 Tag 的关系',
      published: true,
      tags: {
        // 隐式关系的写法
        connectOrCreate: [
          {
            where: { name: 'NestJS' },
            create: { name: 'NestJS' },
          },
          {
            where: { name: 'Database' },
            create: { name: 'Database' },
          },
        ],
      },
    },
    include: {
      tags: true,
    },
  });

  return result;
}


  @Get('test-simple')
  async testSimple() {
    // 先只创建 Post，不关联 tags
    const post = await this.prisma.post.create({
      data: {
        title: '简单测试',
        content: '测试基本功能',
        published: true,
      }
    });

    // 再创建 Tag
    const tag1 = await this.prisma.tag.upsert({
      where: { name: 'NestJS' },
      update: {},
      create: { name: 'NestJS' }
    });

    // 手动关联（如果使用隐式多对多）
    const updatedPost = await this.prisma.post.update({
      where: { id: post.id },
      data: {
        tags: {
          connect: { id: tag1.id }
        }
      },
      include: {
        tags: true
      }
    });

    return updatedPost;
  }

  @Get('test-create-tag')
async testCreateTag() {
  // 先单独创建 Tag
  const tag = await this.prisma.tag.create({
    data: {
      name: 'TestTag'
    }
  });
  
  return tag;
}

@Get('test-create-post')
async testCreatePost() {
  // 先创建不关联 tags 的 Post
  const post = await this.prisma.post.create({
    data: {
      title: 'Simple Post',
      content: 'Test content',
      published: true,
    }
  });
  
  return post;
}
}
