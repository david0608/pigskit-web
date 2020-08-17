import React, { useRef, useState } from 'react'
import { BsFillPersonFill } from 'react-icons/bs'
import axios from '../../utils/axios'
import { useAbort, createAbort } from '../../utils/abort'
import { useDropScreen } from '../DropScreen'
import NavButton from './utils/NavButton'
import RectButton from '../utils/RectButton'
import TextInput from '../utils/TextInput'
import './NavBarSignInUp.less'

const NavBarSignInUp = React.memo(
    (props) => {
        const {
            className,
            deviceType,
        } = props

        const refDropScreen = useDropScreen()

        return (
            <NavButton
                className={className}
                deviceType={deviceType}
                onClick={() => refDropScreen.current.open(<SignInPage/>)}
            >
                <BsFillPersonFill/>{deviceType === 'mobile' ? null : 'Sign in'}
            </NavButton>
        )
    }
)

const SignInPage = () => {
    const refDropScreen = useDropScreen()
    const refUsername = useRef(null)
    const refPassword = useRef(null)

    const [busy, setBusy] = useState(false)
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [signInError, setSignInError] = useState('')
    const abort = useAbort()

    const handleSignIn = () => {
        if (!busy) {
            setUsernameError('')
            setPasswordError('')
            setSignInError('')
            let checked = true
            if (!refUsername.current.value) {
                setUsernameError('Please enter username.')
                checked = false
            }
            if (!refPassword.current.value) {
                setPasswordError('Please enter password.')
                checked = false
            }
            if (checked) {
                setBusy(true)
                axios({
                    method: 'POST',
                    url: '/api/user/session',
                    data: {
                        username: refUsername.current.value,
                        password: refPassword.current.value,
                    },
                })
                .then((res) => {
                    if (res.status === 200) {
                        location.href = `${location.origin}/home`
                    }
                })
                .catch((err) => {
                    switch (err.response.data.type) {
                        case 'Unauthorized':
                            setSignInError('Invalid username or password.')
                            break
                        default:
                            setSignInError('Encountered an unknown error, please try again.')
                    }
                })
                .finally(() => setBusy(false))
            }
        }
    }

    const handleSignUp = () => {
        if (!busy) {
            const abortTk = abort.signup()
            setBusy(true)
            axios({
                method: 'POST',
                url: '/api/user/register',
                cancelToken: abortTk.axiosCancelTk(),
            })
            .then((res) => {
                if (res.status === 200) refDropScreen.current.open(<SignUpPage/>)
            })
            .catch((err) => console.log(err.response))
            .finally(() => {
                if (!abortTk.isAborted()) {
                    abort.signout(abortTk)
                    setBusy(false)
                }
            })
        }
    }

    return (
        <div className='SignInPageRoot'>
            <p className='Title'>Sign in</p>
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
                className='RectButton'
                onClick={handleSignIn}
            >
                Sign in
            </RectButton>
            {signInError ? <span className='SignInError'>{signInError}</span> : null}
            <p className='Hint'>
                Don't have an account? <a onClick={handleSignUp}>Sign up here</a>
            </p>
        </div>
    )
}

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
        this.inputdRef = React.createRef()
        this.checkRef = React.createRef()
        this.abort = createAbort()
        this.state = {
            busy: false,
            inputError: '',
            checkError: '',
            hintError: '',
        }
    }

    componentWillUnmount() {
        this.abort.abort()
    }

    next() {
        if (!this.state.busy) {
            const abort = this.abort.signup()
            this.setState({
                busy: true,
                inputError: '',
                checkError: '',
                hintError: '',
            })
            Promise.resolve()
            .then(() => {
                if (this.props.isPassword && this.inputdRef.current.value !== this.checkRef.current.value) {
                    throw new Error('CheckFailed')
                }
            })
            .then(() => {
                return axios({
                    method: 'PATCH',
                    url: '/api/user/register',
                    data: {
                        operation: this.props.operation,
                        data: this.inputdRef.current.value,
                    },
                    cancelToken: abort.axiosCancelTk()
                })
                .catch((err) => {
                    throw Error.fromAxios(err)
                })
            })
            .then(this.props.onNextCB)
            .then(() => {
                if (!abort.isAborted()) {
                    this.abort.signout(abort)
                    this.setState({ busy: false })
                }
            })
            .catch((err) => {
                let errors = this.props.errors
                if (errors.input[err.type]) {
                    this.setState({
                        busy: false,
                        inputError: errors.input[err.type],
                    })
                } else if (errors.check[err.type]) {
                    this.setState({
                        busy: false,
                        checkError: errors.check[err.type],
                    })
                } else if (errors.hint[err.type]) {
                    this.setState({
                        busy: false,
                        hintError: errors.check[err.type],
                    })
                } else {
                    this.setState({
                        busy: false,
                        hintError: 'Encountered an unknown error, please try again.',
                    })
                }
            })
        }
    }

    back() {
        if (!this.state.busy) {
            this.setState({ busy: true })
            Promise.resolve()
            .then(this.props.onBackCB)
            .finally(() => this.setState({ busy: false }))
        }
    }

    render() {
        return (<>
            {
                this.state.hintError ?
                <p className='HintError'>{this.state.hintError}</p> :
                <p className='Desc'>{this.props.desc}</p>
            }
            <TextInput
                ref={this.inputdRef}
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
                this.props.onNextCB ?
                <RectButton className='RectButton' onClick={() => this.next()}>Next</RectButton> : null
            }
            {
                this.props.onBackCB ?
                <RectButton className='RectButton' onClick={() => this.back()}>Back</RectButton> : null
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

const SignUpPage = (props) => {
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
        <div className='SignUpPageRoot'>
            <p className='Title'>Sign up</p>
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
                            Already have an account? <a
                                onClick={() => refDropScreen.current.open(<SignInPage/>)}
                            >Sign in here</a>
                        </p>
                    </>
            }
        </div>
    )
}

export default NavBarSignInUp