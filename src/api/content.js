import { OpenAPIRoute, Query } from '@cloudflare/itty-router-openapi';
import { WorkerHeaders } from './common';

export class GetContentSingle extends OpenAPIRoute {
	static schema = {
		tags: ['ContentSingle'],
		summary: 'Get content of a single file in the repository',
		parameters: {
			owner: Query(String, {
				description: 'owner of the repository',
			}),
			repo: Query(String, {
				description: 'name of the repository',
			}),
			branch: Query(String, {
				description: 'branch name of the repository; blank for default',
				required: false,
				default: '',
			}),
			path: Query(String, {
				description: 'path of the file',
			}),
		},
		responses: {
			200: {
				description: 'single file content for the given path',
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

export class GetContentBatch extends OpenAPIRoute {
	static schema = {
		tags: ['ContentBatch'],
		summary: 'Get content of a batch of files in the repository',
		parameters: {
			owner: Query(String, {
				description: 'owner of the repository',
			}),
			repo: Query(String, {
				description: 'name of the repository',
			}),
			branch: Query(String, {
				description: 'branch name of the repository; blank for default',
				required: false,
				default: '',
			}),
			pathlist: Query(String, {
				description: 'path list of the files(commas separated, e.g. `file1,file2`)',
			}),
		},
		responses: {
			200: {
				description: 'file contents for the given paths',
				schema: {
					contents: [
						{
							path: 'README.md',
							content: 'Here is the README.',
						},
						{
							path: 'src/index.js',
							content: 'console.log("Hello World!")',
						},
					],
				},
			},
		},
	};

	async handle(request, env, ctx, data) {
		const paths = data.query.pathlist.split(',');

		const fileContents = [];

		for (const path of paths) {
			const url = `https://api.github.com/repos/${data.query.owner}/${data.query.repo}/contents/${path}?ref=${data.query.branch}`;

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

			fileContents.push({
				path: path,
				content: raw,
			});
		}

		return {
			contents: fileContents,
		};
	}
}
