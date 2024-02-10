import { Logger } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { createSwaggerDocument, getApp, globalPrefix } from '@ocmi/api/bootstrap';
import * as process from 'process';

async function bootstrap() {
  const app = await getApp();

  const document = createSwaggerDocument(app);

  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);
  const cors ={
    origin: ['http://localhost:3000', 'http://localhost:4200'],
    methods: 'GET, HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
  }
  app.enableCors(cors);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
