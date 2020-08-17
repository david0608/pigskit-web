import React, { useState, useEffect, useCallback } from 'react'
import clsx from 'clsx'
import { BsX } from 'react-icons/bs'
import TextInput from '../TextInput'
import './index.less'

const SearchField = (props) => {
    const {
        className,
        label = 'Search',
        onCommit = () => {},
        ...otherProps
    } = props

    const [value, setValue] = useState({
        current: '',
        old: '',
    })

    useEffect(() => {
        if (value.current !== value.old) {
            const id = setTimeout(
                () => onCommit(value.current),
                1000,
            )
            value.old = value.current
            return () => clearTimeout(id)
        }
    })

    const handleChange = (e) => {
        setValue({
            current: e.target.value,
            old: value.old,
        })
    }

    const clear = useCallback(() => {
        setValue({
            current: '',
            old: '',
        })
        onCommit('')
    }, [])

    return <div className={clsx('SearchField-Root', className)}>
        <TextInput
            value={value.current}
            label={label}
            rootStyleProps={{ height: '100%', width: '100%' }}
            inputLabelStyleProps={{ shrink: { display: 'none' } }}
            onChange={handleChange}
            {...otherProps}
        />
        {value.current && <BsX
            className='Clear'
            onClick={clear}
        />}
    </div>
}

export default SearchField