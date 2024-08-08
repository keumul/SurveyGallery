import * as React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useNavigate } from 'react-router-dom';
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { Option, Poll } from "../interfaces/interfaces";
import axiosClient from "../services/axiosInstance";
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';

const Creator: React.FC = () => {
    const client = axiosClient();
    const status = ["active", "closed"];
    const [poll, setPoll] = React.useState<Poll>({
        id: 0,
        title: "",
        description: "",
        type: "poll",
        link: "",
        status: "active",
        coverId: 0,
        options: [],
    })

    const [option, setOption] = React.useState<Option>({
        id: 0,
        title: "",
        description: "",
        pollId: 0,
        votesCount: 0
    });
    const [options, setOptions] = React.useState<Option[]>([]);
    const { t } = useTranslation();
    const [step, setStep] = React.useState(1);
    const [pollId, setPollId] = React.useState(0);
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [previewSrc, setPreviewSrc] = React.useState('');
    const navigation = useNavigate();

    const handleChooseCover = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setSelectedFile(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewSrc('');
        }
    };

    const handleChangePoll = (e: any, field: keyof Poll) => {
        const { value } = e.target;
        setPoll((prevPoll) => ({
            ...prevPoll,
            [field]: value,
        }));
    }

    const handleChangeOption = (e: any, field: keyof Option) => {
        const { value } = e.target;
        setOption((prevOptions) => ({
            ...prevOptions,
            [field]: value,
        }));
    }

    const addOption = () => {
        client.post(`/poll/${pollId}`, option).then(() => {
            client.get(`/poll/option/poll/${pollId}`).then((response) => {
                setOptions(response.data);
            }).catch((error) => {
                console.error("Error fetching options:", error);
            });
        }).catch((error) => {
            console.error("Error creating option:", error);
        });
    }

    const handleSubmit = (e: any) => {
        const buttonName = e.nativeEvent.submitter.name;
        e.preventDefault();
        if (buttonName === "submit-poll") {
            if (poll) {
                client.post("/poll", poll).then((response) => {
                    setPollId(response.data.id);
                    setStep(2);
                }).catch((error) => {
                    console.error("Error creating poll:", error);
                });
            }
        } else if (buttonName === "add-option") {
            addOption();
        } else if (buttonName === "next-step") {
            setStep(3);
        } else if (buttonName === "submit-cover") {
            if (!selectedFile) {
                console.error('No file selected');
                return;
            }
            const formData = new FormData();
            formData.append('photo', selectedFile);

            client.post(`/cover/upload/${pollId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }).then(() => {
                console.log('Cover uploaded successfully');
                navigation(`/poll/${pollId}`);
            })
        }
    }

return (
    <form onSubmit={handleSubmit}>
        <Paper elevation={3}>
            <Box sx={{ padding: 2 }}>
                {step === 1 ? <>
                    <div className="circle-container">
                        <div className="current-circle">1</div>
                        <NavigateNextOutlinedIcon sx={{ color: "gray" }}></NavigateNextOutlinedIcon>
                        <div className="circle">2</div>
                        <NavigateNextOutlinedIcon sx={{ color: "gray" }}></NavigateNextOutlinedIcon>
                        <div className="circle">3</div>
                    </div>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={2}>
                            <InputLabel className="input-label">
                                {t("titleMessage")}
                            </InputLabel>
                        </Grid>
                        <Grid item xs={12} sm={10}>
                            <TextField
                                required
                                id="title"
                                name="title"
                                label={t("titleMessage")}
                                value={poll?.title}
                                fullWidth
                                size="small"
                                autoComplete="off"
                                variant="outlined"
                                onChange={(e) => handleChangePoll(e, 'title')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <InputLabel className="input-label">
                                {t("descriptionMessage")}
                            </InputLabel>
                        </Grid>
                        <Grid item xs={12} sm={10}>
                            <TextField
                                id="description"
                                label={t("descriptionMessage")}
                                value={poll?.description}
                                multiline
                                fullWidth
                                rows={4}
                                onChange={(e) => handleChangePoll(e, 'description')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <InputLabel className="input-label">
                                URL
                            </InputLabel>
                        </Grid>
                        <Grid item xs={12} sm={10}>
                            <TextField
                                required
                                id="url"
                                name="url"
                                label="URL"
                                value={poll?.link}
                                fullWidth
                                size="small"
                                autoComplete="off"
                                variant="outlined"
                                onChange={(e) => handleChangePoll(e, 'link')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <InputLabel className="input-label">
                                {t("statusMessage")}
                            </InputLabel>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="status-label">{t('statusMessage')}</InputLabel>
                                <Select
                                    labelId="status"
                                    id="status"
                                    value={poll?.status}
                                    label={t("statusMessage")}
                                    onChange={(e) => handleChangePoll(e, 'status')}>
                                    {status.map((item) => (
                                        <MenuItem value={item}>{item}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} />
                        <Grid item xs={12} sm={5} />
                        <Grid item xs={12} sm={4}>
                            <Button variant="contained" className="main-button" type="submit" name="submit-poll">
                                {t('nextMessage')}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={5} />
                    </Grid>
                </> : step === 2 ? <>
                    <div className="circle-container">
                        <div className="circle">1</div>
                        <NavigateNextOutlinedIcon sx={{ color: "gray" }}></NavigateNextOutlinedIcon>
                        <div className="current-circle">2</div>
                        <NavigateNextOutlinedIcon sx={{ color: "gray" }}></NavigateNextOutlinedIcon>
                        <div className="circle">3</div>
                    </div>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={2}>
                            <InputLabel className="input-label">
                                {t("titleMessage")}
                            </InputLabel>
                        </Grid>
                        <Grid item xs={12} sm={10}>
                            <TextField
                                required
                                id="title_option"
                                name="title_option"
                                label={t("titleMessage")}
                                value={option?.title}
                                fullWidth
                                size="small"
                                autoComplete="off"
                                variant="outlined"
                                onChange={(e) => handleChangeOption(e, 'title')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <InputLabel className="input-label">
                                {t("descriptionMessage")}
                            </InputLabel>
                        </Grid>
                        <Grid item xs={12} sm={10}>
                            <TextField
                                id="description_option"
                                label={t("descriptionMessage")}
                                value={option?.description}
                                multiline
                                fullWidth
                                rows={4}
                                onChange={(e) => handleChangeOption(e, 'description')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} />
                        <Grid item xs={12} sm={5} />
                        <Grid item xs={12} sm={4}>
                            <Button variant="contained" className="main-button" type="submit" name="add-option">
                                {t('addOptionMessage')}
                            </Button>
                            <Button variant="contained" className="main-button" type="submit" name="next-step">
                                {t('nextMessage')}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={5} />
                    </Grid>
                    <div className='option-list'>
                        <h2>{t('optionsTitleMessage')}</h2>
                        <ul>
                            {options.map((option, index) => (
                                <li key={option.id}><span>{index + 1}</span>
                                    {option.title} - {option.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                </> : <>
                    <div className="circle-container">
                        <div className="circle">1</div>
                        <NavigateNextOutlinedIcon sx={{ color: "gray" }}></NavigateNextOutlinedIcon>
                        <div className="circle">2</div>
                        <NavigateNextOutlinedIcon sx={{ color: "gray" }}></NavigateNextOutlinedIcon>
                        <div className="current-circle">3</div>
                    </div>
                    <Grid item xs={12} sm={2}>
                        <InputLabel className="input-label">
                            {t("coverMessage")}
                        </InputLabel>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleChooseCover(e)}
                            />
                        </Button>
                        {previewSrc && <img src={previewSrc} alt="Preview" width="200" />}
                        <Button variant="contained" className="main-button" type="submit" name="submit-cover">
                            {t('submitMessage')}
                        </Button>
                    </Grid>
                </>
                }
            </Box>
        </Paper>
    </form>
);
};

export default Creator;