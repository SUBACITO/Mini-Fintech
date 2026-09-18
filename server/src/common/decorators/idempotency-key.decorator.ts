// src/common/decorators/idempotency-key.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IdempotencyKey = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.idempotencyKey;
  }
)