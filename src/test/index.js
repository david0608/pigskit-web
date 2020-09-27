import ReactDOM from 'react-dom'
import React from "react"
import './index.less'


const TARGET_WIDTH = 500
const TARGET_ASPECT = 2

function App() {
    const loadImage = evt => {
        if (evt.target.files?.length === 0) return

        const reader = new FileReader()
        reader.onload = evt => {
            const img = new Image()
            img.onload = evt => {
                let img = evt.target

                let dWidth = TARGET_WIDTH
                let dHeight = dWidth / TARGET_ASPECT
                let sWidth = img.width
                let sHeight = sWidth * dHeight / dWidth

                let canvas = document.getElementById('Input')
                canvas.width = dWidth
                canvas.height = dHeight
                let ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, sWidth, sHeight, 0, 0, dWidth, dHeight)
            }
            img.src = evt.target.result
        }
        reader.readAsDataURL(evt.target.files[0])
    }

    const outputImage = () => {
        let output = document.getElementById('Output')
        let input = document.getElementById('Input')
        input.toBlob(
            (blob) => {
                if (blob) {
                    console.log(blob)
                    window.URL.revokeObjectURL(output.src)
                    output.src = window.URL.createObjectURL(blob)
                }
            },
            'image/jpeg',
            0.9
        )
    }

    return (
        <>
            <p>
                <canvas id='Input'/>
                <input
                    type='file'
                    accept='image/*'
                    onChange={loadImage}
                />
            </p>
            <p>
                <img id='Output'/>
                <button onClick={outputImage}>output</button>
            </p>
        </>
    )
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
)