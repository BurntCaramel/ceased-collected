import React from 'react'
import seeds from 'react-seeds'

const styler = ({
	wrap,
	alignItems,
	justifyContent,
	grow,
	marginTop,
	marginBottom,
	text: { align: textAlign, color } = {}
}) => ({
	display: 'flex', flexDirection: 'row',
	flexWrap: wrap,
	alignItems,
	justifyContent,
	maxWidth: '38rem',
	flexGrow: grow,
	marginLeft: 'auto', marginRight: 'auto', marginTop, marginBottom,
	textAlign,
	color
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
			style={ styler({
					wrap,
					alignItems,
					justifyContent,
					marginTop,
					marginBottom,
					grow,
					text
			}) }
		/>
	)
}
