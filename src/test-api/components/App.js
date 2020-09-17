import React, { useRef } from 'react'
import clsx from 'clsx'
import axios from '../../utils/axios'
import '../less/App.less'

const testApi = (props) => {
    axios(props)
    .then(res => console.log(res))
    .catch(err => console.log(err))
}

const redirect_href = (url) => {
    window.location.href = url
}

const redirect_replace = (url) => {
    window.location.replace(url)
}

const Button = (props) => {
    const {
        className,
        onClick,
        children
    } = props

    return (
        <button
            className={clsx('TestButton', className)}
            onClick={onClick}    
        >
            {children}
        </button>
    )
}

const InputField = (props) => {
    const {
        className,
        inputRef,
        label,
        ...otherProps
    } = props
    
    return (
        <div className={clsx('InputFieldRoot', className)}>
            <p>{label}</p>
            <input type="text" ref={inputRef} {...otherProps}/>
        </div>
    )
}

const TestUserApi = () => {
    const refUsername = useRef(null)
    const refPassword = useRef(null)

    const signin = () => testApi({
        method: 'POST',
        url: '/api/user/session',
        data: {
            username: refUsername.current.value,
            password: refPassword.current.value,
        }
    })

    const signout = () => testApi({
        method: 'DELETE',
        url: '/api/user/session'
    })

    const session = () => testApi({
        method: 'GET',
        url: '/api/user/session',
    })

    return (
        <div className="TestRoot">
            <div className="TestButtonContainer">
                <Button onClick={signin}>signin</Button>
                <Button onClick={signout}>signout</Button>
                <Button onClick={session}>session</Button>
            </div>
            <div className="TestInputContainer">
                <InputField inputRef={refUsername} label={"Username"} />
                <InputField inputRef={refPassword} label={"Password"} />
            </div>
        </div>
    )
}

const TestRegisterApi = () => {
    const refEmail = useRef(null)
    const refPhone = useRef(null)
    const refUsername = useRef(null)
    const refPassword = useRef(null)

    const startRegister = () => testApi({
        method: 'POST',
        url: '/api/user/register',
    })

    const submitEmail = () => testApi({
        method: 'PATCH',
        url: '/api/user/register',
        data: {
            operation: "email",
            data: refEmail.current.value
        }
    })

    const submitPhone = () => testApi({
        method: 'PATCH',
        url: '/api/user/register',
        data: {
            operation: "phone",
            data: refPhone.current.value
        }
    })

    const submitUsername = () => testApi({
        method: 'PATCH',
        url: '/api/user/register',
        data: {
            operation: "username",
            data: refUsername.current.value
        }
    })
    
    const submitPassword = () => testApi({
        method: 'PATCH',
        url: '/api/user/register',
        data: {
            operation: "password",
            data: refPassword.current.value
        }
    })

    const register = () => testApi({
        method: 'PATCH',
        url: '/api/user/register',
        data: {
            operation: "submit"
        }
    })

    const getEmail = () => testApi({
        method: 'GET',
        url: '/api/user/register?operation=email',
    })
    
    const getPhone = () => testApi({
        method: 'GET',
        url: '/api/user/register?operation=phone',
    })

    const getUsername = () => testApi({
        method: 'GET',
        url: '/api/user/register?operation=username',
    })

    return (
        <div className="TestRoot">
            <div className="TestButtonContainer">
                <Button onClick={startRegister}>start register</Button>
                <Button onClick={submitEmail}>submit email</Button>
                <Button onClick={submitPhone}>submit phone</Button>
                <Button onClick={submitUsername}>submit username</Button>
                <Button onClick={submitPassword}>submit password</Button>
                <Button onClick={register}>register</Button>
                <Button onClick={getEmail}>get email</Button>
                <Button onClick={getPhone}>get phone</Button>
                <Button onClick={getUsername}>get username</Button>
            </div>
            <div className="TestInputContainer">
                <InputField inputRef={refEmail} label={"Email"} />
                <InputField inputRef={refPhone} label={"Phone"} />
                <InputField inputRef={refUsername} label={"Username"} />
                <InputField inputRef={refPassword} label={"Password"} />
            </div>
        </div>
    )
}

const TestShopApi = () => {
    const refShopName = useRef(null)
    const refShopId = useRef(null)
    const refMemberId = useRef(null)
    const refAuthority = useRef(null)
    const refPermission = useRef(null)

    const createShop = () => testApi({
        method: 'POST',
        url: '/api/shop',
        data: {
            shop_name: refShopName.current.value
        }
    })

    const addShopMember = () => testApi({
        method: 'POST',
        url: '/api/shop/member',
        data: {
            shop_id: refShopId.current.value,
            member_id: refMemberId.current.value
        }
    })
    
    const setShopMemberAuthority = () => testApi({
        method: 'PATCH',
        url: '/api/shop/member/authority',
        data: {
            shop_id: refShopId.current.value,
            member_id: refMemberId.current.value,
            authority: refAuthority.current.value,
            permission: refPermission.current.value
        }
    })
    

    return (
        <div className="TestRoot">
            <div className="TestButtonContainer">
                <Button onClick={createShop}>create shop</Button>
                <Button onClick={addShopMember}>add shop member</Button>
                <Button onClick={setShopMemberAuthority}>set shop member authority</Button>
            </div>
            <div className="TestInputContainer">
                <InputField inputRef={refShopName} label={"Shop Name"} />
                <InputField inputRef={refShopId} label={"Shop ID"} />
                <InputField inputRef={refMemberId} label={"Member ID"} />
                <InputField inputRef={refAuthority} label={"Authority"} />
                <InputField inputRef={refPermission} label={"Permission"} />
            </div>
        </div>
    )
}

const TestProductApi = () => {
    const refShopId = useRef(null)
    const refProductKey = useRef(null)
    const refCustomizeKey = useRef(null)
    
    const createProduct = (props) => {
        const {
            shop_id,
            payload,
        } = props

        const formData = new FormData()
        formData.append('shop_id', shop_id)
        formData.append('payload', payload)

        testApi({
            method: 'POST',
            url: '/api/shop/product',
            data: formData
        })
    }

    const createProduct1 = () => createProduct({
        shop_id: refShopId.current.value,
        payload: JSON.stringify({
            name: 'prod1',
            description: 'product 1.',
            price: 1000,
            customizes: [
                {
                    name: 'cus1',
                    description: 'customize 1.',
                    selections: [
                        {
                            name: 'opt1',
                            price: 100
                        },
                        {
                            name: 'opt2',
                            price: 200
                        }
                    ]
                },
                {
                    name: 'cus2',
                    description: 'customize 2.',
                }
            ]
        })
    })
    
    const createProduct2 = () => createProduct({
        shop_id: refShopId.current.value,
        payload: JSON.stringify({
            name: "prod2",
            description: "product 2.",
            price: 2000,
        })
    })

    const deleteProduct = () => testApi({
        method: 'DELETE',
        url: '/api/shop/product',
        data: {
            shop_id: refShopId.current.value,
            product_key: refProductKey.current.value
        }
    })

    const updateProduct = () => testApi({
        method: 'PATCH',
        url: '/api/shop/product',
        data: {
            shop_id: refShopId.current.value,
            product_key: refProductKey.current.value,
            payload: JSON.stringify({
                name: "prod2",
                description: "product 2.",
                price: 2000,
                delete: [
                    refCustomizeKey.current.value
                ],
                create: [
                    {
                        name: "cus2",
                        description: "customize 2."
                    }
                ]
            })
        }
    })

    return (
        <div className="TestRoot">
            <div className="TestButtonContainer">
                <Button onClick={createProduct1}>create product1</Button>
                <Button onClick={createProduct2}>create product2</Button>
                <Button onClick={deleteProduct}>delete product</Button>
                <Button onClick={updateProduct}>update product</Button>
            </div>
            <div className="TestInputContainer">
                <InputField inputRef={refShopId} label={"Shop ID"} defaultValue='f385f905-ea55-4213-b025-4740ae0c7710'/>
                <InputField inputRef={refProductKey} label={"Product Key"} defaultValue='b84387b9-0341-4796-a6a0-7194a1a6843e'/>
                <InputField inputRef={refCustomizeKey} label={"Customize Key"} defaultValue='454a4226-583d-4c59-ac14-aac5ba61cde4'/>
            </div>
        </div>
    )
}

const TestCartApi = () => {
    const refShopId = useRef(null)
    const refProductKey = useRef(null)
    const refRemark = useRef(null)
    const refCount = useRef(null)
    const refCus1Key = useRef(null)
    const refCus1Sel = useRef(null)
    const refCus2Key = useRef(null)
    const refCus2Sel = useRef(null)
    const refItemKey = useRef(null)

    const checkCart = () => testApi({
        method: 'POST',
        url: '/api/cart/session',
        data: {
            shop_id: refShopId.current.value,
        }
    })

    const createItem = () => {
        let cus_sel = {}
        cus_sel[refCus1Key.current.value] = refCus1Sel.current.value
        cus_sel[refCus2Key.current.value] = refCus2Sel.current.value

        testApi({
            method: 'POST',
            url: '/api/cart/item',
            data: {
                shop_id: refShopId.current.value,
                product_key: refProductKey.current.value,
                remark: refRemark.current.value,
                count: refCount.current.value,
                cus_sel: JSON.stringify(cus_sel),
            },
        })
    }

    const updateItem = () => testApi({
        method: 'PATCH',
        url: '/api/cart/item',
        data: {
            shop_id: refShopId.current.value,
            item_key: refItemKey.current.value,
            payload: JSON.stringify({
                remark: refRemark.current.value,
                count: refCount.current.value,
            })
        }
    })

    const deleteItem = () => testApi({
        method: 'DELETE',
        url: '/api/cart/item',
        data: {
            shop_id: refShopId.current.value,
            item_key: refItemKey.current.value,
        }
    })

    const createOrder = () => testApi({
        method: 'POST',
        url: '/api/cart/order',
        data: {
            shop_id: refShopId.current.value,
        }
    })

    return (
        <div className="TestRoot">
            <div className="TestButtonContainer">
                <Button onClick={checkCart}>check cart</Button>
                <Button onClick={createItem}>create item</Button>
                <Button onClick={updateItem}>update item</Button>
                <Button onClick={deleteItem}>delete item</Button>
                <Button onClick={createOrder}>create order</Button>
            </div>
            <div className="TestInputContainer">
                <InputField inputRef={refShopId} label={"Shop id"} defaultValue='f385f905-ea55-4213-b025-4740ae0c7710'/>
                <InputField inputRef={refProductKey} label={"Product key"} defaultValue='34d0531e-5ff7-4589-a6c0-9548cf43ae59'/>
                <InputField inputRef={refRemark} label={"remark"} defaultValue='test item'/>
                <InputField inputRef={refCount} label={"count"} defaultValue='1'/>
                <InputField inputRef={refCus1Key} label={"cus1 key"} defaultValue='c1fe673d-ea75-4da4-b3ca-dd748ca0a631'/>
                <InputField inputRef={refCus1Sel} label={"cus1 sel"} defaultValue='002cce50-17b3-4cbc-a817-6b405d2f2492'/>
                <InputField inputRef={refCus2Key} label={"cus2 key"} />
                <InputField inputRef={refCus2Sel} label={"cus2 sel"} />
                <InputField inputRef={refItemKey} label={"item key"} />
            </div>
        </div>
    )
}

const App = () => {

    const upload_avatar = (evt) => {
        evt.preventDefault()
        const formdata = new FormData()

        formdata.append('image', evt.target.files[0])

        for (var value of formdata.values()) {
            console.log(value)
        }

        testApi({
            method: 'POST',
            url: '/fs/user/avatar',
            data: formdata,
        })
    }

    const delete_avatar = () => testApi({
        method: 'DELETE',
        url: '/fs/user/avatar',
    })

    return (
        <div className="App">
            <TestUserApi />
            <TestRegisterApi />
            <TestShopApi />
            <TestProductApi />
            <TestCartApi/>
            <div>
                <input type='file' onChange={upload_avatar}/>
                <button className="App" onClick={delete_avatar} >delete avatar</button>
                <img src={`${location.origin}/fs/user/avatar`} />
            </div>
        </div>
    )
}

export default App