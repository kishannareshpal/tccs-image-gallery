import {
    Dialog as MuiDialog,
    DialogContent as MuiDialogContent,
    DialogActions as MuiDialogActions,
    Button,
    Typography,
    styled,
    darken
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
    shouldForwardProp: props =>
        !["confirmType", "cancelType", "negativeType"].includes(props)
})(({ negativeType, confirmType, cancelType }) => ({
    borderRadius: 12,
    textTransform: "none",
    ...(confirmType && {
        backgroundColor: "#000",
        color: "#fff",
        "&:hover": {
            backgroundColor: "#242424",
            color: "#fff"
        },
        "&:disabled": {
            color: "#949494",
            border: "1px solid #e6e6e6",
            background: darken("#fff", 0.01)
        }
    }),
    ...(negativeType && {
        backgroundColor: "#e73511",
        color: "#fff",
        "&:hover": {
            backgroundColor: "#c53f25",
            color: "#fff"
        },
        "&:disabled": {
            color: "#949494",
            border: "1px solid #e6e6e6",
            background: darken("#fff", 0.01)
        }
    }),
    ...(cancelType && {
        backgroundColor: "#EFF1F6",
        color: "#000",
        "&:hover": {
            backgroundColor: "#e9eaed",
            color: "#000"
        },
        "&:disabled": {
            color: "#949494",
            border: "1px solid #e6e6e6",
            background: darken("#fff", 0.01)
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
