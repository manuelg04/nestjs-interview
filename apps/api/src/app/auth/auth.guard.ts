import { ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    // Add your logging here
    const request = context.switchToHttp().getRequest();
    this.logger.debug('Authorization Header:', request.headers.authorization);

    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      this.logger.error(`Authentication Error: ${info?.message}`);
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
