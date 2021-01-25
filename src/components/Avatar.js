import React from 'react'
import styled from 'styled-components'
import { withClass } from './utils'
import { pigskit_restful_origin } from '../utils/service_origins'

const AvatarRoot = withClass(
    'Avatar-root',
    styled.div`
        position: relative;

        &::before {
            content: '';
            display: block;
            padding-top: 100%;
        }

        img {
            position: absolute;
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            border-radius: 50%;
            object-fit: cover;
        }
    `,
)

const Avatar = props => {
    const {
        className,
    } = props

    return (
        <AvatarRoot
            className={className}
        >
            <img src={`${pigskit_restful_origin()}/api/user/profile/avatar?default=true`}/>
        </AvatarRoot>
    )
}

export default Avatar