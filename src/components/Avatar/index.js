import React from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import { pigskit_restful_origin } from '../../utils/service_origins'
import './index.less'

const Avatar = connect(
    (state) => ({
        deviceType: state.deviceInfo.type,
    })
)((props) => {
    const {
        deviceType,
        className,
        path = [],
    } = props

    return (
        <div className={clsx('Avatar-Root', deviceType, className)}>
            <div className='Avatar-Box'>
                <img src={`${pigskit_restful_origin()}/fs/user/avatar`}/>
            </div>
            <Path
                path={path}
            />
        </div>
    )
})

const Path = connect(
    (state) => ({
        username: state.userInfo.username,
        nickname: state.userInfo.nickname,
    })
)((props) => {
    const {
        username,
        nickname,
        path = [],
    } = props

    return (
        <div className='Path'>
            {
                path.length === 0 ?
                <div>{nickname || username}</div> :
                <div
                    className='Link'
                    onClick={() => location.href = `${location.origin}/home`}
                >
                    {nickname || username}
                </div>
            }
            {path.map((e, i) => <Link key={i} {...e}/>)}
        </div>
    )
})

const Link = (props) => {
    const {
        name,
        endPoint,
    } = props

    if (endPoint) {
        return <>
            <div>/</div>
            <div
                className='Link'
                onClick={() => location.href = `${location.origin}/${endPoint}`}
            >
                {name}
            </div>
        </>
    } else {
        return <>
            <div>/</div>
            <div>{name}</div>
        </>
    }
}

export default Avatar