import React from 'react'
import styled from 'styled-components'
import { MdAttachMoney } from 'react-icons/md'

const List = styled.div`
    border-radius: 4px;
    border: solid 1px #dcdcdc;
    display: flex;
    flex-direction: column;

    >* {
        &:first-child {
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
        }

        &:not(:first-child) {
            border-top: solid 1px #dcdcdc;
        }

        &:last-child {
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
        }
    }
`

const DevideList = styled.div`
    >div {
        &:first-child {
            border-top: solid 1px #dcdcdc;
        }

        border-bottom: solid 1px #dcdcdc;
    }
`

const TabList = styled.div`
    display: flex;
    overflow: scroll;
    border-width: 1px 0px;
    border-style: solid;
    border-color: #ececec;
    background-color: #f9f9f9;
`

const PriceRoot = styled.div`
    display: flex;
    align-items: center;

    >span {
        line-height: 0em;
    }
`

const Price = (props) => {
    const {
        className,
        children,
    } = props

    return (
        <PriceRoot className={className}>
            <MdAttachMoney/>
            <span>
                {children}
            </span>
        </PriceRoot>
    )
}

const Blank = styled.div`
    color: #dcdcdc;
    padding: 32px 0px;
    text-align: center;
`

export default {
    List,
    DevideList,
    TabList,
    Price,
    Blank,
}