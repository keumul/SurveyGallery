import { Container, CssBaseline, Box, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from '../services/axiosInstance';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const client = axiosClient();
    const [info, setInfo] = useState({
        email: "",
        password: "",
        activationCode: "",
    });
    
    const handleChange = (e: any) => {
        const value = e.target.value;
        setInfo({
            ...info,
            [e.target.name]: value
        });
    };

    const handleLogin = (e: any) => {
        e.preventDefault(); 
        const userData = {
            email: info.email,
            password: info.password,
            activationCode: info.activationCode
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
                        mt: 5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>

                    <p className='main-title' style={{'margin':'0px'}}>
                        {t('loginMessage')}</p>
                    <Box sx={{ mt: 1 }}>
                        <TextField
                            required
                            margin="dense"
                            fullWidth
                            id="email"
                            label={t('emailMessage')}
                            name="email"
                            autoFocus
                            value={info.email}
                            onChange={handleChange}
                        />

                        <TextField
                            sx={{ borderColor: "#fffff" }}
                            margin="dense"
                            required
                            fullWidth
                            name="password"
                            label={t('passwordMessage')}
                            type="password"
                            id="password"
                            value={info.password}
                            onChange={handleChange}
                        />
                        <TextField
                            sx={{ borderColor: "#fffff" }}
                            margin="dense"
                            required
                            fullWidth
                            name="activationCode"
                            label={t('codeMessage')}
                            type="activationCode"
                            id="activationCode"
                            value={info.activationCode}
                            onChange={handleChange}
                        />
                        <Button type="submit"
                            variant="contained" className='auth-button' fullWidth>
                            {t("loginMessage")}
                        </Button>
                    </Box>
                </Box>
            </Container>
            </form>
        </>
    );
}

export default Login;
