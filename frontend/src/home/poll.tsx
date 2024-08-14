import { Alert, Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Collapse, FormControl, FormControlLabel, Grid, IconButton, Link, Radio, RadioGroup, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import axiosClient from '../services/axiosInstance';
import { Poll, Option } from '../interfaces/interfaces';
import { useParams } from 'react-router-dom';
import Control from '../header/control';
import { useTranslation } from 'react-i18next';
import { ExpandMore } from '@mui/icons-material';
import { red } from '@mui/material/colors';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { format } from 'date-fns';

const PollCard: React.FC = () => {
    const { t } = useTranslation();
    const client = axiosClient();
    const [poll, setPoll] = useState<Poll>();
    const { pollId } = useParams<{ pollId: string }>();
    const [user, setUser] = useState<number>();
    const [winners, setWinners] = useState<Option[]>([]);
    const [maxVotes, setMaxVotes] = useState<number>(0);
    const [cover, setCover] = useState<string>('');
    const [selectedOptions, setSelectedOptions] = useState<number | null>(null);
    const [answerIsOpen, setAnswerIsOpen] = useState<boolean>(false);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const formatDate = (date: any) => {
        return format(new Date(date), 'MMMM dd, yyyy HH:mm:ss');
    };

    useEffect(() => {
        client.get('/users/me').then((response) => {
            if (response.data) {
                setUser(response.data.id);
            }
        })
        client
            .get(`/poll/${pollId}`)
            .then((response) => {
                setPoll(response.data);
                client.get(`/cover/${pollId}`).then((response) => {
                    if (response.data.length !== 0) {
                        const base64Flag = 'data:image/jpeg;base64,';
                        const imageStr = arrayBufferToBase64(response.data[0].image.data);
                        setCover(base64Flag + imageStr);
                    }
                });
                client
                    .get(`/poll/vote/${pollId}`)
                    .then((response) => {
                        if (response.data === true) {
                            setAnswerIsOpen(true);
                            handleResult();
                        }
                    })
            })
            .catch((error) => {
                console.error("Error fetching polls:", error);
            });
    }, []);

    const handleOptionChange = (optionId: number) => {
        setSelectedOptions(optionId);
    };

    const handleResult = () => {
        client
            .get(`/poll/winner/${pollId}`)
            .then((response) => {
                setWinners(response.data);
                setMaxVotes(response.data[0].votesCount);
            })
            .catch((error) => {
                console.error("Error fetching winner:", error);
            });
    }

    const arrayBufferToBase64 = (buffer: any) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const length = bytes.byteLength;
        for (let i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    const handleSubmit = () => {
        if (selectedOptions === null) {
            console.error('No option selected');
            return;
        }

        client.post(`/poll/${user}/${selectedOptions}`, { optionId: selectedOptions })
            .then(() => {
                handleResult();
                setAnswerIsOpen(true);
            })
            .catch((error) => {
                setErrorMessages(error.response.data.message);
                console.error('Error:', error.message);
            });
    };

    return (
        <>
            <Card className="poll-card">
                <CardHeader
                    avatar={<AccountCircleRoundedIcon sx={{ 'color': 'gray' }} />}
                    title={<p className="card-title-1">{poll?.title}</p>}
                    subheader={<p className="card-title-2">{poll?.createdAt}</p>}
                />
                <CardMedia
                    component="img"
                    height="194"
                    image={cover}
                    alt="Poll cover not found"
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {poll?.description}
                    </Typography>
                    {answerIsOpen ? (
                        <p className='info-title'>
                            {t('winnerMessage')}
                            <span className='higlight-title'>
                                {winners.length > 1 && winners.length != 0 ?
                                    <>{winners.map((winner) => winner.title).join(', ')}</>
                                    : <>{winners.map((winner) => winner.title)}</>}
                            </span></p>
                    ) : (
                        <p>{errorMessages}</p>
                    )}
                </CardContent>
                <CardContent>
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <FormControl component="fieldset" disabled={answerIsOpen}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>

                            <RadioGroup
                                aria-label={poll?.title}
                                name={`poll-${pollId}`}
                                value={selectedOptions || ''} >
                                {poll?.options.map(option => (
                                    <FormControlLabel
                                        key={option.id}
                                        value={option.id.toString()}
                                        control={<Radio />}
                                        label={
                                            <div>
                                                {option.title} &#8226; {option.description}
                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                    <Box
                                                        sx={{
                                                            width: 170,
                                                            height: 10,
                                                            backgroundColor: 'grey.300',
                                                            borderRadius: 1,
                                                            position: 'relative'
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                width: `${(option.votesCount / maxVotes) * 100}%`,
                                                                height: '100%',
                                                                background: 'linear-gradient(10deg, #06B6D4, #3B82F6, #8B5CF6)',
                                                                borderRadius: 1,
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>
                                                <Typography variant="caption">
                                                    {option.votesCount}{t('votesMessage')}
                                                </Typography>
                                            </div>
                                        }
                                        onChange={() => handleOptionChange(option.id)}
                                    />
                                ))}
                            </RadioGroup>
                            {answerIsOpen ? (
                                <Alert severity="info">{t('cannotVoteMessage')}</Alert>
                            ) : <></>}
                        </FormControl>
                        <Button sx={{ align: 'center' }}
                            type="submit"
                            variant="outlined"
                            disabled={selectedOptions === null || answerIsOpen}>{t('resultMessage')}</Button>
                    </form>
                </CardContent>
            </Card >
            {/* <div>
                <div className="poll-card">
                    <Control />
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <p className='main-title'>{poll?.title}</p>
                        <div className='subtitle-2'>
                            {poll?.description}<br />
                            {t('linkMessage')}: <Link>{poll?.link}</Link></div>
                        <div key={pollId} className='poll-info'>
                            <FormControl component="fieldset" disabled={answerIsOpen}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>

                                <RadioGroup
                                    aria-label={poll?.title}
                                    name={`poll-${pollId}`}
                                    value={selectedOptions || ''} >
                                    {poll?.options.map(option => (
                                        <FormControlLabel
                                            key={option.id}
                                            value={option.id.toString()}
                                            control={<Radio />}
                                            label={
                                                <div>
                                                    {option.title} &#8226; {option.description}
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                        <Box
                                                            sx={{
                                                                width: 170,
                                                                height: 10,
                                                                backgroundColor: 'grey.300',
                                                                borderRadius: 1,
                                                                position: 'relative'
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    width: `${(option.votesCount / maxVotes) * 100}%`,
                                                                    height: '100%',
                                                                    background: 'linear-gradient(10deg, #06B6D4, #3B82F6, #8B5CF6)',
                                                                    borderRadius: 1,
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: 0
                                                                }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                    <Typography variant="caption">
                                                        {option.votesCount}{t('votesMessage')}
                                                    </Typography>
                                                </div>
                                            }
                                            onChange={() => handleOptionChange(option.id)}
                                        />
                                    ))}
                                </RadioGroup>
                                {answerIsOpen ? (
                                    <p className='tip-title'>{t('cannotVoteMessage')}</p>
                                ) : (<p></p>)}
                            </FormControl>
                        </div>

                        <Button sx={{ align: 'center' }}
                            type="submit"
                            variant="outlined"
                            disabled={selectedOptions === null || answerIsOpen}>{t('resultMessage')}</Button>
                        {answerIsOpen ? (
                            <p className='info-title'>
                                {t('winnerMessage')}
                                <span className='higlight-title'>
                                {winners.length > 1 && winners.length != 0 ?
                                    <>{winners.map((winner) => winner.title).join(', ')}</>
                                    : <>{winners.map((winner) => winner.title)}</>}
                            </span></p>
                        ) : (
                            <p>{errorMessages}</p>
                        )}
                    </form>
                </div>
            </div> */}
        </>
    )
}

export default PollCard