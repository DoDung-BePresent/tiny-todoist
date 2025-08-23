import { Request, Response, NextFunction } from 'express';
import { STATUS_CODE } from '@/constants/error.constant';
import { asyncHandler } from '@/middlewares/error.middleware';

export const userController = {
  getMe: asyncHandler(async (req, res, next) => {
    const userProfile = req.user;

    res.status(STATUS_CODE.OK).json({
      message: 'Profile fetched successfully',
      data: {
        user: userProfile,
      },
    });
  }),
};
