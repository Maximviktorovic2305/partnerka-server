import { Prisma } from '@prisma/client';

export const returnUserObject: Prisma.UserSelect = {
  id: true,
  name: true,
  lastname: true,
  email: true,
  password: false,
  isAdmin: true,
};
