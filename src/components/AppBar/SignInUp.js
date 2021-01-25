import React, { useRef, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import clsx from 'clsx'
import { BsFillPersonFill } from 'react-icons/bs'
import { actions as userInfoActions } from '../../store/user_info'
import axios from '../../utils/axios'
import { useAbort, createAbort } from '../../utils/abort'
import { useDropScreen } from '../DropScreen'
import TopBar from '../TopBar'
import RectButton from '../RectButton'
import TextInput from '../TextInput'
import { LoadingRing } from '../Loading'

const SignInUp = connect(
    state => ({
        deviceType: state.deviceInfo.type,
    })
)(props => {
    const {
        deviceType,
    } = props

    const refDropScreen = useDropScreen()

    return (
        <TopBar.Button
            deviceType={deviceType}
            onClick={() => refDropScreen.current.open(<SignInPage />)}
        >
            <BsFillPersonFill/>{deviceType !== 'mobile' && '\xA0Sign in'}
        </TopBar.Button>
    )
})

const SignInUpRoot = styled.div`
    width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;

    &.mobile {
        width: unset;
        max-width: 400px;
        margin: 0 auto;
    }

    .Title {
        position: relative;
        height: 50px;
        width: 80%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;

        &::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            height: 1px;
            width: 100%;
            background-color: #d4d4d4;
        }
    }

    .TextInput {
        width: 80%;
        height: 36px;
        margin-top: 25px;
    }

    .MuiButton-root {
        width: 80%;
        margin-top: 25px;
    }

    .FinishButton {
        width: 80%;
        margin: 10px 0px 25px 0px;
    }

    .SignInError {
        text-align: center;
        width: 80%;
        margin-top: 5px;
    }

    .Hint {
        width: 80%;
        display: flex;
        align-items: center;
    }

    .Desc, .HintError {
        width: 80%;
        margin: 25px 0px 0px 0px;
    }
`

const SignInPage = connect(
    state => ({
        deviceType: state.deviceInfo.type,
    }),
    dispatch => ({
        signIn: () => dispatch(userInfoActions.refetch())
    })
)(props => {
    const {
        deviceType,
        signIn,
    } = props

    const refDropScreen = useDropScreen()
    const refUsername = useRef(null)
    const refPassword = useRef(null)

    const [busy, setBusy] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [signInError, setSignInError] = useState('')
    const abort = useAbort()

    const handleSignIn = () => {
        if (busy) return

        let usernameError = ''
        if (!refUsername.current.value) usernameError = 'Please enter username.'
        let passwordError = ''
        if (!refPassword.current.value) passwordError = 'Please enter password.'

        setUsernameError(usernameError)
        setPasswordError(passwordError)
        setSignInError('')

        if (usernameError || passwordError) return
        setBusy('HANDLE_SIGNIN')

        const abortTk = abort.signup()
        axios({
            method: 'POST',
            url: '/api/user/session',
            data: {
                username: refUsername.current.value,
                password: refPassword.current.value,
            },
            cancelToken: abortTk.axiosCancelTk()
        })
        .then((res) => {
            signIn()
            location.href = `${location.origin}#/home`
        })
        .catch((err) => {
            if (abort.isAborted) return
            switch (err.response.data.type) {
                case 'Unauthorized':
                    setSignInError('Invalid username or password.')
                    break
                default:
                    setSignInError('Encountered an unknown error, please try again.')
            }
        })
        .finally(() => {
            if (!abortTk.isAborted()) {
                abort.signout(abortTk)
                setBusy('')
            }
        })
    }

    const handleSignUp = () => {
        if (busy) return
        setBusy('HANDLE_SIGNUP')

        const abortTk = abort.signup()
        axios({
            method: 'POST',
            url: '/api/user/register',
            cancelToken: abortTk.axiosCancelTk(),
        })
        .then(res => {
            refDropScreen.current.open(<SignUpPage/>)
        })
        .catch(err => console.log(err.response))
        .finally(() => {
            if (!abortTk.isAborted()) {
                abort.signout(abortTk)
                setBusy('')
            }
        })
    }
    
    return (
        <SignInUpRoot className={clsx(deviceType)}>
            <p className={clsx('Title', 'Text_header_2nd')}>Sign in</p>
            <TextInput
                ref={refUsername}
                className='TextInput'
                label='Username'
                error={usernameError ? true : false}
                helperText={usernameError}
            />
            <TextInput
                ref={refPassword}
                className='TextInput'
                label='Password'
                type='password'
                error={passwordError ? true : false}
                helperText={passwordError}    
            />
            <RectButton
                onClick={handleSignIn}
                loading={busy === 'HANDLE_SIGNIN'}
            >
                Sign in
            </RectButton>
            {signInError && <span className={clsx('SignInError', 'Text_error')}>{signInError}</span>}
            <p className='Hint'>
                Don't have an account?&nbsp;
                {
                    busy === 'HANDLE_SIGNUP' ?
                    <LoadingRing stroke='#dcdcdc' radius={8}/> :
                    <a className='Text_link_highlight' onClick={handleSignUp}>Sign up here</a>
                }
            </p>
        </SignInUpRoot>
    )
})

class Error {
    constructor(type) {
        this.type = type
    }

    static fromAxios(error) {
        return new Error(error.response.data.type)
    }
}

class Step {
    constructor(props = {}, component) {
        let errors = props.errors || {}
        let input = errors.input || {}
        let check = errors.check || {}
        let hint = errors.hint || {}
        this.props = {
            ...props,
            errors: {
                ...errors,
                input: {
                    InvalidData: 'Invalid format.',
                    ...input,
                },
                check: {
                    CheckFailed: 'Not match.',
                    ...check,
                },
                hint: {
                    NoValidCookie: 'Operation expired, please try again.',
                    SessionExpired: 'Operation expired, please try again.',
                    OperationFailed: 'Operation failed, please try again.',
                    ...hint,
                },
            }
        }
        this.component = component
    }

    render(props) {
        return (
            <this.component {...this.props} {...props}/>
        )
    }
}

class InputStep extends Step {
    constructor(props) {
        super(
            props,
            (props) => <StepComponent {...props}/>,
        )
    }

    prepare() {
        return axios({
            method: 'GET',
            url: `/api/user/register?operation=${this.props.operation}`
        })
        .then((res) => {
            return {
                inputDefaultValue: res.data.data,
            }
        })
    }
}

class PasswordStep extends Step {
    constructor(props) {
        super(
            {
                label: 'Password',
                desc: 'Please enter password. Password must contain upper case letter, lower case letter and number, and only letters and numbers.',
                operation: 'password',
                ...props,
                isPassword: true,
            },
            (props) => <StepComponent {...props}/>,
        )
    }
}

class StepComponent extends React.Component {
    constructor(props) {
        super(props)
        this.inputRef = React.createRef()
        this.checkRef = React.createRef()
        this.abort = createAbort()
        this.state = {
            busy: '',
            inputError: '',
            checkError: '',
            hintError: '',
        }
    }

    componentWillUnmount() {
        this.abort.abort()
    }

    next() {
        if (this.state.busy) return

        const abort = this.abort.signup()
        this.setState({
            busy: 'NEXT',
            inputError: '',
            checkError: '',
            hintError: '',
        })
        Promise.resolve()
        .then(() => {
            if (this.props.isPassword && this.inputRef.current.value !== this.checkRef.current.value) {
                throw new Error('CheckFailed')
            }
            return axios({
                method: 'PATCH',
                url: '/api/user/register',
                data: {
                    operation: this.props.operation,
                    data: this.inputRef.current.value,
                },
                cancelToken: abort.axiosCancelTk()
            })
            .catch(err => {
                throw Error.fromAxios(err)
            })
        })
        .then(this.props.onNextCB)
        .catch(err => {
            let errors = this.props.errors
            console.log(err)
            if (errors.input[err.type]) {
                this.setState({
                    inputError: errors.input[err.type],
                })
            } else if (errors.check[err.type]) {
                this.setState({
                    checkError: errors.check[err.type],
                })
            } else if (errors.hint[err.type]) {
                this.setState({
                    hintError: errors.check[err.type],
                })
            } else {
                this.setState({
                    hintError: 'Encountered an unknown error, please try again.',
                })
            }
        })
        .finally(() => {
            if (!abort.isAborted()) {
                this.abort.signout(abort)
                this.setState({ busy: '' })
            }
        })
    }

    back() {
        if (this.state.busy) return
        const abort = this.abort.signup()
        this.setState({ busy: 'BACK' })
        Promise.resolve()
        .then(this.props.onBackCB)
        .finally(() => {
            if (!abort.isAborted()) {
                this.abort.signout(abort)
                this.setState({ busy: '' })
            }
        })
    }

    render() {
        return (<>
            {
                this.state.hintError ?
                <p className={clsx('HintError', 'Text_highlight')}>{this.state.hintError}</p> :
                <p className='Desc'>{this.props.desc}</p>
            }
            <TextInput
                ref={this.inputRef}
                className='TextInput'
                label={this.props.label}
                type={this.props.isPassword ? 'password' : 'string'}
                error={this.state.inputError ? true : false}
                helperText={this.state.inputError}
                defaultValue={this.props.inputDefaultValue}
            />
            {
                this.props.isPassword ?
                <TextInput
                    ref={this.checkRef}
                    className='TextInput'
                    label='Enter again'
                    type='password'
                    error={this.state.checkError ? true : false}
                    helperText={this.state.checkError}
                /> : null
            }
            {
                this.props.onNextCB &&
                <RectButton
                    onClick={this.next.bind(this)}
                    loading={this.state.busy === 'NEXT'}
                >
                    Next
                </RectButton>
            }
            {
                this.props.onBackCB &&
                <RectButton
                    onClick={this.back.bind(this)}
                    loading={this.state.busy === 'BACK'}
                >
                    Back
                </RectButton>
            }
        </>)
    }
}

const SIGNUP_STEPS = [
    new InputStep({
        label: 'Email',
        desc: 'Please enter your email.',
        operation: 'email',
        errors: {
            input: {
                UniqueDataConflict: 'This email has been registered.',
            },
        },
    }),
    new InputStep({
        label: 'Phone',
        desc: 'Please enter your phone number.',
        operation: 'phone',
        errors: {
            input: {
                UniqueDataConflict: 'This phone number has been registered.',
            },
        },
    }),
    new InputStep({
        label: 'Username',
        desc: 'Please enter username.',
        operation: 'username',
        errors: {
            input: {
                UniqueDataConflict: 'This username has been registered.',
            },
        },
    }),
    new PasswordStep({}),
]

const SignUpPage = connect(
    state => ({
        deviceType: state.deviceInfo.type,
    })
)(props => {
    const {
        deviceType,
    } = props

    const [step, setStep] = useState(0)
    const [stepProps, setStepProps] = useState({})
    const [finish, setFinish] = useState(false)

    const refDropScreen = useDropScreen()

    let onNextCB
    let nextStep = SIGNUP_STEPS[step + 1]
    if (nextStep && nextStep.prepare) {
        onNextCB = () => {
            return nextStep.prepare()
                .then((props) => setStepProps(props))
                .catch(() => setStepProps({}))
                .finally(() => {
                    setStep(step + 1)
                })
        }
    } else if (nextStep) {
        onNextCB = () => {
            setStepProps({})
            setStep(step + 1)
        }
    } else {
        onNextCB = () => {
            return axios({
                method: 'PATCH',
                url: '/api/user/register',
                data: {
                    operation: 'submit'
                }
            })
            .then(() => setFinish(true))
            .catch((err) => {
                throw Error.fromAxios(err)
            })
        }
    }

    let onBackCB
    let prevStep = SIGNUP_STEPS[step - 1]
    if (prevStep && prevStep.prepare) {
        onBackCB = () => {
            return prevStep.prepare()
                .then((props) => setStepProps(props))
                .catch(() => setStepProps({}))
                .finally(() => setStep(step - 1))
        }
    } else if (prevStep) {
        onBackCB = () => {
            setStepProps({})
            setStep(step - 1)
        }
    }

    return (
        <SignInUpRoot className={clsx(deviceType)}>
            <p className={clsx('Title', 'Text_header_2nd')}>Sign up</p>
            {
                finish ?
                    <>
                        <p className='Hint'>Congratulations! You have successfully signed up.</p>
                        <RectButton
                            className='FinishButton'
                            onClick={() => refDropScreen.current.open(<SignInPage/>)}
                        >Sign in</RectButton>
                    </>
                :
                    <>
                        {SIGNUP_STEPS[step].render({ onNextCB: onNextCB, onBackCB: onBackCB, ...stepProps })}
                        <p className='Hint'>
                            Already have an account?&nbsp;
                            <a
                                className='Text_link_highlight'
                                onClick={() => refDropScreen.current.open(<SignInPage/>)}
                            >
                                Sign in here
                            </a>
                        </p>
                    </>
            }
        </SignInUpRoot>
    )
})

export default SignInUp