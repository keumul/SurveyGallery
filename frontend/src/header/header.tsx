import React, { useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import AddToPhotosRoundedIcon from '@mui/icons-material/AddToPhotosRounded';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import BallotRoundedIcon from '@mui/icons-material/BallotRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import axiosClient from '../services/axiosInstance';
import { User } from '../interfaces/interfaces';

const Header: React.FC = () => {
    const client = axiosClient();
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const [user, setUser] = React.useState<User>();

    useEffect(() => {
        // getUser();
    })

    const getUser = () => {
        client.get('/users/me').then((response) => {
            setUser(response.data);
        }).catch((error) => {
            console.error("Error fetching user:", error);
        }
        );
    }

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpenDrawer(newOpen);
    };

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <Box>
                <Typography variant="h6" sx={{ textAlign: 'center', margin: '20px 0 0 0' }}>Hello,
                    <span className='main-span'>{user?.FIO}</span>!</Typography>
            </Box>
            <List>
                {['Add poll', 'Edit polls', 'All polls'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        {index === 0 ? <ListItemButton component={Link} to="/login">
                            <AddToPhotosRoundedIcon />
                            <ListItemText primary={text} sx={{ margin: '0 0 0 30px' }} />
                        </ListItemButton> :
                            index === 1 ? <ListItemButton component={Link} to="/editor">
                                <AutoFixHighRoundedIcon />
                                <ListItemText primary={text} sx={{ margin: '0 0 0 30px' }} />
                            </ListItemButton> :
                                <ListItemButton component={Link} to="/home">
                                    <BallotRoundedIcon />
                                    <ListItemText primary={text} sx={{ margin: '0 0 0 30px' }} />
                                </ListItemButton>}
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['Statistic'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <AssessmentRoundedIcon /> : <AddToPhotosRoundedIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <AppBar position="static"
            sx={{ background: 'linear-gradient(10deg, #06B6D4, #3B82F6, #8B5CF6)' }}>
            <Toolbar>
                <IconButton onClick={toggleDrawer(true)}
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                ><MenuIcon /></IconButton>
                <Drawer open={openDrawer} onClose={toggleDrawer(false)}>
                    {DrawerList}
                </Drawer>

                <Typography variant="h6"
                    sx={{
                        flexGrow: 1,
                        textDecoration: 'none',
                        color: 'white',
                    }} component={Link} to="/home"
                >
                    Survey Gallery
                </Typography>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/register">Register</Button>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
