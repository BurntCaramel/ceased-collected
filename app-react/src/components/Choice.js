import React from 'react'
import Label from './Label'
import * as colors from './colors'

const styles = {
    select: ({ hasTitle, grow, width }) => ({
        flexGrow: grow,
        width,
        marginLeft: hasTitle ? '0.5em' : null,
        fontSize: '1rem',
        lineHeight: '1.3rem', color: colors.action.normal,
        paddingLeft: '0.25em', paddingRight: '0.25em',
        backgroundColor: colors.lightness.normal,
        borderColor: colors.action.normal, borderWidth: 1, borderStyle: 'solid',
				borderRadius: 2,
				webkitAppearance: 'none'
    })
}

export default function Choice({ chosenID, choices, title, grow, width, onChange }) {
    const hasTitle = (title != null)
    const select = (
        <select
            value={ chosenID }
            onChange={ onChange }
            style={ styles.select({
                hasTitle,
                grow,
                width
            }) }
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
