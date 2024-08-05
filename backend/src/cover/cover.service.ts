import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CoverService {
    constructor(private readonly prisma: PrismaService) { }

    async uploadCover(id: number, uploadedPhoto: any) {
        try {
            const existingCover = await this.getCover(id);
            if (existingCover.length > 0) {
                await this.deleteCover(existingCover[0].id);
            }
            await this.prisma.cover.create({
                data: {
                    image: uploadedPhoto.buffer,
                    pollId: +id,
                }
            });
        } catch (error) {
            console.log('Error when uploading the cover:', error);
        }
    }

    async getCover(id: number) {
        try {
            return await this.prisma.cover.findMany({
                where: {
                    pollId: +id
                },
                select: {
                    id: true,
                    image: true,
                }
            });
        } catch (error) {
            console.log('Error when fetching the cover:', error);
        }
    }

    async showCover(id: number) {
        try {
            return await this.prisma.cover.findFirst({
                where: {
                    pollId: +id
                },
                select: {
                    image: true
                }
            });
        } catch (error) {
            console.log('Error when showing the cover:', error);
        }
    }

    async deleteCover(id: number) {
        try {
            return await this.prisma.cover.delete({
                where: {
                    id: +id,
                }
            });
        } catch (error) {
            console.log('Error when deleting the cover:', error);
        }
    }
}
