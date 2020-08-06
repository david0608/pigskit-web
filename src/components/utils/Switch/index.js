import React, { useState, useContext, useRef } from 'react'
import clsx from 'clsx'
import './index.less'

const SwitchContext = React.createContext()

export const Switch = (props) => {
    const {
        className,
        defaultContent,
        switchedContent,
    } = props

    const refRoot = useRef(null)

    const [switched, setSwitched] = useState(false)

    const toggle = () => {
        refRoot.current.focus()
        setSwitched(!switched)
    }

    return (
        <div
            ref={refRoot}
            className={clsx('Switch-Root', switched && 'Switched', className)}
            tabIndex={-1}
        >
            <SwitchContext.Provider value={toggle}>
                {
                    switched ?
                    switchedContent :
                    defaultContent
                }
            </SwitchContext.Provider>
        </div>
    )
}

export function useSwitch() {
    return useContext(SwitchContext)
}