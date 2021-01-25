import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import clsx from 'clsx'
import QRCode from 'qrcode.react'

const OutlineRoot = styled.div`
    >div:not(:last-child) {
        border-bottom: solid 1px #dcdcdc;
    }

    >.QRCode-root {
        margin: 48px 0px;
        display: flex;
        flex-direction: column;
        align-items: center;

        >.Desc {
            margin-top: 16px;
        }
    }
`

const Outline = connect(
    state => ({
        deviceType: state.deviceInfo.type,
        shopId: state.userShopInfo.id,
        shopName: state.userShopInfo.name,
    })
)(props => {
    const {
        deviceType,
        shopId,
        shopName,
    } = props

    return (
        <OutlineRoot>
            <div className='Text_header_2nd'>
                Shop Entrance
            </div>
            <div className='QRCode-root'>
                <QRCode
                    size={deviceType === 'mobile' ? 192 : 256}
                    value={`${location.origin}/menu/?id=${shopId}`}
                />
                <div
                    className={clsx('Desc', 'Text_content_enlarge', 'Text_bold')}
                >
                    Scan to start shopping on&nbsp;
                    <span className='Text_highlight'>{shopName}</span>.
                </div>
            </div>
        </OutlineRoot>
    )
})

export default Outline