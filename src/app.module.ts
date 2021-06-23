import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'BubaBuba',
      database: 'outside_digital_test_tasks_db',
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['migration/*.js'],
      cli: {
        migrationsDir: 'migration',
      },
      namingStrategy: new SnakeNamingStrategy(),
    }),
    UsersModule,
    TagsModule,
    AuthModule,
  ],
})
export class AppModule {}
