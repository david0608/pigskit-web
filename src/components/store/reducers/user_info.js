const initState = {
    // Indicate if informations are initialized.
    inited: false,
    // Indicate if the user has signed in or not.
    signedIn: false,
    // Record username of the user.
    username: '',
    // Record nickname of the user.
    nickname: '',
}

const actionType = {
    init: 'USERINFO_INIT',
}

const userInfoActions = {
    init: ({ signedIn, username, nickname }) => ({
        type: actionType.init,
        payload: {
            inited: true,
            signedIn,
            username,
            nickname,
        }
    }),
}

function userInfoReducer(state = initState, action = {}) {
    switch (action.type) {
        case actionType.init:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}

export {
    userInfoReducer,
    userInfoActions,
}