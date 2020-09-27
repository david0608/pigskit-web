import React from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import '../../styles/text.less'
import './index.less'

const Path = connect(
    (state) => ({
        username: state.userInfo.username,
        nickname: state.userInfo.nickname,
    })
)((props) => {
    const {
        username,
        nickname,
        className,
        path = [],
    } = props

    return (
        <div className={clsx('Path-root', className)}>
            {
                path.length === 0 ?
                <span>{nickname || username}</span> :
                <Link
                    name={nickname || username}
                    endPoint='home'
                />
            }
            {path.map((e, i) => (
                <React.Fragment key={i}>
                    &nbsp;/&nbsp;<Link {...e}/>
                </React.Fragment>
            ))}
        </div>
    )
})

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