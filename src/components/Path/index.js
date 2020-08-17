import React from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
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
                <div>{nickname || username}</div> :
                <Link
                    name={nickname || username}
                    endPoint='home'
                />
            }
            {path.map((e, i) => (
                <React.Fragment key={i}>
                    <div>/</div>
                    <Link {...e}/>
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
            <div
                className='Link-root'
                onClick={() => location.href = `${location.origin}/${endPoint}`}
            >
                {name}
            </div>
        )
    } else {
        return (
            <div>{name}</div>
        )
    }
}

export default Path