import React from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import { withStyles, Button as MuiButton } from '@material-ui/core'
import { FloatList } from '../../FloatList'
import './index.less'

export const TopBar = connect(
    (state) => ({
        deviceScrolled: state.deviceInfo.scrolled,
    })
)((props) => {
    const {
        deviceScrolled,
        className,
        children,
    } = props

    return (<>
        <div className={clsx('Decorate-TopBar', deviceScrolled && 'Scrolled')}>
            <div className={clsx('Decorate-TopBar-body', className)}>
                {children}
            </div>
        </div>
        <div className='Decorate-TopBar-space'/>
    </>)
})

const Button = withStyles({
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
        fontFamily: 'Poppins, sans-serif',
        '& svg': {
            color: '#ff3333',
            fontSize: '20px',
        },
        '& img': {
            width: '34px',
            borderRadius: '17px',
        }
    }
})(MuiButton)

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
        }
    }
})(Button)

export const TopBarButton = (props) => {
    const {
        deviceType,
        ...innerProps
    } = props

    switch (deviceType) {
        case 'mobile':
            return <ButtonMobile {...innerProps}/>
        default:
            return <Button {...innerProps}/>
    }
}

export const TopBarFloatList = (props) => {
    const {
        className,
        ...otherProps
    } = props

    return (
        <FloatList
            className={clsx('Decorate-TopBarFloatList', className)}
            rightAligned
            {...otherProps}
        />
    )
}