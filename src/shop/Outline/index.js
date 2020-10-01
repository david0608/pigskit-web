import React from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import QRCode from 'qrcode.react'
import '../../styles/text.less'
import './index.less'

const Outline = connect(
    state => ({
        deviceType: state.deviceInfo.type,
        shopId: state.userShop.data.shop.id,
        shopName: state.userShop.data.shop.name,
    })
)(props => {
    const {
        deviceType,
        shopId,
        shopName,
    } = props

    return (
        <div className='Outline-root'>
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
        </div>
    )
})

export default Outline