import { Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CoverService } from './cover.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard, JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('api/cover')
export class CoverController {
    constructor(private readonly coverService: CoverService) {}

    @Post('upload/:id')
    @UseGuards(AdminGuard)
    @UseInterceptors(FileInterceptor('photo'))
    async uploadCover(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
        return this.coverService.uploadCover(+id, file);
    }

    @Get(':id')
    async getCover(@Param('id') id: string) {
        return this.coverService.getCover(+id);
    }

    @Get()
    async getCovers() {
        return this.coverService.getCovers();
    }

    @Get('show/:id')
    async showCover(@Param('id') id: string) {
        return this.coverService.showCover(+id);
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    async deleteCover(@Param('id') id: string) {
        return this.coverService.deleteCover(+id);
    }
}
