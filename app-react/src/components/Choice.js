import React from 'react'
import seeds, { appearanceNone } from 'react-seeds'
import Label from './Label'
import * as colors from './colors'

const styles = {
    select: ({ hasTitle, grow, width }) => ({
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

export default function Choice({ chosenID, choices, title, grow, width, onChange }) {
    const hasTitle = (title != null)
    const select = (
        <select
            value={ chosenID }
            onChange={ onChange }
            { ...seeds(styles.select({
                hasTitle,
                grow,
                width
            })) }
        >
        {
            choices.map(({ title, id }) => (
                <option key={ id }
                    value={ id }
                    children={ title }
                />
            ))
        }
        </select>
    )

    return (
        <Label title={ title } children={ select } />
    )
}
