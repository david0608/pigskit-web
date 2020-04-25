import React, { useState, useEffect } from 'react';
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

const App = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [shopName, setShopName] = useState('');
    const [memberName, setMemberName] = useState('');
    const [authority, setAuthority] =  useState('');
    const [permission, setPermission] = useState('');

    const [product, setProduct] = useState('');
    const [price, setPrice] = useState(0);

    const [customize, setCustomize] = useState('');

    const register = () => fetchWithJson("POST", `${location.origin}/api/user`, { username: username, password: password, name: name, email: email, phone: phone });

    const signin = () => fetchWithJson("POST", `${location.origin}/api/user/session`, { username: username, password: password });
    const signout = () => fetchWithJson("DELETE", `${location.origin}/api/user/session`);
    const session = () => fetchWithJson("GET", `${location.origin}/api/user/session`);

    const create_shop = () => fetchWithJson("POST", `${location.origin}/api/shop`, { name: shopName });

    const add_shop_member = () => fetchWithJson("POST", `${location.origin}/api/shop/member`, { shop: shopName, member: memberName });
    const set_shop_member_authority = () => fetchWithJson("PATCH", `${location.origin}/api/shop/member/authority`, { shop: shopName, member: memberName, authority: authority, permission: permission });

    const create_product = () => fetchWithJson("POST", `${location.origin}/api/shop/product`, { name: product, shop: shopName, price: price });
    const delete_product = () => fetchWithJson("DELETE", `${location.origin}/api/shop/product/?name=${product}&shop=${shopName}`);

    const create_customize = () => fetchWithJson("POST", `${location.origin}/api/shop/product/customize`, { name: customize, shop: shopName, product: product });
    const delete_customize = () => fetchWithJson("DELETE", `${location.origin}/api/shop/product/customize`, { name: customize, shop: shopName, product: product });

    return (
        <div>
            <div>
                <button className="App" onClick={register} >register</button>
                <button className="App" onClick={signin} >signin</button>
                <button className="App" onClick={signout} >signout</button>
                <button className="App" onClick={session} >session</button>
                <input type='text' onChange={(evt) => setUsername(evt.target.value)} />
                <input type='text' onChange={(evt) => setPassword(evt.target.value)} />
                <input type='text' onChange={(evt) => setName(evt.target.value)} />
                <input type='text' onChange={(evt) => setEmail(evt.target.value)} />
                <input type='text' onChange={(evt) => setPhone(evt.target.value)} />
            </div>
            <div>
                <button className="App" onClick={create_shop} >create shop</button>
                <button className="App" onClick={add_shop_member} >add shop member</button>
                <button className="App" onClick={set_shop_member_authority} >set shop member authority</button>
                <input type='text' onChange={(evt) => setShopName(evt.target.value)} />
                <input type='text' onChange={(evt) => setMemberName(evt.target.value)} />
                <input type='text' onChange={(evt) => setAuthority(evt.target.value)} />
                <input type='text' onChange={(evt) => setPermission(evt.target.value)} />
            </div>
            <div>
                <button className="App" onClick={create_product} >create product</button>
                <button className="App" onClick={delete_product} >delete product</button>
                <input type='text' onChange={(evt) => setProduct(evt.target.value)} />
                <input type='number' onChange={(evt) => setPrice(evt.target.value)} />
            </div>
            <div>
                <button className="App" onClick={create_customize} >create customize</button>
                <button className="App" onClick={delete_customize} >delete customize</button>
                <input type='text' onChange={(evt) => setCustomize(evt.target.value)} />
            </div>
        </div>
    );
}

export default App;