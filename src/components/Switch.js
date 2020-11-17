import React, { useState, useContext, useRef } from 'react'
import clsx from 'clsx'
import styled from 'styled-components'

const SwitchContext = React.createContext()

const SwitchRoot = styled.div`
    outline: none;
`

const Switch = (props) => {
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
        <SwitchRoot
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
        </SwitchRoot>
    )
}

function useSwitch() {
    return useContext(SwitchContext)
}

export {
    Switch,
    useSwitch,
}