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

        // 1. Find out if this GitHub account already exists in the DB
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

        // 2. If you don't have a GitHub account, check if the email already exists.
        const existingUser = await prisma.user.findUnique({
          where: {
            email: githubEmail,
          },
        });

        // If the user already exists (e.g. registered with email/password)
        // -> Link this GitHub account to that user
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

        // 3. If both user and account do not exist -> Create completely new
        const newUser = await prisma.user.create({
          data: {
            email: githubEmail,
            name: profile.displayName || profile.username,
            avatar: profile.photos?.[0]?.value,
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
