import { Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CoverService } from './cover.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/cover')
export class CoverController {
    constructor(private readonly coverService: CoverService) {}

    @Post('upload/:id')
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
    async deleteCover(@Param('id') id: string) {
        return this.coverService.deleteCover(+id);
    }
}
