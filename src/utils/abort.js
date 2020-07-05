import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

class AbortToken {
    constructor() {
        this.aborted = false
        this.axiosCancelToken = axios.CancelToken.source()
    }

    abort() {
        this.aborted = true
        this.axiosCancelToken.cancel()
    }

    isAborted() {
        return this.aborted
    }

    axiosCancelTk() {
        return this.axiosCancelToken.token
    }
}

class Abort {
    constructor() {
        this.abortTokens = new Set()
    }

    abort() {
        this.abortTokens.forEach((t) => t.abort())
    }

    signup() {
        let abortTk = new AbortToken()
        this.abortTokens.add(abortTk)
        return abortTk
    }

    signout(t) {
        this.abortTokens.delete(t)
    }
}

export function useAbort() {
    const [abort] = useState(new Abort())

    const signup = useCallback(
        () => (abort.signup()),
        []
    )

    const signout = useCallback(
        (t) => abort.signout(t),
        []
    )

    useEffect(
        () => {
            return () => abort.abort()
        },
        []
    )

    return {
        signup: signup,
        signout: signout,
    }
}

export function createAbort() {
    return new Abort()
}