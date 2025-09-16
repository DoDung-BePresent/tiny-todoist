/**
 * Libs
 */
import prisma from '@/lib/prisma';
import { comparePassword, hashPassword } from '@/lib/crypto';
import { BadRequestError, ConflictError } from '@/lib/error';

/**
 * Constants
 */
import { ERROR_CODE_ENUM } from '@/constants/error.constant';

/**
 * Services
 */
import { seedService } from '@/services/seed.service';

/**
 * Types
 */
type CredentialPayload = { email: string; password: string };

export const authService = {
  register: async ({ email, password }: CredentialPayload) => {
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
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    seedService.seedInitialDataForUser(user.id);

    return user;
  },
  login: async ({ email, password }: CredentialPayload) => {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true,
      },
    });

    if (!existingUser) {
      throw new BadRequestError(
        'Invalid email or password',
        ERROR_CODE_ENUM.INVALID_CREDENTIALS,
      );
    }

    const credentialsAccount = existingUser.accounts.find(
      (acc) => acc.provider === 'credentials',
    );

    if (!credentialsAccount || !credentialsAccount.password) {
      throw new BadRequestError(
        'This account was created using a different method. Please log in with your social account',
        ERROR_CODE_ENUM.ACCOUNT_EXISTS_WITH_DIFFERENT_PROVIDER,
      );
    }

    const isMatchPassword = await comparePassword(
      password,
      credentialsAccount.password,
    );

    if (!isMatchPassword) {
      throw new BadRequestError(
        'Invalid email or password',
        ERROR_CODE_ENUM.INVALID_CREDENTIALS,
      );
    }

    const { accounts, ...user } = existingUser;

    return user;
  },
};
