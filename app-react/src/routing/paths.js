export function subpathToListOfType(type) {
	switch (type) {
		case 'collection':
			return `/collections`
		case 'story':
			return `/stories`
		case 'record':
			return '/records'
	}
}

export function pathToBase({ type, id }) {
	switch (type) {
		case 'organization':
			return `/@${id}`
		default:
			return subpathToListOfType(type) + `/${id}`
	}
}

export function pathTo([ first, ...rest ]) {
	return pathToBase(first) + rest.map(item => (
		subpathToListOfType(item.type) + (item.id ? `/${item.id}` : '')
	)).join('/')
}
