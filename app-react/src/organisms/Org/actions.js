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

		return { gitHubOrg, gitHubRepos }
	}
}