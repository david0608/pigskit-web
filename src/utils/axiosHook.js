import { useReducer, useEffect } from 'react';
import axios from 'axios';

const actionTypes = {
    send: 'SEND',
    response: 'RESPONSE',
}

const initState = {
    method: '',
    url: '',
    body: {},
    isLoading: false,
    data: null,
    error: null,
}

const reducer = (state, action = {}) => {
    switch (action.type) {
        case actionTypes.send:
            if (state.isLoading) {
                return state;
            } else {
                return {
                    method: action.payload.method,
                    url: action.payload.url,
                    body: action.payload.body,
                    isLoading: true,
                    data: null,
                    error: null,
                }
            }

        case actionTypes.response:
            return {
                method: '',
                url: '',
                body: {},
                isLoading: false,
                data: action.payload.data,
                error: action.payload.error,
            }

        default:
            return state;
    }
}

const useAxios = () => {
    const [state, dispatch] = useReducer(reducer, initState);

    useEffect(() => {
        if (state.method) {
            const cancel = axios.CancelToken.source();
            axios({
                method: state.method,
                url: state.url,
                data: state.body,
                CancelToken: cancel.token,
            })
            .then((res) => {
                dispatch({
                    type: actionTypes.response,
                    payload: {
                        data: res,
                    }
                })
            })
            .catch((err) => {
                dispatch({
                    type: actionTypes.response,
                    payload: {
                        error: err
                    }
                })
            });
            return () => cancel.cancel();
        }
    }, [state.method]);

    const sendRequest = (payload) => {
        dispatch({
            type: actionTypes.send,
            payload: payload,
        })
    };

    return [state, sendRequest];
}

// Not used currently. Reserved for reference of the usage of 'useReducer' hook.
// export {
//     useAxios
// }