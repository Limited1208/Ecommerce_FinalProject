import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  
  //Set global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )
  
  app.enableCors({
    origin: process.env.ALLOW_ORIGIN?.split(',') ?? 'localhost://5173',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTION"],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
  });


  const config = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('Ecommerce API description')
    .setVersion('3.1.0')
    .addTag('auth', 'Authentication related endpoints')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
      'JWT-auth'
    )
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
      'JWT-refresh'
    )
    .addServer('http://localhost:8080/', 'Development server')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Ecommerce API',
    customfavIcon: 'https://nestjs.com/Logo_NestJS.svg',
    customCss: `
    .swagger-ui .topbar {
      display: none;
    }

      .swagger-ui . info {
        margin: 50px 0
      }

    .swagger-ui .info .title{
    color: #fd0000ff
    }
    `
  });

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap().catch((error) => {
  Logger.error('Error starting server', error)
  process.exit(1);
});
