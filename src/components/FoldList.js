import React, { useState, useContext, useRef, useCallback } from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { withClass } from '../components/utils'
import usePreventBodyScroll from '../utils/preventBodyScroll'

const ParentFold = React.createContext()

const FoldListRoot = withClass(
    'FoldList-Root',
    styled.div`
        outline: none;
        display: inline-flex;
        flex-direction: column;
        align-items: flex-start;
    `,
)

const FoldList = (props) => {
    const {
        className,
        label,
        foldCatch,
        preventScroll,
        debug,
        children,
    } = props

    const [open, setOpen] = useState(false)

    const parentFold = useContext(ParentFold)

    const refRoot = useRef(null)

    const closeWhenUnFocus = useCallback((e) => {
        let root = e.currentTarget
        let focused = e.relatedTarget
        if (!root.contains(focused)) {
            setOpen(false)
        }
    }, [])

    const toggle = () => {
        if (open) {
            setOpen(false)
            refRoot.current.focus()
        } else {
            setOpen(true)
        }
    }

    const fold = (foldCatchable = true) => {
        if (parentFold) {
            if (foldCatch && foldCatchable) {
                toggle()
            } else {
                parentFold(foldCatchable)
            }
        } else {
            toggle()
        }
    }

    return (
        <FoldListRoot
            className={clsx((open || debug) && 'Open', className)}
            tabIndex={-1}
            onBlur={closeWhenUnFocus}
            ref={refRoot}
        >
            <FoldListLabel
                onFocus={(e) => e.stopPropagation()}
                onClick={toggle}
            >
                {
                    label || <button>list</button>
                }
            </FoldListLabel>
            <ParentFold.Provider
                value={fold}
            >
                {
                    (open || debug) &&
                    <FoldListList
                        preventScroll={preventScroll}
                        children={children}
                    />
                }
            </ParentFold.Provider>
        </FoldListRoot>
    )
}

const FoldListLabel = withClass(
    'FoldList-Label',
    styled.div`
        outline: none;
    `,
)

const FoldListListRoot = withClass(
    'FoldList-List',
    styled.div`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        outline: none;
    `,
)

const FoldListList = props => {
    const {
        preventScroll,
        ...otherProps
    } = props

    if (preventScroll) usePreventBodyScroll()

    return <FoldListListRoot {...otherProps}/>
}

const FoldItemRoot = withClass(
    'FoldItem-Root',
    styled.div`
        display: inline-block,
    `,
)

class FoldItemComponent extends React.Component {
    constructor(props) {
        super(props)
    }

    static contextType = ParentFold

    startFold() {
        if (this.context) {
            this.context(this.props.foldCatchable)
        }
    }

    componentDidMount() {
        if (this.props.forwardRef) {
            this.props.forwardRef.current = this
        }
    }

    shouldFold() {
        if (!this.props.manualFold) {
            this.startFold()
        }
    }

    render() {
        const {
            className,
            children,
        } = this.props

        return (
            <FoldItemRoot
                className={className}
                onClick={() => this.shouldFold()}
            >
                {children}
            </FoldItemRoot>
        )
    }
}

const FoldItem = React.forwardRef((props, ref) => <FoldItemComponent forwardRef={ref} {...props}/>)

export {
    FoldList,
    FoldItem,
}