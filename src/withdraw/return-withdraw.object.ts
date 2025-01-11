import { Prisma } from '@prisma/client';

export const returnWithdrawObject: Prisma.WithdrawSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  createdFormatedDate: true,
  partnerId: true,
  partner: true,
  partnerEmail: true,
  comment: true,
  amount: true,
};
