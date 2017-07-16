const R = require('ramda')

const groupResultByRepoFullName = R.groupBy(result => result.repository.full_name)

export const initial = () => ({
	gitHubOrg: null
})

export const load = async ({ id }, prevState) => {
	if (!prevState) {
		const gitHubOrg = await fetch(`https://api.github.com/orgs/${id}`).then(res => res.json())
		if (gitHubOrg.message) {
			throw new Error(`Organization ${id} was not found on GitHub`)
		}

		const gitHubRepos = await fetch(`https://api.github.com/orgs/${id}/repos`).then(res => res.json())
		gitHubRepos.reverse()

		const reactFilesSearch = await fetch(`https://api.github.com/search/code?q=react+in:file+language:js+user:${id}`).then(res => res.json())
		const reactComponentSearchResults = reactFilesSearch.items.filter(({ path }) => path.indexOf('components/') !== -1)
		const reactComponentFilesByRepo = groupResultByRepoFullName(reactComponentSearchResults)

		return { gitHubOrg, gitHubRepos, reactComponentFilesByRepo }
	}
}