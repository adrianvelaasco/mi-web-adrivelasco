/**
 * Background Waves Component
 * Renders the topological wave effect on a canvas.
 */

(function () {
    let canvas, ctx;
    let topoTime = 0;
    let animationId;

    function init() {
        // Create canvas if it doesn't exist
        canvas = document.getElementById('background-waves');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'background-waves';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.zIndex = '0'; // Above body background, below content
            canvas.style.pointerEvents = 'none';
            document.body.prepend(canvas);
        }
        ctx = canvas.getContext('2d');

        window.addEventListener('resize', resize);
        resize();
        animate();
    }

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);
    }

    function drawTopoLines() {
        const numRings = 12;
        const width = window.innerWidth;
        const height = window.innerHeight;

        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.lineWidth = 1.5;

        const centerX = width / 2;
        const centerY = height / 2;

        for (let i = 0; i < numRings; i++) {
            ctx.beginPath();
            // Blue color matching the theme
            ctx.strokeStyle = `rgba(0, 0, 255, ${0.05 + (i * 0.015)})`;

            const baseRadius = (height / 6) * (i + 1);
            const driftX = Math.sin(topoTime * 0.5 + i) * 40;
            const driftY = Math.cos(topoTime * 0.3 + i * 1.5) * 30;

            for (let angle = 0; angle <= Math.PI * 2; angle += 0.1) {
                const distortion1 = Math.sin(angle * 3 + topoTime + i) * 20;
                const distortion2 = Math.cos(angle * 5 - topoTime * 0.8) * 15;
                const distortion3 = Math.sin(angle * 2 + topoTime * 0.4 + i * 2) * 30;
                const r = baseRadius + distortion1 + distortion2 + distortion3;
                const x = (centerX + driftX) + Math.cos(angle) * r;
                const y = (centerY + driftY) + Math.sin(angle) * r;
                if (angle === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }
        ctx.restore();
    }

    function animate() {
        topoTime += 0.006; // Adjust speed as needed
        drawTopoLines();
        animationId = requestAnimationFrame(animate);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
