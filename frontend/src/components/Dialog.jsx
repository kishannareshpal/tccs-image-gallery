import {
    Dialog as MuiDialog,
    DialogContent as MuiDialogContent,
    DialogActions as MuiDialogActions,
    Button,
    Typography,
    styled
} from "@mui/material";

/* -------------------------------------------------------------------------- */
/*                          Styled Dialog Components                          */
/* -------------------------------------------------------------------------- */

const Dialog = styled(MuiDialog)({
    "& .MuiPaper-root": {
        borderRadius: 16
    }
});

const DialogActionButton = styled(Button, {
    shouldForwardProp: props => !["confirm", "cancel"].includes(props)
})(({ confirm, cancel }) => ({
    borderRadius: 12,
    textTransform: "none",
    ...(confirm && {
        backgroundColor: "#000",
        color: "#fff",
        "&:hover": {
            backgroundColor: "#242424",
            color: "#fff"
        }
    }),
    ...(cancel && {
        backgroundColor: "#EFF1F6",
        color: "#6E7074",
        "&:hover": {
            backgroundColor: "#e9eaed",
            color: "#6E7074"
        }
    })
}));

const DialogTitle = styled(Typography)({
    padding: "24px 24px 0 24px",
    fontWeight: 800
});

const DialogContent = styled(MuiDialogContent)({
    paddingTop: 24
});

const DialogActions = styled(MuiDialogActions)({
    padding: "16px 24px",
    justifyContent: "center"
});

export {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    DialogActionButton
};
