import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument, UserTypeData } from '../user/models/user.model';

export const GetUser = createParamDecorator(
  (data: UserTypeData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: UserDocument }>();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
