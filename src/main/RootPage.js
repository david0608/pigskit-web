import React from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import styled from 'styled-components'
import Page from '../components/Page'

const RootPageRoot = styled.div`
    >.Logo {
        text-align: center;
    }

    >.Slogan {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        color: #444444;
    }

    &.desktop {
        margin: 128px 0;

        >.Logo {
            font-size: 80px;
        }

        >.Slogan {
            font-size: 32px;
            font-weight: 600;
            margin-top: 48px;
        }
    }

    &.tablets {
        margin: 96px 32px;

        >.Logo {
            font-size: 64px;
        }

        >.Slogan {
            font-size: 24px;
            font-weight: 600;
            margin-top: 48px;
        }
    }

    &.mobile {
        margin: 96px 16px;
        >.Logo {
            font-size: 48px;
        }

        >.Slogan {
            font-size: 20px;
            margin-top: 48px;
        }
    }
`

const RootPage = connect(
    state => ({
        deviceType: state.deviceInfo.type,
    })
)(props => {
    const {
        deviceType,
    } = props

    return (
        <Page.Root>
            <RootPageRoot className={clsx(deviceType)}>
                <div className={clsx('Logo', 'Text_logo')}>Pigskit</div>
                <div className="Slogan">
                    <span>The most</span>&nbsp;
                    <span>competent assistant</span>&nbsp;
                    <span>for your shop</span>
                </div>
            </RootPageRoot>
        </Page.Root>
    )
})

export default RootPage