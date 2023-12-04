import { Octokit, RequestError } from 'octokit';

export const WorkerHeaders = {
	Accept: 'application/vnd.github.v3+json',
	'User-Agent': 'RepoMate - ChatGPT Plugin',
};

export const GetOctokit = () =>
	new Octokit({
		// auth: process.env.GITHUB_TOKEN,
	});

export async function GetDefaultBranch(owner, repo) {
	const octokit = GetOctokit();
	try {
		const resp = await octokit.rest.repos.get({
			owner: owner,
			repo: repo,
		});

		return resp.data.default_branch;
	} catch (err) {
		if (err instanceof RequestError) {
			console.log(err);
			return null;
		} else {
			throw err;
		}
	}
}
