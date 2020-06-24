import React, { useState, useRef } from 'react'
import axios from 'axios';
import ControlBar from '../../components/ControlBar'
import TextInput from '../../components/utils/TextInput'
import Button from '../../components/utils/Button'
import './ShopsCtrlBar.less'

const ShopsCtrlBar = () => {

    return (
        <ControlBar
            newDropDownContent={<NewShops/>}
        />
    )
}

const NewShops = () => {
    const refName = useRef(null)
    const refDropDownItem = useRef(null)

    const [busy, setBusy] = useState(false)
    const [inputError, setInputError] = useState('')
    const [hintError, setHintError] = useState('')

    const handleCreate = (e) => {
        if (!busy) {
            setInputError('')
            setHintError('')
            let checked = true
            if (!refName.current.value) {
                setInputError('Please enter shop name.')
                checked = false
            }
            if (checked) {
                setBusy(true)
                axios({
                    method: 'POST',
                    url: '/api/shop',
                    data: {
                        shop_name: refName.current.value,
                    }
                })
                .then((res) => {
                    if (res.status === 200) {
                        refName.current.value = ''
                        refDropDownItem.current.startFold()
                    }
                })
                .catch((err) => {
                    switch (err.response.data.type) {
                        case 'ShopNameUsed':
                            setHintError('Shop name has been used.')
                            break
                        default:
                            setHintError('Encountered an unknown error, please try again.')
                    }
                    console.log(err.response)
                })
                .finally(() => setBusy(false))
            }
        }
    }

    return (
        <div className='NewShop-Root'>
            <span className='Desc'>Create a new shop.</span>
            <TextInput
                ref={refName}
                label='Shop name'
                error={inputError ? true : false}
                helperText={inputError}
            />
            {hintError ? <p className='HintError'>{hintError}</p> : null}
            <dropdown-item ref={refDropDownItem} manualFold>
                <Button
                    onClick={handleCreate}
                >
                    Create    
                </Button>
            </dropdown-item>
        </div>
    )
}

export default ShopsCtrlBar