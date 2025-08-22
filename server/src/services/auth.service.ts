import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/crypto';
import { ConflictError } from '@/lib/error';
import { ERROR_CODE_ENUM } from '@/constants/error.constant';

export const authService = {
  async register({ email, password }: { email: string; password: string }) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictError(
          'Email already exists',
          ERROR_CODE_ENUM.USER_ALREADY_EXISTS,
        );
      }

      const hashedPassword = await hashPassword(password);
      const name = email.split('@')[0];

      const user = await prisma.user.create({
        data: {
          email,
          name,
          accounts: {
            create: {
              type: 'credentials',
              provider: 'credentials',
              providerAccountId: email,
              password: hashedPassword,
            },
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      throw error;
    }
  },
  async login() {
    // TODO:
  },
};
