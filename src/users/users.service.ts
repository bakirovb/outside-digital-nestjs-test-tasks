import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  // constructor(
  //   private usersRepository: Repository<User>,
  //   private jwtService: JwtService,
  // ) {}
  // async create(user: User) {
  //   const saved_user = await this.usersRepository.save(user);
  //   const payload = {
  //     nickname: saved_user.nickname,
  //     email: saved_user.email,
  //     sub: saved_user.uid,
  //   };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //     expire: jwtConstants.expire,
  //   };
  // }
  // async findByEmail(email: string): Promise<User> {
  //   return this.usersRepository.findOne({ where: { email: email } });
  // }
}
