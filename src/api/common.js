export const WorkerHeaders = {
	Accept: 'application/vnd.github.v3+json',
	'User-Agent': 'RepoMate - ChatGPT Plugin',
};

export async function GetDefaultBranch(owner, repo) {
	const url = `https://api.github.com/repos/${owner}/${repo}`;

	const resp = await fetch(url, {
		headers: {
			...WorkerHeaders,
		},
	});

	if (!resp.ok) {
		return new Response(await resp.text(), { status: resp.status });
	}

	const json = await resp.json();

	return json['default_branch'];
}
