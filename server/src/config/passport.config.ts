/**
 * Node modules
 */
import passport from 'passport';
import { Profile } from 'passport-github2';
import { AccountType, Provider } from '@prisma/client';
import { Strategy as GitHubStrategy } from 'passport-github2';

/**
 * Configs
 */
import config from '@/config/env.config';

/**
 * Libs
 */
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';

/**
 * Services
 */
import { userService } from '@/services/user.service';

passport.use(
  new GitHubStrategy(
    {
      clientID: config.GITHUB_CLIENT_ID,
      clientSecret: config.GITHUB_CLIENT_SECRET,
      callbackURL: `${config.API_URL}/auth/github/callback`,
      scope: ['user:email'],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: any, user?: any, info?: any) => void,
    ) => {
      try {
        const githubEmail = profile.emails?.[0]?.value;

        if (!githubEmail) {
          return done(
            new Error(
              'Github email not available. Please make your email public.',
            ),
            false,
          );
        }

        const account = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: Provider.github,
              providerAccountId: profile.id,
            },
          },
          include: {
            user: true,
          },
        });

        if (account) {
          logger.info(`Github user logged in: ${account.user.email}`);
          return done(null, account.user);
        }

        const existingUser = await prisma.user.findUnique({
          where: {
            email: githubEmail,
          },
        });

        if (existingUser) {
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              provider: Provider.github,
              type: AccountType.oauth,
              providerAccountId: profile.id,
              access_token: accessToken,
              refresh_token: refreshToken,
            },
          });
          logger.info(
            `Linked Github account to existing user: ${existingUser.email}`,
          );
          return done(null, existingUser);
        }

        let avatarPath: string | undefined = undefined;
        const githubAvatarUrl = profile.photos?.[0]?.value;
        if (githubAvatarUrl) {
          try {
            avatarPath = await userService.downloadImageAndUploadToStorage(
              githubAvatarUrl,
              profile.id,
            );
          } catch (uploadError) {
            logger.error('Failed to process GitHub avatar', uploadError);
          }
        }

        const newUser = await prisma.user.create({
          data: {
            email: githubEmail,
            name: profile.displayName || profile.username,
            avatar: avatarPath,
            accounts: {
              create: {
                provider: Provider.github,
                type: AccountType.oauth,
                providerAccountId: profile.id,
                access_token: accessToken,
                refresh_token: refreshToken,
              },
            },
          },
        });

        logger.info(`New user register via Github: ${newUser.email}`);
        return done(null, newUser);
      } catch (error) {
        logger.error('Error in Github strategy', error);
        return done(error, false);
      }
    },
  ),
);

export default passport;
