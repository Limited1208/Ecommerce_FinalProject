import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatService } from './stats.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StatResponse } from './dto/stat-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.decorator';
import { RoleGuard } from '../auth/guards/role.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
    constructor(private readonly statService: StatService){}

    @Get()
    @UseGuards(JwtAuthGuard, RoleGuard)
    @ApiBearerAuth('JWT-auth')
    @Roles(Role.Admin)
    @ApiOperation({
        summary: 'Stat of e-commerce'
    })
    async stat() : Promise<StatResponse>{
        return await this.statService.getStat()
    }
}
