<script>
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';

	export let data;
</script>

<Auth
	supabaseClient={data.supabase}
	view="magic_link"
	redirectTo={`${data.url}/auth/callback`}
	showLinks={false}
	appearance={{
		theme: ThemeSupa
	}}
/>
