import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { verify, JwtPayload } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

interface SupabaseJwtPayload extends JwtPayload {
  sub: string;
  aud: string;
  exp: number;
  iss: string;
}

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token in authorization header');
    }

    try {
      const supabaseJwtSecret = this.configService.get<string>('SUPABASE_JWT_SECRET');
      if (!supabaseJwtSecret) {
        throw new UnauthorizedException('Missing SUPABASE_JWT_SECRET');
      }

      const payload = verify(token, supabaseJwtSecret) as SupabaseJwtPayload;

      if (!payload.sub) {
        throw new UnauthorizedException('Invalid token payload');
      }

      request.user = { id: payload.sub };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
} 