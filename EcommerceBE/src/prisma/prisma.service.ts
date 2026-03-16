import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    constructor() {
        const adapter = new PrismaPg({
            connectionString: process.env.DATABASE_URL,
        });
        super({
            adapter,
            log:
                process.env.NODE_ENV === 'development'
                    ? ['query', 'info', 'warn']
                    : ['error'],
        });
    }
    async onModuleDestroy() {
        await this.$disconnect();
        console.log('Prisma disconnected');
    }
    async onModuleInit() {
        await this.$connect();
        console.log('Prisma connected');
    }

    async cleanDatabase() {
        if (process.env.NODE_ENV === 'development') {
            throw new Error('Cannot clean database in development mode');
        }

        const models = Reflect.ownKeys(this).filter(
            (key) => typeof key === 'string' && key.endsWith('_'),
        );

        return Promise.all(
            models.map((modelKey) => {
                if (typeof modelKey === 'string') {
                    const model = (this as any)[modelKey];
                    if(model?.deleteMany){
                        return model.deleteMany();
                    }
                }
            }),
        );
    }
}
