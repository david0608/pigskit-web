import React, { useState, useEffect, useRef } from 'react';
import '../less/App.less';

const fetchWithJson = (method, url, body) => {
    fetch(
        url,
        {
            method: method,
            redirect: "follow",
            cache: "no-cache",
            body: JSON.stringify(body),
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
        }
    )
    .then(res => res.text())
    .then((text) => {
        try {
            console.log(JSON.parse(text));
        } catch {
            console.log(text);
        }
    })
    .catch((error) => console.log(error));
}

const redirect_href = (url) => {
    window.location.href = url;
}

const redirect_replace = (url) => {
    window.location.replace(url);
}

const InputField = (props) => {
    const {className, inputRef, label} = props;
    return (
        <div className={`InputFieldRoot${className ? ` ${className}` : ''}`}>
            <p>{label}</p>
            <input type="text" ref={inputRef} />
        </div>
    )
}

const TestUserApi = () => {
    const refUsername = useRef(null);
    const refPassword = useRef(null);
    const refName = useRef(null);
    const refEmail = useRef(null);
    const refPhone = useRef(null);

    const register = () => fetchWithJson(
        "POST",
        `${location.origin}/api/user`,
        {
            username: refUsername.current.value,
            password: refPassword.current.value,
            name: refName.current.value,
            email: refEmail.current.value,
            phone: refPhone.current.value
        }
    );

    const signin = () => fetchWithJson(
        "POST",
        `${location.origin}/api/user/session`,
        {
            username: refUsername.current.value,
            password: refPassword.current.value
        }
    );

    const signout = () => fetchWithJson(
        "DELETE",
        `${location.origin}/api/user/session`
    );

    const session = () => fetchWithJson(
        "GET",
        `${location.origin}/api/user/session`
    );

    return (
        <div className="TestRoot">
            <div className="TestButtonContainer">
                <button className="TestButton" onClick={register} >register</button>
                <button className="TestButton" onClick={signin} >signin</button>
                <button className="TestButton" onClick={signout} >signout</button>
                <button className="TestButton" onClick={session} >session</button>
            </div>
            <div className="TestInputContainer">
                <InputField inputRef={refUsername} label={"Username"} />
                <InputField inputRef={refPassword} label={"Password"} />
                <InputField inputRef={refName} label={"Name"} />
                <InputField inputRef={refEmail} label={"Email"} />
                <InputField inputRef={refPhone} label={"Phone"} />
            </div>
        </div>
    );
}

const TestRegisterApi = () => {
    const refEmail = useRef(null);
    const refPhone = useRef(null);
    const refUsername = useRef(null);
    const refPassword = useRef(null);

    const startRegister = () => fetchWithJson(
        "POST",
        `${location.origin}/api/user/register`
    );

    const submitEmail = () => fetchWithJson(
        "PATCH",
        `${location.origin}/api/user/register`,
        {
            operation: "email",
            data: refEmail.current.value
        }
    );

    const submitPhone = () => fetchWithJson(
        "PATCH",
        `${location.origin}/api/user/register`,
        {
            operation: "phone",
            data: refPhone.current.value
        }
    );

    const submitUsername = () => fetchWithJson(
        "PATCH",
        `${location.origin}/api/user/register`,
        {
            operation: "username",
            data: refUsername.current.value
        }
    );

    const submitPassword = () => fetchWithJson(
        "PATCH",
        `${location.origin}/api/user/register`,
        {
            operation: "password",
            data: refPassword.current.value
        }
    );

    const register = () => fetchWithJson(
        "PATCH",
        `${location.origin}/api/user/register`,
        {
            operation: "submit"
        }
    )

    const getEmail = () => fetchWithJson(
        "GET",
        `${location.origin}/api/user/register?operation=email`,
    );

    const getPhone = () => fetchWithJson(
        "GET",
        `${location.origin}/api/user/register?operation=phone`,
    );

    const getUsername = () => fetchWithJson(
        "GET",
        `${location.origin}/api/user/register?operation=username`,
    );

    return (
        <div className="TestRoot">
            <div className="TestButtonContainer">
                <button className="TestButton" onClick={startRegister}>start register</button>
                <button className="TestButton" onClick={submitEmail}>submit email</button>
                <button className="TestButton" onClick={submitPhone}>submit phone</button>
                <button className="TestButton" onClick={submitUsername}>submit username</button>
                <button className="TestButton" onClick={submitPassword}>submit password</button>
                <button className="TestButton" onClick={register}>register</button>
                <button className="TestButton" onClick={getEmail}>get email</button>
                <button className="TestButton" onClick={getPhone}>get phone</button>
                <button className="TestButton" onClick={getUsername}>get username</button>
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
    const refShopName = useRef(null);
    const refShopId = useRef(null);
    const refMemberId = useRef(null);
    const refAuthority = useRef(null);
    const refPermission = useRef(null);

    const createShop = () => fetchWithJson(
        "POST",
        `${location.origin}/api/shop`,
        {
            shop_name: refShopName.current.value
        }
    );

    const addShopMember = () => fetchWithJson(
        "POST",
        `${location.origin}/api/shop/member`,
        {
            shop_id: refShopId.current.value,
            member_id: refMemberId.current.value
        }
    );

    const setShopMemberAuthority = () => fetchWithJson(
        "PATCH",
        `${location.origin}/api/shop/member/authority`,
        {
            shop_id: refShopId.current.value,
            member_id: refMemberId.current.value,
            authority: refAuthority.current.value,
            permission: refPermission.current.value
        }
    );

    return (
        <div className="TestRoot">
            <div className="TestButtonContainer">
                <button className="TestButton" onClick={createShop} >create shop</button>
                <button className="TestButton" onClick={addShopMember} >add shop member</button>
                <button className="TestButton" onClick={setShopMemberAuthority} >set shop member authority</button>
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
    const refShopId = useRef(null);
    const refProductKey = useRef(null);
    const refCustomizeKey = useRef(null);
    
    const createProduct = () => fetchWithJson(
        "POST",
        `${location.origin}/api/shop/product`,
        {
            shop_id: refShopId.current.value,
            payload: JSON.stringify({
                name: "prod1",
                description: "product 1.",
                price: 1000,
                customizes: [
                    {
                        name: "cus1",
                        description: "customize 1.",
                        selections: [
                            {
                                name: "opt1",
                                price: 100
                            }
                        ]
                    }
                ]
            })
        }
    );

    const deleteProduct = () => fetchWithJson(
        "DELETE",
        `${location.origin}/api/shop/product`,
        {
            shop_id: refShopId.current.value,
            product_key: refProductKey.current.value
        }
    );

    const updateProduct = () => fetchWithJson(
        "PATCH",
        `${location.origin}/api/shop/product`,
        {
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
    );

    return (
        <div className="TestRoot">
            <div className="TestButtonContainer">
                <button className="TestButton" onClick={createProduct}>create product</button>
                <button className="TestButton" onClick={deleteProduct}>delete product</button>
                <button className="TestButton" onClick={updateProduct}>update product</button>
            </div>
            <div className="TestInputContainer">
                <InputField inputRef={refShopId} label={"Shop ID"} />
                <InputField inputRef={refProductKey} label={"Product Key"} />
                <InputField inputRef={refCustomizeKey} label={"Customize Key"} />
            </div>
        </div>
    )
}

const App = () => {

    const upload_avatar = (evt) => {
        evt.preventDefault();
        const formdata = new FormData();

        formdata.append('image', evt.target.files[0]);

        for (var value of formdata.values()) {
            console.log(value);
        }

        fetch(
            'http://localhost/fs/user/avatar',
            {
                method: "POST",
                body: formdata
            }
        )
        .then(res => res.text())
        .then(text => console.log(text))
        .catch(error => console.log(error))
    };
    const delete_avatar = () => fetchWithJson("DELETE", `${location.origin}/fs/user/avatar`);

    return (
        <div className="App">
            <TestUserApi />
            <TestRegisterApi />
            <TestShopApi />
            <TestProductApi />
            <div>
                <input type='file' onChange={upload_avatar}/>
                <button className="App" onClick={delete_avatar} >delete avatar</button>
                {/* <img src={`${location.origin}/fs/user/avatar`} /> */}
            </div>
        </div>
    );
}

export default App;