import React, { useState } from "react";
import { Button as MuiButton, styled } from "@mui/material";
import useUser from "../hooks/useUser";
import NetworkServices from "../services/network.services";

const Button = styled(MuiButton)(({ theme }) => ({
    borderRadius: 100,
    backgroundColor: "#ffccd5",
    color: "#9d0208",
    "&:hover": {
        backgroundColor: "#fddce2"
    }
}));

const LogoutButton = () => {
    const { user, removeUser } = useUser();
    const [confirming, setConfirming] = useState(false);

    const onLogout = async () => {
        // As simple as:
        // -click
        // -sure?
        // -click again on sure
        // -logout!

        if (confirming) {
            const res = await NetworkServices.logout(user.token);
            if (res.status === 200) {
                // logged out!
                removeUser();
                window.location.reload();
            }
        }

        setConfirming(prevConfirming => !prevConfirming);
        setTimeout(() => {
            // reset after 3.5s
            setConfirming(false);
        }, 3500);
    };

    return (
        <Button sx={{ px: 2 }} onClick={onLogout}>
            {confirming ? "Sure?" : "Logout"}
        </Button>
    );
};

export default LogoutButton;
