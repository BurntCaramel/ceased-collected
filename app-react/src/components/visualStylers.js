import seeds from 'react-seeds'
import * as colors from './colors'

export const field = seeds({
	background: { color: colors.lightness.normal },
	border: { color: colors.action.normal, width: 1, style: 'solid' },
})

export const transparent = seeds({
	background: 'transparent',
	border: 'none',
})