import { Prisma } from '@prisma/client';

export const returnLeadObject: Prisma.LeadSelect = {
  id: true,
  createdFormatedDate: true,
  updatedFormatedDate: true,
  name: true,
  sourse: true,
  status: true,
  offer: true,
  amount: true,
  partnerId: true,
  partner: true,
};
