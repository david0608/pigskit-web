import React, { useState, useContext, useRef, useCallback } from 'react'
import clsx from 'clsx'
import usePreventBodyScroll from '../../../utils/preventBodyScroll'
import './index.less'

const ParentFold = React.createContext()

export const FoldList = (props) => {
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
        <div
            className={clsx('FoldList-Root', (open || debug) && 'Open', className)}
            tabIndex={-1}
            onBlur={closeWhenUnFocus}
            ref={refRoot}
        >
            <div
                className='FoldList-Label'
                onFocus={(e) => e.stopPropagation()}
                onClick={toggle}
            >
                {label || <button>list</button>}
            </div>
            <ParentFold.Provider value={fold}>
                {(open || debug) && <FoldListList
                    preventScroll={preventScroll}
                    children={children}
                />}
            </ParentFold.Provider>
        </div>
    )
}

const FoldListList = (props) => {
    const {
        preventScroll,
        children
    } = props

    if (preventScroll) usePreventBodyScroll()

    return <div
        className='FoldList-List'
    >
        {children}
    </div>
}

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
        return <div
            className={clsx('FoldItem-Root', this.props.className)}
            onClick={() => this.shouldFold()}
            children={this.props.children}
        />
    }
}

export const FoldItem = React.forwardRef((props, ref) => <FoldItemComponent forwardRef={ref} {...props} />)