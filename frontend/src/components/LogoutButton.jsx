import React, { useState } from "react";
import { Button as MuiButton, styled, lighten } from "@mui/material";
import useUser from "../hooks/useUser";
import NetworkServices from "../services/network.services";

const Button = styled(MuiButton, {
    shouldForwardProp: prop => prop !== "confirming"
})(({ confirming }) => ({
    borderRadius: 100,
    border: "2px solid #dfdfdf",
    color: "#000",
    padding: "4px 16px",
    "&:hover": {
        color: "#DD1C1A",
        backgroundColor: "#fddce2",
        borderColor: "#fddce2"
    },
    ...(confirming && {
        borderColor: "#DD1C1A",
        backgroundColor: "#DD1C1A",
        color: "#fff",
        "&:hover": {
            backgroundColor: lighten("#DD1C1A", 0.2)
        }
    })
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
        <Button confirming={confirming} onClick={onLogout}>
            {confirming ? "Sure?" : "Logout"}
        </Button>
    );
};

export default LogoutButton;
