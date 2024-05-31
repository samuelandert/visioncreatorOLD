<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';

	export let data;
</script>

<div class="video-container">
	<video autoplay muted loop class="background-video">
		<source src="/wald.mp4" type="video/mp4" />
		Your browser does not support the video tag.
	</video>
	<div class="overlay">
		<div class="auth-container">
			<Auth
				supabaseClient={data.supabase}
				view="magic_link"
				redirectTo={`${data.url}/auth/callback`}
				showLinks={false}
				appearance={{
					theme: ThemeSupa
				}}
			/>
		</div>
	</div>
</div>

<style>
	.video-container {
		position: relative;
		width: 100%;
		height: 100vh;
		overflow: hidden;
	}

	.background-video {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		z-index: 0;
	}

	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.auth-container {
		width: 100%;
		max-width: 300px;
		padding-left: 20px;
		padding-right: 20px;
		background: rgba(255, 255, 255);
		border-radius: 8px;
	}
</style>
