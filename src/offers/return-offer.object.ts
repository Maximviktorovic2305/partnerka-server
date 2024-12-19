import { Prisma } from '@prisma/client';

export const returnOfferObject: Prisma.OfferSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  domain: true,
  conversions: true,
  amount: true,
  status: true,
  partners: true,
  refferalLinks: true,         
  partnersCount: true,

};
