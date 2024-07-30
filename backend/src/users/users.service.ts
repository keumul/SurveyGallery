import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async findAllUsers() {
    try {
      return await this.prisma.user.findMany();
    }
    catch (error) {
      console.error('Error when fetching a users: ', error);
    }
  }

  async findUser(id: number) {
    try {
      return await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error('Error when fetching a user: ', error);
    }
  }

  async updateUser(id: number, dto: UserDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id,
        },
      });
      if (user) {
        return await this.prisma.user.update({
          where: {
            id,
          },
          data: {
            ...dto,
          },
        });
      } else {
        console.error('User not found!');
      }
    } catch (error) {
      console.error('Error when updating a user: ', error);
    }
  }

  async removeUser(id: number) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id,
        },
      });

      if (user) {
        return await this.prisma.user.delete({
          where: {
            id,
          },
        });
      } else {
        console.error('User not found!');
      }
    } catch (error) {
      console.error('Error when deleting a user: ', error);
    }
  }
}
