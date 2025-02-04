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
  totalAwards: true,
  phone: true,
  balance: true,
  referralLink: true,
  leads: true,
  offerId: true,         
  balanceToAwait: true,
  withdraws: true,
};
