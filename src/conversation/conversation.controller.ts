import { Controller, Post, Body, Res, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { ConversationService } from './conversation.service';
import { PrismaService } from 'src/prisma.service';
import { ReferralLinkService } from 'src/referral-link/referral-link.service';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';


@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService, 
    private referralLinkService: ReferralLinkService, private prisma: PrismaService) {}

  @Post()
  @Auth()
  async receivePartnerId(@Body() body: { add: string, unique: boolean }, @Res() res: Response, @CurrentUser('id') userId: number) {
    const { add, unique } = body;

    const reffLink = await this.referralLinkService.getLinkByHash(add, userId);
    if (!reffLink) {
      res.json({ message: 'Link not found' })
      throw new BadRequestException('Referral link not found');
    }   

    // Обновляем просмотры ссылки         
    const updatedLink = await this.prisma.referralLink.update({
      where: {id: reffLink.id, userId},  
      data: {viewCount: {increment: 1}, viewUniqueCount: unique ? {increment: 1} : reffLink.viewUniqueCount }
      
    })

    // Отправка ответа обратно на фронтенд
    res.json({ message: 'Data received successfully', views: updatedLink.viewCount, uniqueViews: updatedLink.viewUniqueCount });
  }
}
