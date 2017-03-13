import React from 'react'

function renderOwnerType(type) {
	switch (type) {
	case 'collection': return 'Collection'
	case 'organization': return 'Organization'
	default: return type
	}
}

export default function OwnerNav({ owner, sectionTitle }) {
	const { type, id } = owner
	return (
		<nav className="primary">
      <h2>
				{ renderOwnerType(type) } { id }
				{ sectionTitle && <span> · { sectionTitle }</span> }
			</h2>
		</nav>
	)
}
