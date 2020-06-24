import { useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { userInfoActions } from '../store';

const mapDispatchToProps = (dispatch) => ({
    initUserInfo: (info = {}) => dispatch(userInfoActions.init(info))
})

const Session = connect(
    () => {},
    mapDispatchToProps,
)((props) => {
    const { initUserInfo } = props;

    useEffect(() => {
        axios({
            methid: 'GET',
            url: '/api/user/session',
        })
        .then((res) => {
            if (res.status === 200) {
                initUserInfo({
                    signedIn: true,
                    ...res.data
                })
            } else {
                throw 'Unexpected';
            }
        })
        .catch(() => {
            initUserInfo({
                signedIn: false,
            })
        });
    }, []);
    
    return null;
})

// For development usage.
// const Session = connect(
//     () => ({}),
//     mapDispatchToProps,
// )((props) => {
//     const { initUserInfo } = props;

//     useEffect(() => {
//         initUserInfo({
//             signedIn: true,
//         })
//     }, [])

//     return null;
// })

export default Session;