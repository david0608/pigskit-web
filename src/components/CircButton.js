import React from 'react'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

const styles = makeStyles({
    root: {
        boxShadow: '0px 0px 2px 1px rgba(0,0,0,.3)',
        padding: 'unset',
        borderRadius: '12px',
        minWidth: 'unset',
        backgroundColor: props => props.backgroundColor,
        height: props => props.size,
        width: props => props.size,
        '&:hover': {
            backgroundColor: props => props.backgroundColorHover,
        }
    },
    label: {
        '& svg': {
            color: props => props.labelColor,
            fontSize: props => props.labelSize,
        }
    }
})

const CircButton = React.memo(
    (props) => {
        const {
            backgroundColor = 'white',
            backgroundColorHover = '#f1f1f1f1',
            size = '24px',
            labelSize = '16px',
            labelColor = '#ff3333',
            ...innerProps
        } = props

        const classes = styles({
            backgroundColor: backgroundColor,
            backgroundColorHover: backgroundColorHover,
            size: size,
            labelSize: labelSize,
            labelColor: labelColor,
        })

        return (
            <Button
                classes={classes}
                {...innerProps}
            />
        )
    }
)

export default CircButton