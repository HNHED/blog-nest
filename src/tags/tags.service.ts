import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async findAllWithCount() {
    const tags = await this.prisma.tag.findMany({
      include: {
        _count: { select: { posts: true } },
      },
      orderBy: { posts: { _count: 'desc' } },
    });

    return tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      postCount: tag._count.posts,
    }));
  }
}
