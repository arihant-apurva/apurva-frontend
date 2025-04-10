import React from "react";
import { useState } from "react";
import Notification from "../../Modules/Notification";
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Stack,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setLoggedIn } = useAuth();

    // Function to handle form submission
    const submitHandler = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Allows sending cookies
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                setLoggedIn(true); // Set loggedIn state to true
                Notification.success(data.message);
            } else {
                Notification.error(data.message);
            }
        } catch (error) {
            Notification.error("An error occurred. Please try again later.");
        }
    }


    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#f5f5f5",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Paper elevation={4} sx={{ p: 4, width: 450, borderRadius: 3 }}>
                <Typography variant="h5" textAlign="center" mb={3} color="primary">
                    Login
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    <Button variant="contained" color="primary" fullWidth onClick={submitHandler}>
                        Login
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
}
