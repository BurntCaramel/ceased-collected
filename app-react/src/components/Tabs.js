import React from 'react'
import seeds from 'react-seeds'
import { fallow } from 'react-sow/dom'
import Button from './Button'
import * as colors from './colors'

const tabClasses = [
    fallow({
        display: 'block'
    }),
    fallow({
        screen: { minWidth: '480px' },
        display: 'inline-block'
    })
]

const styles = seeds({
    row: true,
    overflow: 'hidden',
    //inlineBlock: true,
    border: { width: 1, style: 'solid', color: colors.action.normal },
    cornerRadius: 5
})

export default function Tabs({ items, selectedID, onSelectID }) {
    return (
        <nav
            { ...styles }
        >
        {
            items.map(({ title, id }) => (
                <Button key={ id }
                    tab
                    title={ title }
                    selected={ selectedID === id }
                    classes={ tabClasses }
                    onClick={ !!onSelectID ? onSelectID.bind(null, id) : null }
                />
            ))
        }
        </nav>
    )
}
