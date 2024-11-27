import { Prisma } from '@prisma/client';

export const returnPartnerObject: Prisma.PartnerSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  lastname: true,
  email: true,
  registerDate: true,
  status: true,
};

