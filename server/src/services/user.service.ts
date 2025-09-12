/**
 * Node modules
 */
import bcrypt from 'bcryptjs';
import sharp from 'sharp';

/**
 * Configs
 */
import config from '@/config/env.config';

/**
 * Constants
 */
import { ERROR_CODE_ENUM } from '@/constants/error.constant';

/**
 * Libs
 */
import prisma from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '@/lib/error';
import { logger } from '@/lib/logger';
import { comparePassword, hashPassword } from '@/lib/crypto';

export const userService = {
  getUserById: async (userId: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  },
  updateProfile: async (
    userId: string,
    payload: { name?: string; removeAvatar?: 'true' },
    avatarFile?: Express.Multer.File,
  ) => {
    const user = await userService.getUserById(userId);
    const dataToUpdate: { name?: string; avatar?: string | null } = {};

    if (payload.name) {
      dataToUpdate.name = payload.name;
    }

    const oldAvatarPath = user.avatar;

    if (avatarFile) {
      const filePath = `${userId}/${Date.now()}.webp`;

      const optimizedBuffer = await sharp(avatarFile.buffer)
        .resize({ width: 256, height: 256, fit: 'cover' })
        .webp({ quality: 80 })
        .toBuffer();

      const { error } = await supabase.storage
        .from(config.SUPABASE_AVATAR_BUCKET_NAME)
        .update(filePath, optimizedBuffer, { contentType: 'image/webp' });

      if (error) {
        throw new InternalServerError(
          `Supabase upload error: ${error.message}`,
          ERROR_CODE_ENUM.FILE_STORAGE_ERROR,
        );
      }
      dataToUpdate.avatar = filePath;
    } else if (payload.removeAvatar === 'true') {
      dataToUpdate.avatar = null;
    }

    if (oldAvatarPath && (avatarFile || payload.removeAvatar)) {
      const { error } = await supabase.storage
        .from(config.SUPABASE_AVATAR_BUCKET_NAME)
        .remove([oldAvatarPath]);
      if (error) {
        logger.error('Failed to delete old avatar', {
          path: oldAvatarPath,
          error,
        });
      }
    }
    return prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: { id: true, name: true, email: true, avatar: true },
    });
  },

  updatePassword: async (
    userId: string,
    payload: { currentPassword?: string; newPassword?: string },
  ) => {
    const account = await prisma.account.findFirst({
      where: {
        userId,
        provider: 'credentials',
      },
    });

    if (!account || !account.password) {
      throw new BadRequestError(
        'Password cannot be changed for social accounts or this account type.',
      );
    }

    const isPasswordMatch = await comparePassword(
      payload.currentPassword!,
      account.password,
    );

    if (!isPasswordMatch) {
      throw new BadRequestError('Incorrect current password.');
    }

    const hashedPassword = await hashPassword(payload.newPassword!);

    await prisma.account.update({
      where: {
        provider_providerAccountId: {
          provider: 'credentials',
          providerAccountId: userId,
        },
      },
      data: { password: hashedPassword },
    });
  },
};
