import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { arePropsEqual } from '../../utils';

const rectButtonStyle = makeStyles({
    root: {
        width: '80%',
        height: '40px',
        fontSize: '16px',
        fontWeight: '500',
        color: 'white',
        marginTop: '20px',
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
    },
    arePropsEqual
)

export default RectButton;