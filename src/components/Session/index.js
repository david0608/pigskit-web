import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { userInfoActions } from '../store'
import axios from '../../utils/axios'

const mapDispatchToProps = (dispatch) => ({
    initUserInfo: (info = {}) => dispatch(userInfoActions.init(info))
})

const Session = connect(
    () => ({}),
    mapDispatchToProps,
)((props) => {
    const { initUserInfo } = props

    useEffect(() => {
        axios({
            method: 'GET',
            url: '/api/user/session',
        })
        .then((res) => {
            if (res.status === 200) {
                initUserInfo({
                    signedIn: true,
                    ...res.data
                })
            } else {
                throw 'Unexpected'
            }
        })
        .catch(() => {
            initUserInfo({
                signedIn: false,
            })
        })
    }, [])
    
    return null
})

export const UserInfo = connect(
    (state) => ({
        userInfoInited: state.userInfo.inited,
    })
)((props) => {
    const {
        userInfoInited,
        children,
    } = props

    if (userInfoInited) {
        return children
    } else {
        return <Session/>
    }
})