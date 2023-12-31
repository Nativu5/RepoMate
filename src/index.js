import { GetSearch } from './api/search.js';
import { GetRepoTree, GetRepoMeta } from './api/repo.js';
import { GetContentSingle, GetContentBatch } from './api/content.js';

import { OpenAPIRouter } from '@cloudflare/itty-router-openapi';

export const router = OpenAPIRouter({
	openapiVersion: "3",
	schema: {
		info: {
			title: 'RepoMate API',
			description: 'A plugin that allows the user to access GitHub repositories using ChatGPT',
			version: 'v1.0.1',
		},
		servers: [
			{
				url: 'https://repo-mate.api.naiv.fun',
				description: 'Production',
			},
			{
				url: 'http://localhost:8787',
				description: 'Testing',
			},
		],
	},
	docs_url: '/',
	openapi_url: '/.well-known/openapi.json',
	aiPlugin: {
		name_for_human: 'RepoMate',
		name_for_model: 'github_repository_access',
		description_for_human: 'GitHub Repositories Search & Access plugin for ChatGPT.',
		description_for_model:
			'You can use this plugin to access GitHub repositories, including READMEs, project structures and so on.',
		contact_email: 'root@naiv.fun',
		legal_info_url: 'https://github.com/Nativu5/RepoMate/blob/master/LICENSE',
		logo_url: 'https://workers.cloudflare.com/resources/logo/logo.svg',
	},
});

// Define routes for API
router.get('/api/tree', GetRepoTree);
router.get('/api/meta', GetRepoMeta);
router.get('/api/search', GetSearch);
router.get('/api/content/single', GetContentSingle);
router.get('/api/content/batch', GetContentBatch);

// 404 for everything else
router.all('*', () => new Response('Page Not Found. Please consult your client.', { status: 404 }));

export default {
	fetch: (...args) =>
		router.handle(...args).catch((err) => {
			// Log the error
			console.log(err);
			// Change 500 to 400
			return new Response('Bad Request. Please request your client to revise the input.', { status: 400 });
		}),
};
