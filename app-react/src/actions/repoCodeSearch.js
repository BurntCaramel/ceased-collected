export const init = () => ({
	results: null
})

export const load = async ({ open }, prevProps) => {
	if (!prevProps || open !== prevProps.open) {
		if (open) {
			const { items } = await fetch(`https://api.github.com/search/code?q=react+in:file+language:js+repo:RoyalIcing/Collected`)
				.then(res => res.json())
			return { results: items }
		}
	}
}