import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PollService } from './poll.service';
import { PollDto } from './dto/poll.dto';
import { OptionDto } from './dto/option.dto';
import { User } from '@prisma/client';
import { GetUser } from "src/auth/decorator";
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { VoteDto } from './dto/vote.dto';

@UseGuards(JwtGuard)
@Controller('api/poll')
export class PollController {
    constructor(private readonly pollService: PollService) { }

    @Get()
    findAllPolls() {
        return this.pollService.findAllPolls();
    }

    @Get(':id')
    findPoll(@Param('id') id: string) {
        return this.pollService.findPoll(+id);
    }

    @Get('winner/:id')
    currentWinner(@Param('id') id: string) {
        return this.pollService.currentResult(+id);
    }

    @Get('option/:id')
    findPollByOptionId(@Param('id') id: string) {
        return this.pollService.findPollByOptionId(+id);
    }

    @Get('option/poll/:id')
    findAllOptionsByPoll(@Param('id') id: string) {
        return this.pollService.findAllOptions(+id);
    }

    @Post()
    createPoll(@GetUser() user: User, @Body() pollDto: PollDto) {
        return this.pollService.createPoll(user, pollDto);
    }

    @Post(':id')
    createOption(@Param('id') id: string, @Body() optionDto: OptionDto) {
        return this.pollService.createOption(+id, optionDto);
    }

    @Post(':userId/:optionId')
    addVote(@GetUser() user: User, @Param() params: any) {
        return this.pollService.addVote(user, +params.optionId);
    }

    @Patch(':id')
    updatePoll(@Param('id') id: string, @Body() pollDto: PollDto) {
        return this.pollService.updatePoll(+id, pollDto);
    }

    @Patch('option/:id')
    updateOption(@Param('id') id: string, @Body() optionDto: OptionDto) {
        return this.pollService.updateOption(+id, optionDto);
    }

    @Get('vote/:pollId')
    alreadyVoted(@GetUser() user: User, @Param('pollId') id: string) {
        return this.pollService.alreadyVoted(user, +id);
    }

    // @Patch('vote/:id')
    // updateVote(@Param('id') id: string, @Body() voteDto: VoteDto) {
    //     return this.pollService.updateVote(+id, voteDto);
    // }

    @Patch('close/:id')
    closePoll(@Param('id') id: string) {
        return this.pollService.closePoll(+id);
    }

    @Patch('open/:id')
    openPoll(@Param('id') id: string) {
        return this.pollService.openPoll(+id);
    }

    @Delete(':id')
    deletePoll(@Param('id') id: string) {
        return this.pollService.deletePoll(+id);
    }

    @Delete('option/:id')
    deleteOption(@Param('id') id: string) {
        return this.pollService.deleteOption(+id);
    }
    
}
