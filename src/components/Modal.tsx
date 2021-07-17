import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Button, IconButton, Typography } from '@material-ui/core';
import MuiDialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme: any) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    }
}));

const Dialog = withStyles((theme) => ({
    paper: {
        maxWidth: 'unset'
    }
}))(MuiDialog);

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    }
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    }
}))(MuiDialogActions);

interface ModalProps {
    open: boolean,
    onClose: (() => void) | undefined,
    title: string | undefined,
    children: any,
    [x: string]: any,
    confirmButton?: string,
    cancelButton?: string,
    confirmAction?: (() => void),
    cancelAction?: (() => void),
    dialogActions?: any
}

export default function Modal(props: ModalProps) {

    const classes = useStyles();

    const { confirmButton, cancelButton, open, onClose, confirmAction, dialogActions } = props

    return <Dialog onClose={onClose} open={open}>

        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{props.title}</Typography>
            {
                props.onClose ? (
                    <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                ) : null
            }
        </MuiDialogTitle>

        <DialogContent dividers>
            {props.children}
        </DialogContent>

        {
            (confirmButton || cancelButton || dialogActions)
            && <DialogActions style={{display:'unset', textAlign:'center'}}>
                {
                    dialogActions
                }
                {
                    confirmButton && <Button onClick={confirmAction} color="primary" variant="contained">{confirmButton}</Button>
                }
                {
                    cancelButton && <Button onClick={onClose} color="primary" variant="contained">{cancelButton}</Button>
                }
            </DialogActions>
        }

    </Dialog>
}