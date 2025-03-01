//https://github.com/prisma/prisma/issues/8558
/* When upgrading Next to version 12, the curriculum page test was failing
 * due to setImmediate not being defined. In the link above, I found a
 * solution that solved that by creating this file and adding the setupFilesAfterEnv
 * key into the jest.config.ts file
 */
global.setImmediate = jest.useRealTimers
