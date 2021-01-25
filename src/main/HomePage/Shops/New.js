import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import axios from '../../../utils/axios'
import { useAbort } from '../../../utils/abort'
import { actions as userShopsActions } from '../../../store/user_shops'
import { FloatItem } from '../../../components/FloatList'
import TextInput from '../../../components/TextInput'
import RectButton from '../../../components/RectButton'

const NewRoot = styled.div`
    >.MuiTextField-root {
        margin: 15px 0px 25px;
        width: 200px;
    }

    >.FoldItem-Root {
        width: 100%;

        >.MuiButton-root {
            height: 30px;
            width: 100%;
        }
    }
`

const New = connect(
    () => ({}),
    dispatch => ({
        refetchShops: () => dispatch(userShopsActions.refetch()),
    }),
)(props => {
    const {
        refetchShops,
    } = props

    const refName = useRef(null)
    const refFoldItem = useRef(null)

    const [busy, setBusy] = useState(false)
    const [errors, setErrors] = useState({
        input: '',
        hint: '',
    })

    const abort = useAbort()

    const handleCreate = e => {
        if (busy) return

        let nextErrors = {
            input: '',
            hint: '',
        }
        let checked = true

        if (!refName.current.value) {
            nextErrors.input = 'Please enter shop name.'
            checked = false
        }

        setErrors(nextErrors)
        if (!checked) return

        let abortTk = abort.signup()
        setBusy(true)
        axios({
            method: 'POST',
            url: '/api/shop',
            data: {
                shop_name: refName.current.value,
            },
            cancelToken: abortTk.axiosCancelTk(),
        })
        .then(res => {
            if (!abortTk.isAborted() && res.status === 200) {
                refetchShops()
                refFoldItem.current.startFold()
            }
        })
        .catch(err => {
            if (!abortTk.isAborted()) {
                switch (err.response.data.type) {
                    case 'ShopNameUsed':
                        setErrors({
                            ...errors,
                            hint: 'Shop name has been used.',
                        })
                        break
                    default:
                        setErrors({
                            ...errors,
                            hint: 'Encountered an unknown error, please try again.',
                        })
                }
            }
            console.log(err.response)
        })
        .finally(() => {
            if (!abortTk.isAborted()) {
                abort.signout(abortTk)
                setBusy(false)
            }
        })
    }

    return (
        <NewRoot>
            Create a new shop.
            <TextInput
                ref={refName}
                label='Shop name'
                error={errors.input ? true : false}
                helperText={errors.input}
            />
            {errors.hint && <span className={clsx('Text_error')}>{errors.hint}</span>}
            <FloatItem
                ref={refFoldItem}
                manualFold
            >
                <RectButton
                    onClick={handleCreate}
                    loading={busy}
                >
                    Create    
                </RectButton>
            </FloatItem>
        </NewRoot>
    )
})

export default New