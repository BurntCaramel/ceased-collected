import React from 'react'
import seeds from 'react-seeds'
import Row from './Row'
import Field from './Field'
import ToggleEdit from './ToggleEdit'
import * as types from '../constants/itemTypes'

function renderOwnerType(type) {
	switch (type) {
	case types.journey: return 'Journey'
	case types.collection: return 'Collection'
	case types.organization: return 'Organization'
	default: return type
	}
}

const stylers = {
	heading: seeds({
		row: 1,
		grow: 1,
		margin: { right: '0.5rem' },
		lineHeight: 1.2
	})
}

function NameNormal({
	value,
	onEdit
}) {
	return <span>{ value } <span onClick={ onEdit }>✎</span></span>
}

function NameEditor({
	value,
	onChange, onKeyDown
}) {
	return <Field
		value={ value }
		grow={ 1 }
		font={{ family: 'inherit', size: 'inherit' }}
		onChange={ onChange }
		onKeyDown={ onKeyDown }
	/>
}

export default function OwnerNav({
	owner, name, statusMessage, sectionTitle,
	onChangeName
}) {
	const { type, id } = owner
	return (
		<nav className='primary'>
			<Row alignItems='baseline'>
				<h2 { ...stylers.heading }>
					{
						!!statusMessage ? (
							<span>{ statusMessage }</span>
						) : !!name ? (
							<ToggleEdit
								value={ name }
								Normal={ NameNormal }
								Editor={ NameEditor }
								onCommitValue={ onChangeName }
							/>
						) : (
							<span>{ renderOwnerType(type) } { id }</span>
						)
					}
					{ sectionTitle && <span> · { sectionTitle }</span> }
				</h2>
				<span>#{type}</span>
			</Row>
		</nav>
	)
}
