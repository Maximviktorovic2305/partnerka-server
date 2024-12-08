import { Prisma } from '@prisma/client';

export const returnReferralLinkObject: Prisma.ReferralLinkSelect = {
  id: true,
  createdFormatedDate: true,
  updatedFormatedDate: true,
  partnerId: true,
  partner: true,
  devicesId: true,
  name: true         
};
