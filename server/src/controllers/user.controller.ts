/**
 * Configs
 */
import config from '@/config/env.config';

/**
 * Constants
 */
import { STATUS_CODE } from '@/constants/error.constant';

/**
 * Middlewares
 */
import { asyncHandler } from '@/middlewares/error.middleware';

/**
 * Libs
 */
import { supabase } from '@/lib/supabase';

/**
 * Services
 */
import { userService } from '@/services/user.service';

export const userController = {
  getMe: asyncHandler(async (req, res) => {
    const user = req.user!;

    if (user.avatar) {
      const { data } = supabase.storage
        .from(config.SUPABASE_AVATAR_BUCKET_NAME)
        .getPublicUrl(user.avatar);
      user.avatar = data.publicUrl;
    }

    res.status(STATUS_CODE.OK).json({
      message: 'Profile fetched successfully',
      data: {
        user,
      },
    });
  }),

  updateProfile: asyncHandler(async (req, res) => {
    const { id: userId } = req.user!;
    const payload = req.body;
    const avatarFile = req.file;

    const updatedUser = await userService.updateProfile(
      userId,
      payload,
      avatarFile,
    );

    if (updatedUser.avatar) {
      const { data } = supabase.storage
        .from(config.SUPABASE_AVATAR_BUCKET_NAME)
        .getPublicUrl(updatedUser.avatar);
      updatedUser.avatar = data.publicUrl;
    }

    res.status(STATUS_CODE.OK).json({
      message: 'Profile updated successfully!',
      data: updatedUser,
    });
  }),

  updatePassword: asyncHandler(async (req, res) => {
    const { id: userId } = req.user!;
    const payload = req.body;

    await userService.updatePassword(userId, payload);

    res.status(STATUS_CODE.OK).json({
      message: 'Password updated successfully!',
    });
  }),
};
