// idempotency.guard.ts
import { CanActivate, ExecutionContext, BadRequestException, Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class IdempotencyGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const idempotencyKey = request.headers['idempotency-key'];

        if (!idempotencyKey) {
            throw new BadRequestException('Idempotency-Key header is required');
        }

        if (!isUUID(idempotencyKey)) {
            throw new BadRequestException('Idempotency-Key must be a valid UUID');
        }

        request.idempotencyKey = idempotencyKey;

        return true
    }
}