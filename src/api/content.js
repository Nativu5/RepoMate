import { OpenAPIRoute, Query } from '@cloudflare/itty-router-openapi';
import { WorkerHeaders } from './common';

export class GetContentSingle extends OpenAPIRoute {
	static schema = {
		tags: ['Content'],
		summary: 'Get content of a single file in the repository',
		parameters: {
			owner: Query(String, {
				description: 'owner of the repository',
			}),
			repo: Query(String, {
				description: 'name of the repository',
			}),
			branch: Query(String, {
				description: 'branch name of the repository',
				required: false,
			}),
			path: Query(String, {
				description: 'path of the file',
			}),
		},
		responses: {
			200: {
				description: 'file content for the given path',
				schema: {
					content: 'console.log("Hello World!")',
				},
			},
		},
	};

	async handle(request, env, ctx, data) {
		const url = `https://api.github.com/repos/${data.query.owner}/${data.query.repo}/contents/${data.query.path}`;

		const resp = await fetch(url, {
			headers: {
				...WorkerHeaders,
				Accept: 'application/vnd.github.raw',
			},
		});

		if (!resp.ok) {
			return new Response(await resp.text(), { status: resp.status });
		}

		const raw = await resp.text();

		return {
			content: raw,
		};
	}
}

export class GetContentBatch extends OpenAPIRoute {}
