/** @/hooks/use-sound.ts */

export const useSound = (enabled: boolean) => {
	const playPopSound = () => {
		if (!enabled) return;
		try {
			const AudioContext = window.AudioContext;
			if (AudioContext) {
				const ctx = new AudioContext();
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();

				osc.connect(gain);
				gain.connect(ctx.destination);

				osc.type = "sine";
				osc.frequency.setValueAtTime(800, ctx.currentTime);
				osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

				gain.gain.setValueAtTime(0.1, ctx.currentTime);
				gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

				osc.start();
				osc.stop(ctx.currentTime + 0.1);
			}
		} catch (e) {
			// Fallback
		}
	};
	return { playPopSound };
};
