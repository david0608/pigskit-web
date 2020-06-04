import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const rootStyle = makeStyles({
    root: {
        height: '40px',
        width: '80%',
        marginTop: '20px',
        displat: 'flex',
    }
})

const inputStyle = makeStyles({
    root: {
        height: '100%',
        margin: 'unset !important',
        border: '1px solid #dcdcdc',
    },
    focused: {
        border: '1px solid black',
    },
    input: {
        position: 'absolute',
        left: '10px',
        width: '95%',
    },
    underline: {
        '&::before': {
            content: 'unset',
        },
        '&::after': {
            content: 'unset',
        }
    }
})

const labelStyle = makeStyles({
    root: {
        backgroundColor: 'white',
        top: '50%',
        left: '10px',
        transform: 'translate(0px, -50%) scale(1)',
        transition: 'color 200ms ,transform 200ms, top 200ms',
    },
    focused: {
        color: 'black !important',
    },
    shrink: {
        top: '0',
        padding: '0 2px',
        transform: 'translate(0px, -50%) scale(0.75)',
        zIndex: '10',
    }
})

const TextInput = React.memo((props) => {

    return (
        <TextField
            classes={rootStyle()}
            InputProps={{
                classes: inputStyle()
            }}
            InputLabelProps={{
                classes: labelStyle()
            }}
            {...props}
        />
    )
})

export default TextInput;