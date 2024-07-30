import { IsString } from "class-validator"

export class OptionDto {
    @IsString()
    title: string

    @IsString()
    description: string
    
    votesCount: number

    pollId: number
}