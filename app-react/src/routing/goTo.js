export default function goTo(to) {
	const state = {}
	window.history.pushState(state, null, to)
	// Trigger event for mobx-location
	const popStateEvent = new PopStateEvent('popstate', { state: state })
	window.dispatchEvent(popStateEvent)
}
