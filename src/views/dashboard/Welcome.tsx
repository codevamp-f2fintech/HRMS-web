import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Typography from '@mui/material/Typography'; // Assuming you're using MUI for Typography
import { Box, Card, CardContent, CircularProgress, styled } from '@mui/material';
import helloImg from '../../assets/helloImg.png'

const Welcome: React.FC = () => {
    const [userData, setUserData] = useState<any>(null);


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || '{}');
        console.log("User", user.role);

        const fetchUserData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/employees/get/${user.id}`);
                const data = await response.json();

                setUserData(data);
                console.log("res>>", data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (user.id) {
            fetchUserData();
        }
    }, []);

    const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    return (
        <Card>
            <CardContent className='flex  relative items-start'>
                <div>

                    <Typography variant="h1" sx={{
                        fontSize: '3rem',
                        fontWeight: '700',
                        color: '#8C57FF',
                        textAlign: 'center',
                        letterSpacing: 1
                    }}>
                        Welcome!
                    </Typography>
                    {userData ? (
                        <div>

                            <Typography variant="h3" sx={{
                                fontSize: '2.5rem',
                                fontWeight: '500',
                                textAlign: 'center',
                            }}>
                                {capitalizeFirstLetter(userData.first_name)} {capitalizeFirstLetter(userData.last_name)}
                            </Typography>
                            <Typography variant="h5" sx={{
                                fontSize: '0.75 rem',
                            }} className='text-zinc-500' >
                                {capitalizeFirstLetter(userData.designation)}
                            </Typography>
                        </div>

                    ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
                            <CircularProgress />
                        </Box>
                    )}
                </div>
                <div>
                    <Image src={helloImg} alt='hello' style={{ width: "50vh", height: "50vh" }} />
                </div>
            </CardContent>
        </Card >
    )
};

export default Welcome;
