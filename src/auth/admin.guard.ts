import { Injectable, CanActivate, type ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

const TOKEN_VALIDITY_MS = 5 * 60 * 1000; // 5 分钟有效期，防止重放攻击

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const email = request.headers['x-admin-email'] as string;
    const timestamp = request.headers['x-admin-timestamp'] as string;
    const signature = request.headers['x-admin-signature'] as string;

    if (!email || !timestamp || !signature) {
      throw new UnauthorizedException('只有管理员可以操作');
    }

    // 校验时间戳有效性，防止重放攻击
    const ts = parseInt(timestamp, 10);
    if (isNaN(ts) || Date.now() - ts > TOKEN_VALIDITY_MS) {
      throw new UnauthorizedException('只有管理员可以操作');
    }

    const secret = process.env.ADMIN_SECRET;
    if (!secret) {
      throw new UnauthorizedException('只有管理员可以操作');
    }

    // 用 HMAC-SHA256 验证签名
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(`${email}:${timestamp}`)
      .digest('hex');

    // 固定时间比较，防止时序攻击
    try {
      const sigBuffer = Buffer.from(signature, 'hex');
      const expectedBuffer = Buffer.from(expectedSig, 'hex');
      if (
        sigBuffer.length !== expectedBuffer.length ||
        !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
      ) {
        throw new UnauthorizedException('只有管理员可以操作');
      }
    } catch (e) {
      if (e instanceof UnauthorizedException) throw e;
      throw new UnauthorizedException('只有管理员可以操作');
    }

    // 二次校验邮箱是否为配置的管理员
    if (email !== process.env.ADMIN_EMAIL) {
      throw new UnauthorizedException('只有管理员可以操作');
    }

    return true;
  }
}
