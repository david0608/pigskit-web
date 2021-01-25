import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import clsx from 'clsx'
import Abstract from '../../../components/Abstract'
import Decorate from '../../../components/Decorate'

const EntryRoot = styled(Abstract)`
    .DataField {
        display: flex;
        flex-wrap: wrap;

        >.Right {
            margin-left: auto;
        }
    }

    .Order-outline {
        padding: 12px 16px;

        >.OrderAt {
            display: flex;
            align-items: center;
        }
    }

    .Order-detail {
        padding: 24px 16px;
        
        >* {
            padding: 12px 0px;

            &:not(:last-child) {
                border-bottom: solid 1px #dcdcdc;
            }
        }

        >.Item {
            >*:not(:first-child) {
                margin-top: 4px;
            }

            >.Quantity {
                text-align: end;
            }
        }

        &.desktop, &.tablets {
            >.Item>.Customize {
                width: 256px;
                margin-left: 64px;
            }
        }

        &.mobile>.Item>.Customize {
            padding: 0px 24px;
        }
    }
`

const Entry = props => {
    const {
        data,
    } = props

    return (
        <EntryRoot>
            <Outline data={data}/>
            <Detail data={data}/>
        </EntryRoot>
    )
}

const Outline = props => {
    const {
        data,
    } = props

    return (
        <div className={clsx('DataField', 'Order-outline')}>
            <div className='Text_content_enlarge'>
                No.{data.orderNumber}
            </div>
            <div className={clsx('Right', 'OrderAt', 'Text_remark')}>
                {(new Date(data.orderAt).toLocaleString('en'))}
            </div>
        </div>
    )
}

const Detail = connect(
    state => ({
        deviceType: state.deviceInfo.type,
    })
)(props => {
    const {
        data,
        deviceType,
    } = props

    const isMobile = deviceType === 'mobile'

    return (
        <div className={clsx('Order-detail', deviceType)}>
            <div className='Text_header_2nd'>
                No.{data.orderNumber}
            </div>
            {
                data.items.map((item, i) => (
                    <Item
                        key={i}
                        data={item}
                    />
                ))
            }
            <div className='DataField'>
                Order at :
                <div className={clsx('Right', isMobile && 'Text_fine')}>
                    {(new Date(data.orderAt)).toLocaleString('en')}
                </div>
            </div>
            <div className='DataField'>
                Total&nbsp;:&nbsp;
                <Decorate.Price className='Right'>
                    {data.totalPrice}
                </Decorate.Price>
            </div>
        </div>
    )
})

const Item = connect(
    state => ({
        deviceType: state.deviceInfo.type,
    })
)(props => {
    const {
        data,
        deviceType,
    } = props

    const isMobile = deviceType === 'mobile'

    return (
        <div className='Item'>
            <div className='DataField'>
                <span>
                    {data.name}
                </span>
                <Decorate.Price className={clsx('Right', isMobile && 'Text_fine')}>
                    {data.totalPrice}
                </Decorate.Price>
            </div>
            {
                data.customizes.map((cus, i) => (
                    <Customize
                        key={i}
                        data={cus}
                    />
                ))
            }
            {data.remark && <div className='Text_fine' children={data.remark}/>}
            <div className={clsx('Quantity', isMobile && 'Text_fine')}>
                Quantity&nbsp;:&nbsp;{data.count}
            </div>
        </div>
    )
})

const Customize = connect(
    state => ({
        deviceType: state.deviceInfo.type,
    })
)(props => {
    const {
        data,
        deviceType,
    } = props

    const isMobile = deviceType === 'mobile'

    return (
        <div className={clsx('DataField', 'Customize', isMobile && 'Text_fine')}>
            <div>
                {data.name}
            </div>
            <div className='Right'>
                {data.selection}
            </div>
        </div>
    )
})

export default Entry