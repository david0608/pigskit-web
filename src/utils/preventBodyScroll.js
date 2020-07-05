import { useEffect } from 'react'

const usePreventBodyScroll = () => {
    useEffect(
        () => {
            const lockedY = window.scrollY
            const body = document.querySelector('body')
            const pos = body.style.position
            body.style.position = 'fixed'
            const top = body.style.top
            body.style.top = `-${lockedY}px`
            window.scroll(0, 0)

            return () => {
                body.style.position = pos
                body.style.top = top
                window.scroll(0, lockedY)
            }
        },
        []
    )
}

export default usePreventBodyScroll