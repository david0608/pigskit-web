import React from 'react'
import styled from 'styled-components'
import { withClass } from './utils'
import { connectUserInfoUsernameNickname } from './store'
import '../styles/text.less'

const PathRoot = withClass(
    'Path-root',
    styled.div`
        font-size: 20px;
        display: flex;
        flex-wrap: wrap;
    `,
)

const Path = connectUserInfoUsernameNickname(
    props => {
        const {
            username,
            nickname,
            className,
            path = [],
        } = props

        return (
            <PathRoot
                className={className}
            >
                {
                    path.length === 0 ?
                    <span>{nickname || username}</span> :
                    <Link
                        name={nickname || username}
                        endPoint='home'
                    />
                }
                {
                    path.map((e, i) => (
                        <React.Fragment key={i}>
                            &nbsp;/&nbsp;<Link {...e}/>
                        </React.Fragment>
                    ))
                }
            </PathRoot>
        )
    }
)

const Link = (props) => {
    const {
        name,
        endPoint,
    } = props

    if (endPoint) {
        return (
            <span
                className='Text_link'
                onClick={() => location.href = `${location.origin}/${endPoint}`}
            >
                {name}
            </span>
        )
    } else {
        return (
            <span>{name}</span>
        )
    }
}

export default Path