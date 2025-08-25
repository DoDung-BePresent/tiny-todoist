import type { User as PrismaUser } from '@prisma/client';

declare global {
  namespace Express {
    interface AuthInfo {}

    interface User extends PrismaUser {}

    interface Request {
      authInfo?: AuthInfo | undefined;
      user?: User | undefined;
    }
  }
}
