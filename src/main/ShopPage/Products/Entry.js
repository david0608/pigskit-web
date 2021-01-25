import React, { useState , useRef } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import clsx from 'clsx'
import { MdEdit } from 'react-icons/md'
import { IoMdTrash } from 'react-icons/io'
import { actions as shopProductsActions } from '../../../store/shop_products'
import axios from '../../../utils/axios'
import { useAbort } from '../../../utils/abort'
import Abstract from '../../../components/Abstract'
import { FloatList, FloatItem } from '../../../components/FloatList'
import Button from '../../../components/Button'
import CircButton from '../../../components/CircButton'
import { Image } from '../../../components/Image'
import Decorate from '../../../components/Decorate'
import Devider from '../../../components/Devider'

const EntryRoot = styled(Abstract)`
    .Product-outline {
        padding: 12px 16px;
        display: flex;

        >div {
            overflow: hidden;
            text-overflow: ellipsis;
        }

        >.Name {
            flex: 1;
        }

        >.Description {
            flex: 2;
            display: flex;
            align-items: center;
        }

        >.Price {
            flex: 1;
            justify-content: flex-end;
        }
    }

    .Product-detail {
        padding: 20px 16px;

        >.Title {
            display: flex;
            align-items: center;

            >.Name {
                flex: 1;
            }

            >.Delete {
                z-index: 1;

                .DeleteProduct-root {
                    width: 200px;
                    padding: 12px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    >* {
                        margin-top: 8px;
                    }

                    >.Footer {
                        display: flex;

                        >.FloatItem-Root>button {
                            width: 64px;
                            height: 32px;
                            margin: 0px 8px;
                        }
                    }
                }
            }

            >.FloatList-Root {
                z-index: 1;
            }
        }

        >.Image-root.presize {
            margin: 8px 0px 0px 40px;
            max-width: 400px;

            &::before {
                padding-top: 50%;
            }
        }

        >.Info {
            padding: 8px 0px 0px 40px;
            display: flex;

            >.Description {
                flex: 1;
            }
        }

        >.Customize {
            margin-top: 8px;

            >.Name {
                margin-top: 8px;
            }

            >.Description {
                padding: 8px 0px 0px 40px;
            }

            >.Selection {
                display: flex;
                align-items: center;
                padding: 8px 0px 0px 40px;

                >.Name {
                    flex: 1;
                }
            }
        }

        &.mobile {
            >.Image-root {
                margin: 8px 0px 0px 0px;
            }

            >.Info {
                padding: 8px 0px 0px 0px;
            }

            >.Customize {
                >.Description {
                    padding: 8px 0px 0px 0px;
                }

                >.Selection {
                    padding: 8px 0px 0px 0px;
                }
            }
        }
    }
`

const Entry = props => {
    const {
        data,
    } = props

    return (
        <EntryRoot>
            <Outline data={data}/>
            <Detail data={data}/>
        </EntryRoot>
    )
}

const Outline = connect(
    state => ({
        deviceType: state.deviceInfo.type,
    })
)(props => {
    const {
        deviceType,
        data,
    } = props

    return (
        <div className={clsx('Product-outline', deviceType)}>
            <div className='Name'>{data.name}</div>
            {deviceType !== 'mobile' && <span className={clsx('Description', 'Text_remark')}>{data.description}</span>}
            <Decorate.Price className='Price'>{data.price}</Decorate.Price>
        </div>
    )
})

const Detail = connect(
    state => ({
        deviceType: state.deviceInfo.type,
        shopId: state.userShopInfo.id,
    })
)(props => {
    const {
        deviceType,
        shopId,
        data,
    } = props

    return (
        <div className={clsx('Product-detail', deviceType)}>
            <div className='Title'>
                <span className={clsx('Name', 'Text_header_2nd')}>{data.name}</span>
                <CircButton
                    onClick={() => location.href = `${location.origin}/#/shop/${shopId}/edit_product/${data.key}`}
                    children={<MdEdit/>}
                />
                &emsp;
                <FloatList
                    className='Delete'
                    rightAligned
                    label={<CircButton children={<IoMdTrash/>}/>}
                    children={<DeleteProduct productKey={data.key}/>}
                />
            </div>
            <Image
                url={data.hasPicture && `/api/shop/product/image?shop_id=${shopId}&product_key=${data.key}`}
                presize
            />
            <div className='Info'>
                <span className={clsx('Description', 'Text_remark')}>{data.description}</span>
                <Decorate.Price>{data.price}</Decorate.Price>
            </div>
            {
                data.customizes.map(cus => (
                    <div key={cus.key} className='Customize'>
                        <Devider.Light/>
                        <div className={clsx('Name', 'Text_header_3rd')}>{cus.name}</div>
                        {cus.description && <div className={clsx('Description', 'Text_remark')}>{cus.description}</div>}
                        {
                            cus.selections.map(sel => (
                                <div key={sel.key} className='Selection'>
                                    <div className='Name'>{sel.name}</div>
                                    <Decorate.Price>{sel.price}</Decorate.Price>
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    )
})

const DeleteProduct = connect(
    state => ({
        shopId: state.userShopInfo.id,
    }),
    dispatch => ({
        refetchProducts: () => dispatch(shopProductsActions.refetch()),
    })
)(props => {
    const {
        shopId,
        refetchProducts,
        productKey,
    } = props

    const [state, setState] = useState({
        busy: false,
        error: '',
    })

    const refFloatItemYes = useRef(null)

    const abort = useAbort()

    const deleteProduct = () => {
        if (state.busy) return

        setState({
            busy: true,
            error: '',
        })

        const abortTk = abort.signup()
        axios({
            method: 'DELETE',
            url: '/api/shop/product',
            data: {
                shop_id: shopId,
                product_key: productKey,
            },
            cancelToken: abortTk.axiosCancelTk(),
        })
        .then(res => {
            if (abortTk.isAborted()) return
            refFloatItemYes.current.startFold()
            refetchProducts()
        })
        .catch(err => {
            console.error(err)
            if (abortTk.isAborted()) return
            switch (err.response.data.type) {
                case 'Unauthorized':
                    setState({ error: 'Permission denied. Please check.' })
                    break
                default:
                    setState({ error: 'Encountered an unknown error. Please try again.' })
            }
            setState({ error: true })
        })
        .finally(() => {
            if (abortTk.isAborted()) return
            setState({ busy: false })
        })
    }

    return (
        <div className='DeleteProduct-root'>
            Are you sure to delete the product?
            {state.error && <div className={clsx('Text_error', 'Text_fine')}>{state.error}</div>}
            <div className='Footer'>
                <FloatItem
                    children={<Button children='No'/>}
                />
                <FloatItem
                    ref={refFloatItemYes}
                    manualFold
                    children={
                        <Button
                            onClick={deleteProduct}
                            children='Yes'
                            loading={state.busy}
                        />
                    }
                />
            </div>
        </div>
    )
})

export default Entry
