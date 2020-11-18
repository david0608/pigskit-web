import React from 'react'
import clsx from 'clsx'
import styled from 'styled-components'
import { LoadingRing } from './Loading'

const ButtonRoot = styled.button`
    min-height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.1), transparent);
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    padding: 0px 10px;
    outline: none;
    user-select: none;

    &:hover {
        background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.15), transparent);
    }

    &:disabled {
        cursor: unset;
        background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.01), transparent);

        &:hover {
            background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.01), transparent);
        }
    }
`

const Button = (props) => {
    const {
        className,
        loading,
        children,
        ...otherProps
    } = props

    return (
        <ButtonRoot
            className={clsx('StyledButton', className)}
            {...otherProps}
        >
            {
                loading ?
                <LoadingRing
                    radius={8}
                    stroke='rgba(0, 0, 0, 0.2)'
                    strokeWidth={2}
                /> :
                children
            }
        </ButtonRoot>
    )
}

export default Button