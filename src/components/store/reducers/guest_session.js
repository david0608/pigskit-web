import { useEffect } from 'react'
import { connect } from 'react-redux'
import axios from '../../../utils/axios'

const initState = {
    inited: false,
}

const actionType = {
    init: 'GUESTSESSION_INIT',
    refetch: 'GUESTSESSION_REFETCH',
}

const guestSessionActions = {
    init: () => ({
        type: actionType.init,
    }),
    refetch: () => ({
        type: actionType.refetch,
    })
}

function guestSessionReducer(state = initState, action = {}) {
    switch (action.type) {
        case actionType.init:
            return {
                ...state,
                inited: true
            }
        case actionType.refetch:
            return {
                ...state,
                inited: false
            }
        default:
            return state
    }
}

const GuestSessionProvider = connect(
    (state) => ({
        guestSessionInited: state.guestSession.inited,
        shopId: state.shopInfo.id,
    }),
    (dispatch) => ({
        initGuestSession: () => dispatch(guestSessionActions.init())
    })
)((props) => {
    const {
        guestSessionInited,
        shopId,
        initGuestSession,
        children,
    } = props

    useEffect(() => {
        if (guestSessionInited) return

        axios({
            method: 'PUT',
            url: '/api/cart',
            data: {
                shop_id: shopId,
            }
        })
        .then(() => {
            initGuestSession()
        })
        .catch((err) => {
            console.error('Failed to init guesst session.', err)
        })
    }, [guestSessionInited])

    if (guestSessionInited) {
        return children
    } else {
        return null
    }
})

export {
    guestSessionReducer,
    guestSessionActions,
    GuestSessionProvider,
}