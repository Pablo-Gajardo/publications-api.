import { JwtService } from '../token/token_handler';
import { AuthGuard } from './auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService();
    guard = new AuthGuard(jwtService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if token is valid', () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: 'Bearer validToken',
        },
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(jwtService, 'verifyToken').mockReturnValue({ userId: 1 });

    expect(guard.canActivate(mockExecutionContext)).toBe(true);
  });

  it('should throw UnauthorizedException if no token is provided', () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: {},
      }),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(mockExecutionContext)).toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if token is invalid', () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: 'Bearer invalidToken',
        },
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(jwtService, 'verifyToken').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    expect(() => guard.canActivate(mockExecutionContext)).toThrow(UnauthorizedException);
  });
});
