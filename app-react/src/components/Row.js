import React from 'react'
import seeds from 'react-seeds'

const styler = ({
	wrap,
	alignItems,
	justifyContent,
	grow,
	marginTop,
	marginBottom,
	text
}) => seeds({
	row: true,
	wrap,
	alignItems,
	justifyContent,
	maxWidth: '38rem',
	grow,
	margin: { left: 'auto', right: 'auto', top: marginTop, bottom: marginBottom },
	text
})

export default function Row({
	children,
	section = false,
	details = false,
	wrap, alignItems, justifyContent,
	grow = 1, marginTop = 0, marginBottom = 0,
	text
}) {
	const Component = (
		section ? (
			'section'
		) : details ? (
			'details'
		) : 'div'
	)
	return (
		<Component
			children={ children }
			{...styler({
					wrap,
					alignItems,
					justifyContent,
					marginTop,
					marginBottom,
					grow,
					text
			})}
		/>
	)
}
