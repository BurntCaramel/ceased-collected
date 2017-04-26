import React from 'react'
import { observer } from 'mobx-react'
import Tabs from '../components/Tabs'


export const items = [
	{
		title: 'Bootstrap 3',
		id: 'bootstrap',
	},
	{
		title: 'Material UI',
		id: 'muiCSS',
	},
	{
		title: 'Foundation',
		id: 'foundation',
	}
]

export const initial = items[0].id

const PreviewTypeTabs = observer(function PreviewTypeTabs({
	stateManager: {
		previewType,
		onChangePreviewType
	}
}) {
	return (
		<Tabs
			items={ items }
			selectedID={ previewType }
			fullWidth
			onSelectID={ onChangePreviewType }
		/>
	)
})
export { PreviewTypeTabs as Tabs }
