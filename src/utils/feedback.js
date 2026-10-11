/**
 * Micro-sensory Feedback Engine (Audio & Haptic)
 * Implements Don Norman's Principle 4: Instant Feedback (< 100ms)
 * Uses native Web Audio API and Navigator Vibration API (Zero dependencies)
 */
class FeedbackEngine {
    constructor() {
        this.audioCtx = null;
        this.enabled = true;
    }

    getAudioContext() {
        if (!this.audioCtx && typeof window !== 'undefined') {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.audioCtx = new AudioCtx();
            }
        }
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume().catch(() => {});
        }
        return this.audioCtx;
    }

    /**
     * Subtle tactile click for buttons, toggles, and tabs
     */
    tap() {
        if (!this.enabled) return;
        try {
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(15);
            }
            const ctx = this.getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(500, now);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.018);
            gain.gain.setValueAtTime(0.015, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.018);
        } catch (_) {}
    }

    /**
     * Crisp harmonious chime for successful transactions & confirmations
     */
    success() {
        if (!this.enabled) return;
        try {
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate([20, 30, 20]);
            }
            const ctx = this.getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(587.33, now); // D5
            osc.frequency.setValueAtTime(880, now + 0.05); // A5
            gain.gain.setValueAtTime(0.025, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.12);
        } catch (_) {}
    }

    /**
     * Haptic alert for destructive actions, undo, and warnings
     */
    warning() {
        if (!this.enabled) return;
        try {
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate([30, 40, 30]);
            }
        } catch (_) {}
    }
}

export const feedback = new FeedbackEngine();
export default feedback;
