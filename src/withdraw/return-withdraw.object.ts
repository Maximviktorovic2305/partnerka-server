import { Prisma } from '@prisma/client';

export const returnWithdrawObject: Prisma.WithdrawSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  createdFormatedDate: true,
  partnerId: true,
  partner: true,
  partnerEmail: true,
  isPaydOut: true,
  comment: true,
  amount: true,         
  leadId: true,         
  lead: true,
  leadName: true         
};
