import React from 'react'
import Measure from 'react-measure'

const Provider = (props) => {
    const {
        onResize,
        children,
    } = props

    return (
        <Measure onResize={onResize}>
            {({ measureRef }) => {
                return <div ref={measureRef} className='Measure-root'>{children}</div>
            }}
        </Measure>
    )
}

export default {
    Provider,
}