import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const PUBLIC_KEY = 'public';
export const Public = () => SetMetadata(PUBLIC_KEY, true);

export const isPublic = (context: ExecutionContext, reflector: Reflector) => {
  return reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);
};
