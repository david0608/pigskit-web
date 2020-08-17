import React from 'react'
import { withStyles, Button } from '@material-ui/core'

const ButtonBase = withStyles({
    root: {
        height: '100%',
        width: '100px',
        padding: 'unset',
        textTransform: 'unset',
        '&::before': {
            content: '""',
            height: '50%',
            width: '1px',
            background: '#d4d4d4',
        }
    },
    label: {
        fontSize: '16px',
        '& svg': {
            color: '#f02040',
            fontSize: '20px',
            marginRight: '10%',
        },
        '& img': {
            width: '34px',
            borderRadius: '17px',
        }
    }
})(Button)

const ButtonMobile = withStyles({
    root: {
        width: '50px',
        "&::before": {
            content: 'unset',
        }
    },
    label: {
        '& svg': {
            fontSize: '24px',
            marginRight: 'unset',
        }
    }
})(ButtonBase)

const NavButton = (props) => {
    const {
        deviceType,
        ...innerProps
    } = props

    switch (deviceType) {
        case 'mobile':
            return <ButtonMobile disableRipple={true} {...innerProps}/>
        default:
            return <ButtonBase disableRipple={true} {...innerProps}/>
    }
}

export default NavButton