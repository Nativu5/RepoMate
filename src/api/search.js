import { WorkerHeaders } from './common';
import { OpenAPIRoute, Query } from '@cloudflare/itty-router-openapi';

export class GetSearch extends OpenAPIRoute {
	static schema = {
		tags: ['Search'],
		summary: 'Search repositories by a query parameter',
		parameters: {
			query: Query(String, {
				description: 'The query to search for',
				default: 'cloudflare workers',
			}),
		},
		responses: {
			200: {
				description: "search results for the given query",
				schema: {
					repos: [
						{
							name: 'itty-router-openapi',
							description: 'OpenAPI 3 schema generator and validator for Cloudflare Workers',
							stars: '80',
							url: 'https://github.com/cloudflare/itty-router-openapi',
						},
					],
				},
			},
		},
	};

	async handle(request, env, ctx, data) {
		const url = 'https://api.github.com/search/repositories?q=' + data.query.query;

		const resp = await fetch(url, {
			headers: {
				...WorkerHeaders,
			},
		});

		if (!resp.ok) {
			return new Response(await resp.text(), { status: 400 });
		}

		const json = await resp.json();

		const repos = json.items.map((item) => ({
			name: item.name,
			description: item.description,
			stars: item.stargazers_count,
			url: item.html_url,
		}));

		return {
			repos: repos,
		};
	}
}
