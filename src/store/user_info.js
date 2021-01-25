import { useEffect } from 'react'
import { connect } from 'react-redux'
import axios from '../utils/axios'

const initState = {
    // Indicate if informations are initialized.
    inited: false,
    // Indicate if the user has signed in or not.
    signedIn: false,
    // Record username of the user.
    username: '',
    // Record nickname of the user.
    nickname: '',
    // Record email of the user.
    email: '',
    // Record phone of the user.
    phone: '',
}

const actionTypes = {
    init: 'USERINFO_INIT',
    refetch: 'USERINFO_REFETCH',
}

const actions = {
    init: ({
        signedIn,
        username,
        nickname,
        email,
        phone,
    }) => ({
        type: actionTypes.init,
        payload: {
            signedIn,
            username,
            nickname,
            email,
            phone,
        }
    }),
    refetch: () => ({
        type: actionTypes.refetch,
    })
}

function reducer(state = initState, action = {}) {
    switch (action.type) {
        case actionTypes.init:
            return {
                ...state,
                ...action.payload,
                inited: true,
            }
        case actionTypes.refetch:
            return {
                ...initState
            }
        default:
            return state
    }
}

const Provider = connect(
    state => ({
        userInfoInited: state.userInfo.inited,
    }),
    dispatch => ({
        initUserInfo: (info = {}) => dispatch(actions.init(info))
    })
)(props => {
    const {
        userInfoInited,
        initUserInfo,
        children,
    } = props

    useEffect(() => {
        if (userInfoInited) return

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
    }, [userInfoInited])

    if (userInfoInited) {
        return children
    } else {
        return null
    }
})

export {
    reducer,
    actions,
    Provider,
}