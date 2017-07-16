import React from 'react'
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

const styler = ({ fullWidth = false }) => ({
	display: 'flex', flexDirection: 'row',
	flexGrow: fullWidth ? 1 : 0,
	overflow: 'hidden',
	borderWidth: 1, borderStyle: 'solid', borderColor: colors.action.normal,
	//cornerRadius: fullWidth ? 0 : 5
	borderRadius: 5
})

export default function Tabs({
	items, selectedID,
	fullWidth,
	large,
	small,
	onSelectID
}) {
	return (
		<nav
			{ ...styler({ fullWidth }) }
		>
		{
			items.map(({ title, id }) => (
				<Button key={ id }
					tab
					title={ title }
					primary={ selectedID === id }
					large={ large }
					small={ small }
					classes={ tabClasses }
					onClick={ !!onSelectID ? onSelectID.bind(null, id) : null }
				/>
			))
		}
		</nav>
	)
}
