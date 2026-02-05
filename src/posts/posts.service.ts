import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from './../prisma/prisma.service';

const TAG_COLOR_MAP: Record<string, { primary: string; secondary: string; text?: string }> = {
  // 编程语言
  'javascript': { primary: '#f7df1e', secondary: '#323330', text: '#323330' },
  'typescript': { primary: '#3178c6', secondary: '#1e3a5f' },
  'react': { primary: '#61dafb', secondary: '#20232a' },
  'vue': { primary: '#42b883', secondary: '#35495e' },
  'nextjs': { primary: '#000000', secondary: '#333333' },
  'next.js': { primary: '#000000', secondary: '#333333' },
  'nodejs': { primary: '#339933', secondary: '#1a1a1a' },
  'node.js': { primary: '#339933', secondary: '#1a1a1a' },
  'nestjs': { primary: '#e0234e', secondary: '#9b1c3c' },
  'python': { primary: '#3776ab', secondary: '#ffd43b' },
  'rust': { primary: '#ce422b', secondary: '#1a1a1a' },
  'go': { primary: '#00add8', secondary: '#ffffff', text: '#000000' },
  'golang': { primary: '#00add8', secondary: '#ffffff', text: '#000000' },
  'java': { primary: '#007396', secondary: '#ed8b00' },
  'c++': { primary: '#00599c', secondary: '#004482' },
  'c#': { primary: '#512bd4', secondary: '#68217a' },
  'php': { primary: '#777bb4', secondary: '#4f5b93' },
  'ruby': { primary: '#cc342d', secondary: '#8b1a10' },
  'swift': { primary: '#fa7343', secondary: '#fd2d2d' },
  'kotlin': { primary: '#7f52ff', secondary: '#c711e1' },

  // 前端技术
  'css': { primary: '#264de4', secondary: '#2965f1' },
  'html': { primary: '#e34f26', secondary: '#f06529' },
  'tailwind': { primary: '#06b6d4', secondary: '#0891b2' },
  'vite': { primary: '#646cff', secondary: '#bd34fe' },

  // 后端/数据库
  'express': { primary: '#000000', secondary: '#444444' },
  'mongodb': { primary: '#47a248', secondary: '#116149' },
  'mysql': { primary: '#4479a1', secondary: '#00758f' },
  'postgresql': { primary: '#336791', secondary: '#0064a5' },
  'redis': { primary: '#dc382d', secondary: '#a41e11' },
  'graphql': { primary: '#e10098', secondary: '#b7006c' },
  'docker': { primary: '#2496ed', secondary: '#0db7ed' },

  // 中文分类
  '前端': { primary: '#667eea', secondary: '#764ba2' },
  '后端': { primary: '#11998e', secondary: '#38ef7d' },
  '全栈': { primary: '#fc466b', secondary: '#3f5efb' },
  '算法': { primary: '#fa709a', secondary: '#fee140' },
  '设计模式': { primary: '#8360c3', secondary: '#2ebf91' },
  '教程': { primary: '#6366f1', secondary: '#8b5cf6' },
  '笔记': { primary: '#14b8a6', secondary: '#06b6d4' },

  // 默认
  'default': { primary: '#667eea', secondary: '#764ba2' },
};

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) { }

  async create(createPostDto: CreatePostDto) {
    const { tags, coverConfig, ...data } = createPostDto;
    const finalCoverConfig = coverConfig || this.generateDefaultCover(tags);
    return this.prisma.post.create({
      data: {
        ...data,
        coverConfig: finalCoverConfig,
        tags: {
          connectOrCreate: tags.map((tagName) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        },
      },
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
    });
  }

  async search(keyword: string) {
    if (!keyword || keyword.trim() === '') {
      return [];
    }

    return this.prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { content: { contains: keyword, mode: 'insensitive' } },
          { tags: { some: { name: { contains: keyword, mode: 'insensitive' } } } },
        ],
      },
      include: {
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        tags: true,
      },
    });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    const { title, content, tags } = updatePostDto;
    return this.prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        tags: {
          set: [],
          connectOrCreate: tags.map(tagName => ({
            where: { name: tagName },
            create: { name: tagName }
          }))
        }
      },
      include: {
        tags: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.post.delete({ where: { id } });
  }

  async updateCover(id: number, coverConfig: any) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`文章 ${id} 不存在`);
    }

    return this.prisma.post.update({
      where: { id },
      data: { coverConfig },
      include: {
        tags: true,
      },
    });
  }

  private generateDefaultCover(tags: string[]) {
    const firstTag = tags[0]?.toLowerCase() || 'default';
    const colorScheme = TAG_COLOR_MAP[firstTag] || TAG_COLOR_MAP['default'];

    return {
      template: 'gradient',
      primaryColor: colorScheme.primary,
      secondaryColor: colorScheme.secondary,
      textColor: colorScheme.text || '#ffffff',
      layout: 'center',
    };
  }
}
