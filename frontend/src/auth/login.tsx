import { BallotRounded } from '@mui/icons-material';
import {
    Container,
    CssBaseline,
    Box,
    Avatar,
    Typography,
    TextField,
    Button,
    Grid,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from '../services/axiosInstance';
export const metadata = {
    title: "Login | Survey Gallery"
};

const Login: React.FC = () => {
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
            console.log(response.status, response.data);
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
                    {/* <Avatar
                        sx={{ m: 1, bgcolor: "#0EA5E9" }}>
                        <BallotRounded />
                    </Avatar> */}

                    <Typography variant='h3'
                        sx={{ color: "#0EA5E9" }}>
                        Login</Typography>
                    <Box sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
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
                            label="Password"
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
                            label="Activation Code"
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
                            Login
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
