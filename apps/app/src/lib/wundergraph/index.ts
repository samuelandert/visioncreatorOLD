import { createSvelteClient } from '@wundergraph/svelte-query';
import { createClient } from 'generated-wundergraph';
import type { Operations } from 'generated-wundergraph';

const client = createClient();

const { createFileUpload, createMutation, createQuery, createSubscription, getAuth, getUser, queryKey, prefetchQuery } =
	createSvelteClient<Operations>(client);

export { createFileUpload, createMutation, createQuery, createSubscription, getAuth, getUser, queryKey, prefetchQuery, client };
