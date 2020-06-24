import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const rectButtonStyle = makeStyles({
    root: {
        position: 'unset',
        fontFamily: 'inherit',
        fontSize: '14px',
        fontWeight: '400',
        color: 'white',
        border: 'unset',
        borderRadius: '0px',
        backgroundColor: props => props.backgroundColor,
        '&:hover': {
            backgroundColor: props => props.backgroundColorHover,
        }
    }
})

const RectButton = React.memo(
    (props) => {
        const {
            backgroundColor = '#f02040',
            backgroundColorHover = '#ff2040',
            ...otherProps
        } = props;

        const classes = rectButtonStyle({
            backgroundColor: backgroundColor,
            backgroundColorHover: backgroundColorHover,
        });

        return (
            <Button
                classes={classes}
                {...otherProps}
            />
        )
    }
)

export default RectButton;