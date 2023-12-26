import * as AsyncHandlerMiddleware from './asyncHandler.middleware';
import * as ErrorMiddleware from './error.middleware';
import * as AuthMiddleware from './auth.middleware';

export namespace Middleware {
  export const asyncHandler = AsyncHandlerMiddleware.asyncHandler;
  export const setupErrorHandlers = ErrorMiddleware.setupErrorHandlers;
  export const protect = AuthMiddleware.protect;
  export const admin = AuthMiddleware.admin;
}
