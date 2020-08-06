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

            const left = body.style.left
            body.style.left = '0px'

            const right = body.style.right
            body.style.right = '0px'

            window.scroll(0, 0)

            return () => {
                body.style.position = pos
                body.style.top = top
                body.style.left = left
                body.style.right = right
                window.scroll(0, lockedY)
            }
        },
        []
    )
}

export default usePreventBodyScroll