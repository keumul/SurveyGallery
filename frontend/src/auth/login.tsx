import { BallotRounded } from '@mui/icons-material';
import {
    Container,
    CssBaseline,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from '../services/axiosInstance';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const client = axiosClient();
    const [state, setState] = useState({
        email: "",
        password: "",
        activationCode: "",
    });
    
    const handleChange = (e: any) => {
        const value = e.target.value;
        setState({
            ...state,
            [e.target.name]: value
        });
    };

    const handleLogin = (e: any) => {
        e.preventDefault(); 
        const userData = {
            email: state.email,
            password: state.password,
            activationCode: state.activationCode
        };
        client.post("/auth/login", userData).then((response) => {
            localStorage.setItem('ACCESS_TOKEN', response.data.access_token);
            navigate('/home');
        }).catch((error) => {
            console.error("Error logging in:", error);
        });
    };



    return (
        <>
         <form onSubmit={handleLogin}>
            <Container maxWidth='xs'>
                <CssBaseline />
                <Box
                    sx={{
                        mt: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>

                    <Typography variant='h3'
                        sx={{ color: "#0EA5E9" }}>
                        {t('loginMessage')}</Typography>
                    <Box sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label={t('emailMessage')}
                            name="email"
                            autoFocus
                            value={state.email}
                            onChange={handleChange}
                        />

                        <TextField
                            sx={{ borderColor: "#fffff" }}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label={t('passwordMessage')}
                            type="password"
                            id="password"
                            value={state.password}
                            onChange={handleChange}
                        />
                        <TextField
                            sx={{ borderColor: "#fffff" }}
                            margin="normal"
                            required
                            fullWidth
                            name="activationCode"
                            label={t('codeMessage')}
                            type="activationCode"
                            id="activationCode"
                            value={state.activationCode}
                            onChange={handleChange}
                        />
                        <Button type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, bgcolor: "#0EA5E9" }}
                        >
                            {t("loginMessage")}
                        </Button>
                        <Grid container justifyContent={"flex-end"}>
                            <Grid item>
                                <Link to="/register">Don't have an account? Register</Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
            </form>
        </>
    );
}

export default Login;
