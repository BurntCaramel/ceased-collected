import React from 'react'
import seeds from 'react-seeds'

const styler = ({ measure, wrap, alignItems, justifyContent, grow, margin }) => seeds({
	maxWidth: `${measure}rem`,
	column: true,
	wrap,
	alignItems,
	justifyContent,
	grow,
	margin
})

export default function Column({
	children,
	details = false,
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
			{ ...styler({ measure, wrap, alignItems, justifyContent, margin, grow }) }
		/>
	)
}

Column.Start = (props) => <Column alignItems='flex-start' { ...props } />
Column.End = (props) => <Column alignItems='flex-end' { ...props } />
Column.Center = (props) => <Column alignItems='center' { ...props } />
