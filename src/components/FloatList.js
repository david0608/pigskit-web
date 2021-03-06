import React from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { withClass } from '../components/utils'
import { FoldList, FoldItem } from './FoldList'

const FloatListRoot = withClass(
    'FloatList-Root',
    styled(FoldList)`
        display: inline-block;

        &.Open {
            position: relative;

            .FoldList-List {
                border: solid 1px rgba(0, 0, 0, .1);
                border-radius: 4px;
                padding: 4px 0px;
                box-shadow: 0 2px 28px 0 rgba(0,0,0,0.12);
                background-color: white;
            }

            &.LeftAligned, &.RightAligned {
                &::after {
                    content: '';
                    border: solid transparent;
                    border-width: 0px 10px 10px 10px;
                    border-bottom-color: rgba(0,0,0,0.1);
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translate(-50%, 10px);
                }

                .FoldList-List {
                    position: absolute;
                    transform: translate(0px, 10px);
                }
            }

            &.RightAligned .FoldList-List {
                right: 0;
            }

            &.FullScreen {
                .FoldList-Label::after {
                    content: '';
                    position: fixed;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background-color: rgba(0, 0, 0, .1);
                }

                .FoldList-List {
                    position: fixed;
                    top: 100px;
                    right: 50%;
                    transform: translate(50%, 0%);
                    padding: 10px 10px;
                }
            }
        }
    `,
)

const FloatList = (props) => {
    const {
        className,
        rightAligned,
        fullScreen,
        ...otherProps
    } = props

    let theme = ''
    if (fullScreen) {
        theme = 'FullScreen'
    } else if (rightAligned) {
        theme = 'RightAligned'
    } else {
        theme = 'LeftAligned'
    }

    return <FloatListRoot
        className={clsx(theme, className)}
        preventScroll={fullScreen}
        {...otherProps}
    />
}

const FloatItem = withClass(
    'FloatItem-Root',
    FoldItem,
)

export {
    FloatList,
    FloatItem,
}