import React from 'react'
import { observable, action, reaction } from 'mobx'
import { observer } from 'mobx-react'
import Row from '../components/Row'
import Column from '../components/Column'
import Button from '../components/Button'
import Field from '../components/Field'

const headerStyle = {
	display: 'flex', flexDirection: 'row'
}

const ItemEditor = observer(class ItemEditor extends React.Component {
	constructor(props) {
		super(props)

		this.stateManager = observable({
			name: props.item.name,
			body: props.item.contentJSON.body,
			needsSync: false,
			sendingSync: false,

			onChangeName: action.bound(function({ target: { value } }) {
				this.name = value
				this.needsSync = true
			}),

			onChangeBody: action.bound(function({ target: { value } }) {
				this.body = value
				this.needsSync = true
			}),

			syncChanges: action.bound(function(performSync, item) {
				console.log('Saving')
				this.sendingSync = true
				performSync(item, {
					name: this.name,
					contentJSON: { body: this.body }
				})
				.then(action(result => {
					this.sendingSync = false
					this.needsSync = false
					// Update with latest from API
					// FIXME: merge
					//this.body = result.contentJSON.body
					console.log('Saved', result)
				}))
			})
		})

		this.onSyncChanges = () => {
			this.stateManager.syncChanges(
				this.props.onUpdate,
				this.props.item
			)
		}

		this.onDelete = () => {
			this.props.onDelete(this.props.item)
		}

		this.disposeBodyReaction = reaction(
			() => ({
				name: this.stateManager.name,
				body: this.stateManager.body
			}),
			({ name, body }) => {
				this.onSyncChanges()
			}, {
				delay: 2000,
				compareStructural: true,
				name: `ItemEditor type:${props.type} id:${props.id}`
			}
		)
	}

	componentWillUnmount() {
		this.disposeBodyReaction()
		this.disposeBodyReaction = null
	}

	render() {
		const { item, owner } = this.props
		const { name, body, needsSync, sendingSync, onChangeName, onChangeBody } = this.stateManager
		return (
			<div style={{
				marginBottom: '1rem'
			}}>
				<Row wrap justifyContent='flex-end'>
					<Row details>
						<summary style={ headerStyle }>
							<Field
								value={ name }
								grow={ 1 }
								font={{ size: '1rem', weight: 600 }}
								transparent
								onChange={ onChangeName }
							/>
							&nbsp;
							<small
								style={{
									opacity: needsSync ? 0.7 : 1.0
								}}
								onClick={ this.onSyncChanges }
							>
								{ '#' + item.type }
							</small>
						</summary>
						<Column.Start margin={{ top: '0.5rem', bottom: '0.5rem' }}>
							<Button title='Delete' small onClick={ this.onDelete } />
							<div>
								<small><time dateTime={ item.dateUpdated }>
									Updated: { item.dateUpdated }
								</time></small>
							</div>
							<div>
								<small><time dateTime={ item.dateUpdated }>
									Created: { item.dateCreated }
								</time></small>
							</div>
						</Column.Start>
					</Row>
				</Row>
				<Row>
					<Field
						value={ body }
						grow={ 1 }
						rows={ 5 }
						onChange={ onChangeBody }
					/>
				</Row>
			</div>
		)
	}
})

export default ItemEditor