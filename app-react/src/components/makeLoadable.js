import React from 'react'
import { extendObservable, action, reaction } from 'mobx'
import { observer } from 'mobx-react'

export default function makeLoadable(makePromise) {
	return extendObservable({}, {
		promise: null,
		result: null,
		error: null,

		start: action.bound(function(...args) {
			this.promise = makePromise(...args)
				.then(action(result => {
					this.result = result
					this.error = null
				}))
				.catch(action(error => {
					this.error = error
				}))
		}),

		makeComponent(renderResult, renderError, renderPending) {
			return observer((props) => {
				if (this.result) {
					return renderResult(this.result, props)
				}
				else if (this.error) {
					return renderError(this.error, props)
				}
				else {
					return renderPending(!!this.promise, props) || <noscript />
				}
			})
		},

		observe(observer) {
			return reaction(
				() => ({
					result: this.result,
					error: this.error,
          started: !!this.promise
				}),
				observer
			)
		}
	})
}