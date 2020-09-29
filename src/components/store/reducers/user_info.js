import { useEffect } from "react"
import { connect } from "react-redux"
import axios from '../../../utils/axios'

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

const actionType = {
    init: 'USERINFO_INIT',
    refetch: 'USERINFO_REFETCH',
}

const userInfoActions = {
    init: ({
        signedIn,
        username,
        nickname,
        email,
        phone,
    }) => ({
        type: actionType.init,
        payload: {
            signedIn,
            username,
            nickname,
            email,
            phone,
        }
    }),
    refetch: () => ({
        type: actionType.refetch,
    })
}

function userInfoReducer(state = initState, action = {}) {
    switch (action.type) {
        case actionType.init:
            return {
                ...state,
                ...action.payload,
                inited: true
            }
        case actionType.refetch:
            return {
                ...initState
            }
        default:
            return state
    }
}

const UserInfoProvider = connect(
    (state) => ({
        userInfoInited: state.userInfo.inited,
    }),
    (dispatch) => ({
        initUserInfo: (info = {}) => dispatch(userInfoActions.init(info))
    })
)((props) => {
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
    userInfoReducer,
    userInfoActions,
    UserInfoProvider,
}