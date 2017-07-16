import React from 'react'
import makeOrganism from 'react-organism'
import { parseElement } from 'lofi'
import * as actions from './actions'
import Column from '../../components/Column'
import Row from '../../components/Row'
import Tabs from '../../components/Tabs'
import Field from '../../components/Field'

let Screen;
// import('gateau/lib/screen/Screen')
// 	.then(result => {
// 		Screen = result.default
// 	})
// 	.catch(error => {
		
// 	})

function parseContent(content) {
	return content.split('\n\n').map(section => section.split('\n').map(parseElement))
}

const ScreenExample = ({
	content,
	modes,
	currentMode,
	handlers: actions
}) => (
	<Column>
		<Row>
			<Field grow width='50%' rows={ 5 } value={ content } onChange={ actions.changeContent } />
			{ Screen && <Screen
				contentTree={ parseContent(content) }
				ingredients={ [] }
				destinationID='bootstrap'
				height='auto'
			/> }
		</Row>
	</Column>
)

export default makeOrganism(ScreenExample, actions)
