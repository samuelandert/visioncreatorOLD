<script lang="ts">
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let ballPosition = tweened({ x: 50, y: 250 }, { duration: 500, easing: cubicOut });
	let putterPosition = { x: 50, y: 250 };
	let hole = { x: 750, y: 250 };
	let putter = { angle: 0 };
	let power = 0;
	let shots = 0;
	let isCharging = false;
	let chargeStartTime = 0;
	let maxPower = 1000;
	let isInHole = false;
	let gameOver = false;
	let isBallMoving = false;
	let ballStopTimeout: number | null = null;

	const BALL_RADIUS = 10;
	const HOLE_RADIUS = 20;
	const CANVAS_WIDTH = 800;
	const CANVAS_HEIGHT = 500;

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		draw();
	});

	function draw() {
		ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		// Zeichne die Bahn
		ctx.fillStyle = '#90EE90';
		ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		// Zeichne das Loch
		ctx.fillStyle = '#000';
		ctx.beginPath();
		ctx.arc(hole.x, hole.y, HOLE_RADIUS, 0, Math.PI * 2);
		ctx.fill();

		if (!isInHole) {
			// Zeichne den Ball
			ctx.fillStyle = '#FFF';
			ctx.beginPath();
			ctx.arc($ballPosition.x, $ballPosition.y, BALL_RADIUS, 0, Math.PI * 2);
			ctx.fill();

			// Zeichne den Schläger
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.moveTo($ballPosition.x, $ballPosition.y);
			ctx.lineTo(
				$ballPosition.x + Math.cos(putter.angle) * 40,
				$ballPosition.y + Math.sin(putter.angle) * 40
			);
			ctx.stroke();
		}

		if (isCharging) {
			const currentTime = Date.now();
			const chargeDuration = currentTime - chargeStartTime;
			power = Math.min(chargeDuration, maxPower);

			ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
			ctx.fillRect(10, 10, (power / maxPower) * 200, 20);
		}

		if (gameOver) {
			// Zeichne den Gewinnbildschirm
			ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
			ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

			ctx.fillStyle = '#FFF';
			ctx.font = 'bold 36px Arial';
			ctx.textAlign = 'center';
			ctx.fillText('Gewonnen!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);

			ctx.font = '24px Arial';
			ctx.fillText(`Anzahl der Schläge: ${shots}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
		}

		if (!gameOver) {
			requestAnimationFrame(draw);
		}
	}

	function hit() {
		if (isInHole || gameOver || isBallMoving) return;

		shots++;
		isBallMoving = true;
		const dx = -Math.cos(putter.angle) * power * 0.8;
		const dy = -Math.sin(putter.angle) * power * 0.8;

		ballPosition.update((ball) => {
			let newX = ball.x + dx;
			let newY = ball.y + dy;

			// Kollisionserkennung mit den Banden
			if (newX - BALL_RADIUS < 0 || newX + BALL_RADIUS > CANVAS_WIDTH) {
				newX = Math.max(BALL_RADIUS, Math.min(newX, CANVAS_WIDTH - BALL_RADIUS));
			}
			if (newY - BALL_RADIUS < 0 || newY + BALL_RADIUS > CANVAS_HEIGHT) {
				newY = Math.max(BALL_RADIUS, Math.min(newY, CANVAS_HEIGHT - BALL_RADIUS));
			}

			return { x: newX, y: newY };
		});

		// Überprüfe, ob der Ball im Loch ist und bewege den Schläger nach einer Verzögerung
		ballPosition.subscribe((ball) => {
			const distance = Math.sqrt(Math.pow(ball.x - hole.x, 2) + Math.pow(ball.y - hole.y, 2));
			if (distance < HOLE_RADIUS && !isInHole) {
				isInHole = true;
				gameOver = true;
				draw();
			} else {
				if (ballStopTimeout) clearTimeout(ballStopTimeout);
				ballStopTimeout = setTimeout(() => {
					isBallMoving = false;
					putterPosition = { x: ball.x, y: ball.y };
				}, 500) as unknown as number;
			}
		});
	}

	function handleMouseMove(event: MouseEvent) {
		if (isInHole || gameOver || isBallMoving) return;
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		putter.angle = Math.atan2(y - $ballPosition.y, x - $ballPosition.x) + Math.PI;
	}

	function handleMouseDown() {
		if (isInHole || gameOver || isBallMoving) return;
		isCharging = true;
		chargeStartTime = Date.now();
		power = 0;
	}

	function handleMouseUp() {
		if (isInHole || gameOver || isBallMoving) return;
		if (isCharging) {
			isCharging = false;
			hit();
		}
	}

	function restartGame() {
		isInHole = false;
		gameOver = false;
		shots = 0;
		isBallMoving = false;
		if (ballStopTimeout) clearTimeout(ballStopTimeout);
		ballPosition.set({ x: 50, y: 250 }, { duration: 0 });
		putterPosition = { x: 50, y: 250 };
		draw();
	}
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-surface-800">
	<h1 class="mb-4 text-3xl font-bold">Minigolf</h1>
	<div class="relative">
		<canvas
			bind:this={canvas}
			width={CANVAS_WIDTH}
			height={CANVAS_HEIGHT}
			on:mousemove={handleMouseMove}
			on:mousedown={handleMouseDown}
			on:mouseup={handleMouseUp}
			class="border border-gray-300"
		/>
		{#if gameOver}
			<button
				on:click={restartGame}
				class="absolute px-4 py-2 font-bold text-white transform -translate-x-1/2 translate-y-16 bg-blue-500 rounded top-1/2 left-1/2 hover:bg-blue-700"
			>
				Neustart
			</button>
		{/if}
	</div>
	<p class="mt-2">Schläge: {shots}</p>
	<p class="mt-2">Klicken und halten Sie die Maus, um zu schlagen</p>
</div>
