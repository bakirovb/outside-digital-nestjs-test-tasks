import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TagsModule } from 'src/tags/tags.module';
import { UserTagController } from './user-tag.controller';
import { UserTagService } from './user-tag.servise';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    TagsModule,
  ],
  controllers: [UsersController, UserTagController],
  providers: [UsersService, UserTagService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
