import React, { useRef, useState } from 'react'
import { connect } from 'react-redux'
import clsx from 'clsx'
import { MdEdit } from 'react-icons/md'
import axios from '../../utils/axios'
import { useAbort } from '../../utils/abort'
import { TryFetchImage } from '../../components/Image'
import ImageInput from '../../components/utils/ImageInput'
import { Switch, useSwitch } from '../../components/utils/Switch'
import TextInput from '../../components/utils/TextInput'
import Button from '../../components/utils/Button'
import CircButton from '../../components/utils/CircButton'
import Decorate from '../../components/Decorate'
import { LoadingRing } from '../../components/Loading'
import { pigskit_restful_origin } from '../../utils/service_origins'
import '../../styles/text.less'
import './index.less'

const Profile = connect (
    state => ({
        deviceType: state.deviceInfo.type,
    })
)(props => {
    const {
        deviceType,
    } = props

    return (
        <Switch
            className={clsx('Profile-root', deviceType)}
            defaultContent={<Content/>}
            switchedContent={<Edit/>}
        />
    )
})

const Content = connect(
    state => ({
        username: state.userInfo.username,
        nickname: state.userInfo.nickname,
        email: state.userInfo.email,
        phone: state.userInfo.phone,
    })
)(props => {
    const {
        username,
        nickname,
        email,
        phone,
    } = props

    const toggleSwitch = useSwitch()
    
    return (
        <>
            <div className={clsx('Header', 'Text_header_2nd')}>
                Your profile
                <CircButton onClick={toggleSwitch}>
                    <MdEdit/>
                </CircButton>
            </div>
            <Decorate.DevideList className='Body'>
                <div className='Avatar'>
                    <span className='Text_bold'>
                        Avatar&nbsp;:&emsp;
                    </span>
                    <TryFetchImage
                        url={`/api/user/profile/avatar`}
                        presize
                    />
                </div>
                <Field
                    name='Username'
                    value={username}
                />
                <Field
                    name='Nickname'
                    value={nickname}
                />
                <Field
                    name='Email'
                    value={email}
                />
                <Field
                    name='Phone'
                    value={phone}
                />
            </Decorate.DevideList>
        </>
    )
})

const Edit = connect(
    state => ({
        deviceType: state.deviceInfo.type,
        username: state.userInfo.username,
        nickname: state.userInfo.nickname,
        email: state.userInfo.email,
        phone: state.userInfo.phone,
    })
)(props => {
    const {
        deviceType,
        username,
        nickname,
        email,
        phone,
    } = props

    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')

    const toggleSwitch = useSwitch()

    const refImageInput = useRef(null)
    const refNicknameInput = useRef(null)

    const abort = useAbort()

    const submit = () => {
        if (busy) return
        setBusy(true)
        setError('')

        const abortTk = abort.signup()
        Promise.resolve()
        .then(() => {
            const formData = new FormData()
            formData.append('nickname', refNicknameInput.current.value)
            if (refImageInput.current.shouldDeleteOriginImage) {
                formData.append('delete_avatar', true)
                return formData
            } else if (refImageInput.current.targetImageUrl) {
                return fetch(refImageInput.current.targetImageUrl)
                    .then(res => res.blob())
                    .then(image => {
                        formData.append('avatar', image)
                        return formData
                    })
            } else {
                return formData
            }
        })
        .then(formData => {
            return axios({
                method: 'PATCH',
                url: '/api/user/profile',
                data: formData,
                cancelToken: abortTk.axiosCancelTk(),
            })
        })
        .then(res => {
            if (abortTk.isAborted()) return
            location.reload()
        })
        .catch(err => {
            console.error(err)
            if (abortTk.isAborted()) return
            switch (err.response?.data?.type) {
                case 'PayloadTooLarge':
                    setError('Avatar image oversize.')
                    break
                default:
                    setError('Encountered an unknown error, please try again.')
            }
            
        })
        .finally(() => {
            if (abortTk.isAborted()) return
            abort.signout(abortTk)
            setBusy(false)
        })
    }
    
    return (<>
        <div className={clsx('Header', 'Text_header_2nd')}>
            Your profile
        </div>
        <Decorate.DevideList className='Body'>
            <div className='Avatar'>
                <span className='Text_bold'>
                    Avatar
                </span>
                <ImageInput
                    ref={refImageInput}
                    originImageSrc={`${pigskit_restful_origin()}/api/user/profile/avatar`}
                    vertical={deviceType === 'mobile'}
                />
            </div>
            <Field
                name='Username'
                value={username}
            />
            <EditField
                name='Nickname'
                inputProps={{
                    ref: refNicknameInput,
                    defaultValue: nickname
                }}
            />
            <Field
                name='Email'
                value={email}
            />
            <Field
                name='Phone'
                value={phone}
            />
        </Decorate.DevideList>
        {error && <div className={clsx('Error', 'Text_error')}>{error}</div>}
        <div className='Footer'>
            <Button onClick={toggleSwitch}>Cancel</Button>
            <Button onClick={submit}>
                {
                    busy ?
                    <LoadingRing
                        radius={8}
                        stroke='#888888'
                    /> :
                    'Ok'
                }
            </Button>
        </div>
    </>
    )
})

const Field = props => {
    const {
        className,
        name,
        value,
    } = props

    return (
        <div className={clsx('Field', className)}>
            <span className='Text_bold'>
                {name}&nbsp;:&emsp;
            </span>
            <div className={clsx('Right', !value && 'Text_remark')}>
                {value || 'no data'}
            </div>
        </div>
    )
}

const EditField = props => {
    const {
        className,
        name,
        inputProps = {},
    } = props

    return (
        <div className={clsx('Field', className)}>
            <span className='Text_bold'>
                {name}&nbsp;:&emsp;
            </span>
            <TextInput
                {...inputProps}
                className='Right'
            />
        </div>
    )
}

export default Profile