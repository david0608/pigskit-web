import React from 'react'
import clsx from 'clsx'
import styled from 'styled-components'
import { connectDeviceInfoType } from './store'

const Root = styled.div`
    max-width: 1200px;
    margin: 36px auto;
`

const SideBar = styled.div``

const Content = styled.div``

const BlockComponent = styled.div`
    margin: 30px 0px;
    padding: 0px 30px;

    &.desktop {
        display: flex;

        >${SideBar} {
            flex: 1;

            >* {
                width: 80%;
            }
        }

        >${Content} {
            flex: 3;
            min-width: 0;
        }
    }

    &.mobile {
        padding: 0px 8px;
    }
`

const Block = connectDeviceInfoType(props => {
    const {
        className,
        deviceType,
        ...otherProps
    } = props

    return (
        <BlockComponent
            className={clsx(className, deviceType)}
            {...otherProps}
        />
    )
})

export default {
    Root,
    Block,
    SideBar,
    Content,
}