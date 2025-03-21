import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Logic kiểm tra quyền ở đây
    return true; // Ví dụ tạm thời
  }
}