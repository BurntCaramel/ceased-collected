import React from 'react'
import Row from './Row'
import Field from './Field'
import ToggleEdit from './ToggleEdit'
import * as types from '../constants/itemTypes'

function renderOwnerType(type) {
	switch (type) {
	case types.journey: return 'Journey '
	case types.collection: return 'Collection '
	case types.organization: return '@'
	default: return type + ' '
	}
}

const stylers = {
	heading: {
		display: 'flex', flexDirection: 'row',
		flexGrow: 1,
		marginRight: '0.5rem',
		fontSize: '1rem', fontWeight: 700,
		lineHeight: 1.2
	}
}

function NameNormal({
	value,
	onEdit
}) {
	return <span>{ value } <span onClick={ onEdit }>✎</span></span>
}

function NameEditor({
	value,
	onChange, onKeyDown, onBlur
}) {
	return <Field
		value={ value }
		grow={ 1 }
		font={{ family: 'inherit', size: 'inherit' }}
		onChange={ onChange }
		onKeyDown={ onKeyDown }
		onBlur={ onBlur }
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
				<h2 style={ stylers.heading }>
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
							<span>{ renderOwnerType(type) }{ id }</span>
						)
					}
					{ sectionTitle && <span> · { sectionTitle }</span> }
				</h2>
				<small>#{type}</small>
			</Row>
		</nav>
	)
}
