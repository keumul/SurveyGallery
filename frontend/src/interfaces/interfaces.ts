interface User {
    FIO: string;
    phoneNumber: string;
    email: string;
    password: string;
    role: string;
    isConfirmed: boolean;
    activationCode: string;
}

interface Poll {
    id: number;
    title: string;
    description: string;
    status: string;
    type?: string;
    creatorId?: number;
    link: string;
    coverId: number;
    options: Option[];
    createdAt: string;
}

interface Option {
    id: number;
    title: string;
    description: string;
    votesCount: number;
    pollId: number;
}

interface Vote {
    userId: number;
    optionId: number;
}


export type { Poll, Option, Vote, User };
