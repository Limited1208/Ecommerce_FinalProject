import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { CreatePaymentUseCase } from './application/use-case/create-payment.use-case';
import { HandleReturnUseCase } from './application/use-case/handle-return.use-case';
import { HandleIpnUseCase } from './application/use-case/handle-ipn.use-case';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.decorator';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { PaymentPresenter } from './presenter/payment.presenter';
import { PaymentProvider } from '@prisma/client';
import type { Request, Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger/dist/decorators/api-bearer.decorator';
import { ConfigService } from '@nestjs/config';

@Controller('payments')
export class PaymentsController {
    constructor(
        private readonly createPayment: CreatePaymentUseCase,
        private readonly handleReturn: HandleReturnUseCase,
        private readonly handleIpn: HandleIpnUseCase,
        private readonly config: ConfigService
    ) { }
    
    @Post(':provider/create')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    async create(@Param('provider') provider: string, @Body() dto: CreatePaymentDto, @GetUser('id') userId: string, @Req() req: Request) {
        const ipAddr = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
            req.socket.remoteAddress ||
            '127.0.0.1';
        const result = await this.createPayment.execute(
            { ...dto, provider: provider.toUpperCase() as PaymentProvider },
            userId,
            ipAddr,
        );
        return PaymentPresenter.toCreateResponse(result.paymentUrl, result.orderId);
    }

    @Get(':provider/return')
    async return(@Param('provider') provider: string, @Query() query: Record<string, any>, @Res() res: Response) {
        const frontendUrl = this.config.get<string>('FRONTEND_URL');
        try{
            const result = await this.handleReturn.execute(provider.toUpperCase() as PaymentProvider, query);
            if (result.success) {
            return res.redirect(302, `${frontendUrl}/order-confirmation?orderId=${result.orderId}`);
        } else {
            return res.redirect(302, `${frontendUrl}/payment-failed?orderId=${result.orderId}`);
        }
        }
        catch(err){
            return res.redirect(302, `${frontendUrl}/order-failed`);
        }
    }

    @Get(':provider/ipn')
    async ipn(@Param('provider') provider: string, @Query() query: Record<string, any>) {
        const result = await this.handleIpn.execute(provider.toUpperCase() as PaymentProvider, query);
        return PaymentPresenter.toIpnResponse(result.code, result.message);
    }
}
