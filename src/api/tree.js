import { OpenAPIRoute, Query } from '@cloudflare/itty-router-openapi';

export class GetTree extends OpenAPIRoute {
	static schema = {
		tags: ['Tree'],
		summary: 'recursively get the tree of a repository',
		parameters: {
			owner: Query(String, {
				description: 'owner of the repository',
			}),
			repo: Query(String, {
				description: 'name of the repository',
			}),
			branch: Query(String, {
				default: 'main',
				description: 'branch name of the repository; optional, can be omitted',
			}),
		},
		responses: {
			200: {
				description: 'repository structure in the tree format',
				schema: {
					tree: [
						{
							path: '.github',
							type: 'tree',
						},
						{
							path: '.github/workflows',
							type: 'tree',
						},
					],
				},
			},
		},
	};

	async handle(request, env, ctx, data) {
		const url = `https://api.github.com/repos/${data.query.owner}/${data.query.repo}/git/trees/${data.query.branch}?recursive=true`;

		const resp = await fetch(url, {
			headers: {
				...WorkerHeaders,
			},
		});

		if (!resp.ok) {
			return new Response(await resp.text(), { status: resp.status });
		}

		const json = await resp.json();

		const repos = json['tree'].map((item) => ({
			path: item.path,
			type: item.type,
		}));

		return {
			repos: repos,
		};
	}
}
