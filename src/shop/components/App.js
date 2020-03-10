import React, { useEffect } from 'react';
import '../less/App.less';

const testFetch = (method, url) => {
    fetch(
        url,
        {
            method: method,
            redirect: "follow",
            cache: "no-cache",
        },
    ).then((res) => {
        console.log(res);
        return res.text();
    }).then((text) => {
        console.log(text);
    }).catch((err) => {
        console.log(err);
    })
}

const redirect_href = (url) => {
    window.location.href = url;
}

const redirect_replace = (url) => {
    window.location.replace(url);
}

const App = () => {
    const signin = () => testFetch("POST", "http://localhost/access/signin/?username=david0608&password=123123");
    const signout = () => testFetch("POST", "http://localhost/access/signout");
    const session = () => testFetch("GET", "http://localhost/access/session");

    return (
        <div>
            <button className="App" onClick={signin} >signin</button>
            <button className="App" onClick={signout} >signout</button>
            <button className="App" onClick={session} >session</button>
        </div>
    );
}

export default App;