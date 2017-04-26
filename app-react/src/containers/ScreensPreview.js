import React from 'react'
import { observer } from 'mobx-react'
import { parseElement } from 'lofi'
import Screen from 'gateau/lib/screen/Screen'
import Row from '../components/Row'
import * as PreviewTypes from './PreviewTypes'


function parseScreenItem(item) {
	return item.contentJSON.body.split('\n\n').map(section => section.split('\n').map(parseElement))
}

const style = {
	display: 'inline-block',
	marginBottom: '1rem',
	marginRight: '1rem',
	borderWidth: 1,
	borderStyle: 'solid',
	borderColor: '#ddd',
	boxShadow: '0 0 2px rgba(0,0,0,0.1)'
}

const ScreensPreview = observer(function ScreensPreview({
	owner,
	shrinkHeight = false,
	stateManager,
	childrenManager
}) {
	const { items } = childrenManager
	return (
		<section>
			<Row details text={{ align: 'center' }} marginBottom='0.5rem'>
				<summary />
				<PreviewTypes.Tabs stateManager={ stateManager } />
			</Row>
			<div>
			{
				!!items ? (
					items.map(item => (console.log(item.type + ':' + item.id),
						<div key={ item.type + ':' + item.id }
							style={ style }
						>
							<Screen
								contentTree={ parseScreenItem(item) }
								ingredients={ [] }
								destinationID={ stateManager.previewType }
								height={ shrinkHeight ? 'auto' : 600 }
							/>
						</div>
					))
				) : (
					<Row children='Loading items…' />
				)
			}
			</div>
		</section>
	)
})

export default ScreensPreview