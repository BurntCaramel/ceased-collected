import React from 'react'

const makeStyle = ({ measure, wrap, alignItems, justifyContent, grow, margin }) => ({
	display: 'flex', flexDirection: 'column',
	maxWidth: `${measure}rem`,
	flexWrap: wrap,
	alignItems,
	justifyContent,
	flexGrow: grow,
	margin
})

export default function Column({
	children,
	details = false,
	open = null,
	measure = 38,
	wrap, alignItems, justifyContent,
	grow = 1, margin
}) {
	const Component = (
		details ? (
			'details'
		) : 'div'
	)
	return (
		<Component
			children={ children }
			open={ open }
			style={ makeStyle({ measure, wrap, alignItems, justifyContent, margin, grow }) }
		/>
	)
}

Column.Start = (props) => <Column alignItems='flex-start' { ...props } />
Column.End = (props) => <Column alignItems='flex-end' { ...props } />
Column.Center = (props) => <Column alignItems='center' { ...props } />
