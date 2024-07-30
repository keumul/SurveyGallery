import { IsString } from "class-validator";

export class PollDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    status: string;

    @IsString()
    type: string;

    creatorId: number;

    link: string;

    coverId: number;
}