import {
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { TokensResponse } from '../responses/tokens.response';
import { AuthenticatedUserResponse } from '../responses/authenticated-user.response';

export function ApiOperationLogin() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    ApiOperation({ summary: 'Login to account.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiOkResponse({
      type: AuthenticatedUserResponse,
      description: 'Successful login.',
    })(target, propertyKey, descriptor);
    ApiUnauthorizedResponse({
      description: 'Incorrect email or password.',
    })(target, propertyKey, descriptor);
  };
}

export function ApiOperationRegister() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    ApiOperation({ summary: 'Create an account.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiOkResponse({
      type: AuthenticatedUserResponse,
      description: 'Successful registration.',
    })(target, propertyKey, descriptor);
    ApiConflictResponse({
      description: 'Email or username is already taken.',
    })(target, propertyKey, descriptor);
  };
}

export function ApiOperationRefresh() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    ApiOperation({ summary: 'Refresh access and refresh tokens.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiOkResponse({
      type: TokensResponse,
      description: 'Successful refresh.',
    })(target, propertyKey, descriptor);
    ApiUnauthorizedResponse({
      description: 'Refresh token is missing or was expired.',
    })(target, propertyKey, descriptor);
  };
}

export function ApiOperationLogout() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    ApiOperation({ summary: 'Log out of account.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiOkResponse({ description: 'Successful logout.' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiBadRequestResponse({
      description: 'Missing token in request cookies.',
    })(target, propertyKey, descriptor);
  };
}
