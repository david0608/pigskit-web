import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import clsx from 'clsx'
import { BsX } from 'react-icons/bs'
import TextInput from './TextInput'

const SearchFieldRoot = styled.div`
    position: relative;
    display: inline-block;

    >.Clear {
        font-size: 20px;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(0, -50%);
        padding: 0px 5px 0px 0px;
        cursor: pointer;
    }
`

const SearchField = props => {
    const {
        className,
        label = 'Search',
        onCommit = () => {},
        defaultValue = '',
        ...otherProps
    } = props

    const [value, setValue] = useState({
        current: defaultValue,
        old: defaultValue,
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

    return (
        <SearchFieldRoot className={clsx(className)}>
            <TextInput
                value={value.current}
                label={label}
                rootStyleProps={{ height: '100%', width: '100%' }}
                inputLabelStyleProps={{ shrink: { display: 'none' } }}
                onChange={handleChange}
                {...otherProps}
            />
            {
                value.current &&
                <BsX
                    className='Clear'
                    onClick={clear}
                />
            }
        </SearchFieldRoot>
    )
}

export default SearchField