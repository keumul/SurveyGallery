import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PollDto } from './dto/poll.dto';
import { OptionDto } from './dto/option.dto';
import { VoteDto } from './dto/vote.dto';

@Injectable()
export class PollService {
    constructor(private readonly prisma: PrismaService) { }

    async findAllPolls() {
        try {
            return await this.prisma.poll.findMany();
        } catch (error) {
            console.log(error);
        }
    }

    async findPoll(id: number) {
        try {
            return await this.prisma.poll.findFirst({
                where: { id },
                include: {
                    options: true
                }
            });
        } catch (error) {
            console.log('Error when fetching the survey:', error);
        }
    }

    async createPoll(user, dto: PollDto) {
        try {
            const poll = await this.prisma.poll.create({
                data: {
                    title: dto.title,
                    description: dto.description,
                    status: dto.status,
                    type: dto.type,
                    creatorId: +user.id
                }
            });
            return poll;
        } catch (error) {
            console.log('Error when creating the survey:', error);
        }
    }

    async createOption(id: number, dto: OptionDto) {
        try {
            const poll = await this.prisma.poll.findFirst({
                where: { id: +id }
            });

            if (!poll) {
                console.error('Poll not found!');
                return;
            } else {
                const point = await this.prisma.option.create({
                    data: {
                        title: dto.title,
                        description: dto.description,
                        votesCount: 0,
                        pollId: +id
                    }
                });
                return point;
            }
        } catch (error) {
            console.log('Error when creating the point:', error);
        }
    }

    async addVote(user, optionId: number) {
        try {
            const userVote = await this.prisma.vote.create({
                data: {
                    userId: +user.id,
                    optionId: optionId
                }
            });

            await this.prisma.option.update({
                where: { id: +optionId },
                data: {
                    votesCount: {
                        increment: 1
                    }
                }
            });
            return userVote;
        } catch (error) {
            console.log('Error when adding a vote:', error);
        }
    }

    async updatePoll(id: number, dto: PollDto) {
        try {
            const poll = await this.prisma.poll.findFirst({
                where: { id }
            });

            if (!poll) {
                console.error('Poll not found!');
                return;
            } else {
                return await this.prisma.poll.update({
                    where: { id },
                    data: {
                        title: dto.title,
                        description: dto.description
                    }
                });
            }
        } catch (error) {
            console.log('Error when updating the survey:', error);
        }
    }

    async updateOption(id: number, dto: OptionDto) {
        try {
            const option = await this.prisma.option.findFirst({
                where: { id }
            });

            if (!option) {
                console.error('Option not found!');
                return;
            } else {
                return await this.prisma.option.update({
                    where: { id },
                    data: {
                        title: dto.title,
                        description: dto.description
                    }
                });
            }
        } catch (error) {
            console.log('Error when updating the point:', error);
        }
    }

    // async updateVote(id: number, dto: VoteDto) {
    //     try {
    //         const prevvote = await this.prisma.vote.findFirst({
    //             where: { id }
    //         });

    //         if (!prevvote) {
    //             console.error('Vote not found!');
    //             return;
    //         } else {
    //             const newvote = await this.prisma.vote.update({
    //                 where: { id },
    //                 data: {
    //                     userId: +dto.userId,
    //                     optionId: +dto.optionId
    //                 }
    //             });

    //             await this.prisma.option.update({
    //                 where: { id: +dto.optionId },
    //                 data: {
    //                     votesCount: {
    //                         increment: 1
    //                     }
    //                 }
    //             });

    //         }
    
    //     } catch (error) {
    //         console.log('Error when updating the survey:', error);
    //     }
    // }

    async closePoll(id: number) {
        try {
            const poll = await this.prisma.poll.findFirst({
                where: { id }
            });

            if (!poll) {
                console.error('Poll not found!');
                return;
            } else {
                return await this.prisma.poll.update({
                    where: { id },
                    data: {
                        status: 'closed'
                    }
                });
            }
        } catch (error) {
            console.log('Error when closing the survey:', error);
        }
    }

    async openPoll(id: number) {
        try {
            const poll = await this.prisma.poll.findFirst({
                where: { id }
            });

            if (!poll) {
                console.error('Poll not found!');
                return;
            } else {
                return await this.prisma.poll.update({
                    where: { id },
                    data: {
                        status: 'active'
                    }
                });
            }
        } catch (error) {
            console.log('Error when opening the survey:', error);
        }
    }

    async deletePoll(id: number) {
        try {
            const poll = await this.prisma.poll.findFirst({
                where: { id }
            });

            if (!poll) {
                console.error('Poll not found!');
                return;
            } else {
                return await this.prisma.poll.delete({
                    where: { id }
                });
            }
        } catch (error) {
            console.log('Error when deleting the survey:', error);
        }
    }

    async deleteOption(id: number) {
        try {
            const option = await this.prisma.option.findFirst({
                where: { id }
            });

            if (!option) {
                console.error('Option not found!');
                return;
            } else {
                return await this.prisma.option.delete({
                    where: { id }
                });
            }
        } catch (error) {
            console.log('Error when deleting the point:', error);
        }
    }
}
