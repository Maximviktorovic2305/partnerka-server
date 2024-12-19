import { Prisma } from '@prisma/client';

export const returnReferralLinkObject: Prisma.ReferralLinkSelect = {
  id: true,
  createdFormatedDate: true,
  updatedFormatedDate: true,
  partnerId: true,
  partner: true,
  name: true,         
  hash: true,
  viewCount: true,
  viewUniqueCount: true,
  localeLinkPath: true,
  serverLinkPath: true,
  conversions: true,
  amountToAwait: true,
  amountToPay: true,
  offer: true,
  offerId: true,         
};
