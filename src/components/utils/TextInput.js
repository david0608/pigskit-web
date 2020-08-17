import React from 'react'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'

const rootStyle = makeStyles({
    root: {
        height: p => p.height,
        width: p => p.width,
    }
})

const inputStyle = makeStyles({
    root: {
        height: '100%',
        margin: 'unset !important',
        border: '1px solid #dcdcdc',
        fontFamily: 'inherit',
    },
    focused: {
        border: '1px solid black',
    },
    error: {
        border: '1px solid #f44336',
    },
    input: {
        fontSize: '14px',
        paddingLeft: '8px',
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
        fontSize: '14px',
        backgroundColor: 'white',
        top: '50%',
        left: '10px',
        transform: 'translate(0px, -50%) scale(1)',
        transition: 'color 200ms ,transform 200ms, top 200ms',
        fontFamily: 'inherit',
    },
    focused: {
        color: 'black !important',
    },
    error: {
        color: '#f44336 !important',
    },
    shrink: {
        display: p => p.shrink?.display,
        top: '0',
        padding: '0 2px',
        transform: 'translate(0px, -50%) scale(0.75)',
        zIndex: '10',
    }
})

const helperTextStyle = makeStyles({
    root: {
        position: 'absolute',
        left: 0,
        right: '20px',
        bottom: 0,
        transform: 'translateY(100%)',
        fontFamily: 'inherit',
        textAlign: 'right',
    }
})

const TextInput = React.memo((props) => {
    const {
        forwardRef,
        rootStyleProps = {},
        inputLabelStyleProps = {},
        ...innerProps
    } = props

    return (
        <TextField
            inputRef={forwardRef}
            classes={rootStyle(rootStyleProps)}
            InputProps={{
                classes: inputStyle()
            }}
            InputLabelProps={{
                classes: labelStyle(inputLabelStyleProps)
            }}
            FormHelperTextProps={{
                classes: helperTextStyle()
            }}
            {...innerProps}
        />
    )
})

export default React.forwardRef((props, ref) => <TextInput forwardRef={ref} {...props}/>)