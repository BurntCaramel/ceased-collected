import React from 'react'
import seeds from 'react-seeds'

const styler = ({ wrap, alignItems, justifyContent, grow, marginTop, marginBottom }) => seeds({
	row: true,
	wrap,
	alignItems,
	justifyContent,
	maxWidth: '38rem',
	grow,
	margin: { left: 'auto', right: 'auto', top: marginTop, bottom: marginBottom }
})

export default function Row({
	children,
	details = false,
	wrap, alignItems, justifyContent,
	grow = 1, marginTop, marginBottom
}) {
	const Component = (
		details ? (
			'details'
		) : 'div'
	)
	return (
		<Component
			children={ children }
			{ ...styler({ wrap, alignItems, justifyContent, marginTop, marginBottom, grow }) }
		/>
	)
}
