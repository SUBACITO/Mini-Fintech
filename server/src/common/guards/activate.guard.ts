import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { type UserSession } from '@thallesp/nestjs-better-auth';
import { UserStatus } from '../enums/user-status.enum.js';


type AuthenticatedUser = UserSession['user'] & {
    status: UserStatus
}

@Injectable()
export class ActivatedUserGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const session = request.session as UserSession;

        if (!session?.user) {
            throw new UnauthorizedException('Authentication required');
        }

        const user = session.user as AuthenticatedUser;

        if (user.status !== UserStatus.ACTIVATED) {
            throw new ForbiddenException(`Account is ${user.status}`);
        }

        return true;
    }
}