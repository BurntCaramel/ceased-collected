import React from 'react'
import seeds from 'react-seeds'
import Label from './Label'
import * as colors from './colors'

const stylers = {
    input: ({ hasTitle, grow, width }) => seeds({
        grow,
        width,
        margin: { left: hasTitle ? '0.5em' : null },
        font: { size: '1rem' },
        text: { lineHeight: '1.3rem', color: colors.action.normal },
        padding: { left: '0.25em', right: '0.25em' },
        background: { color: colors.lightness.normal },
        border: { color: colors.action.normal, width: 1, style: 'solid' },
        cornerRadius: 2
    })
}

export default function Field({ value, title, grow, width, onChange }) {
    const hasTitle = (title != null)
    const input = (
        <input
            value={ value }
            onChange={ onChange }
            { ...stylers.input({
                hasTitle,
                grow,
                width
            }) }
        />
    )

    return (
        <Label title={ title } children={ input } />
    )
}
