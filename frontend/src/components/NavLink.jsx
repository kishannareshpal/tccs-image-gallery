import { Link as MuiLink, styled } from "@mui/material";

const NavLink = styled(MuiLink, {
    shouldForwardProp: prop => !["black", "active"].includes(prop)
})(({ black, active, theme }) => ({
    borderRadius: 100,
    padding: "8px 16px",
    backgroundColor: black ? "#000" : "transparent",
    color: black ? "#fff" : "#000",
    ...(active && {
        color: theme.palette.primary.main,
        fontWeight: 800
    })
}));

export default NavLink;
