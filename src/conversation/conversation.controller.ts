import { Controller, Post, Body, Res, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { ConversationService } from './conversation.service';
import { PrismaService } from 'src/prisma.service';
import { ReferralLinkService } from 'src/referral-link/referral-link.service';


@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService, 
    private referralLinkService: ReferralLinkService, private prisma: PrismaService) {}

  @Post()
  async receivePartnerId(@Body() body: { reff: string, unique: boolean }, @Res() res: Response): Promise<void> {
    const { reff, unique } = body;

    const reffLink = await this.referralLinkService.getLinkByHash(reff);
    if (!reffLink) {
      res.json({ message: 'Link not found' })
      throw new BadRequestException('Referral link not found');
    }   

    // Обновляем просмотры ссылки         
    const updatedLink = await this.prisma.referralLink.update({
      where: {id: reffLink.id},  
      data: {viewCount: {increment: 1}, viewUniqueCount: unique ? {increment: 1} : reffLink.viewUniqueCount }
      
    })

    // Отправка ответа обратно на фронтенд
    res.json({ message: 'Data received successfully', views: updatedLink.viewCount, uniqueViews: updatedLink.viewUniqueCount });
  }
}
