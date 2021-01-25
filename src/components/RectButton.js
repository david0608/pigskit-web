import React from 'react'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { LoadingRing } from './Loading'

const rectButtonStyle = makeStyles({
    root: {
        minHeight: '34px',
        fontFamily: 'Poppins, sans-serif',
        color: 'white',
        border: 'unset',
        borderRadius: '0px',
        padding: '0px',
        backgroundColor: props => props.backgroundColor,
        '&:hover': {
            backgroundColor: props => props.backgroundColorHover,
        }
    },
    disabled: {
        color: 'white !important',
        backgroundColor: props => props.backgroundColorDisabled,
    }
})

const RectButton = React.memo(
    (props) => {
        const {
            backgroundColor = '#ee3333',
            backgroundColorHover = '#ff3333',
            backgroundColorDisabled = '#ee9999',
            loading,
            children,
            ...otherProps
        } = props

        const classes = rectButtonStyle({
            backgroundColor: backgroundColor,
            backgroundColorHover: backgroundColorHover,
            backgroundColorDisabled: backgroundColorDisabled,
        })

        return (
            <Button
                classes={classes}
                {...otherProps}
            >
                {loading ? <LoadingRing radius={10}/> : children}
            </Button>
        )
    }
)

export default RectButton