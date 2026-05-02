import { useEffect, useRef, useState, useCallback, forwardRef } from 'react';

const CANVAS_SIZE = 600;
const DEFAULT_TEXT_X_RATIO = 0.07;
const DEFAULT_TEXT_Y_RATIO = 0.82;

function getDefaultPos() {
  return { x: CANVAS_SIZE * DEFAULT_TEXT_X_RATIO, y: CANVAS_SIZE * DEFAULT_TEXT_Y_RATIO };
}

async function getCroppedImage(imageSrc, croppedAreaPixels) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        CANVAS_SIZE,
        CANVAS_SIZE,
      );
      resolve(canvas);
    });
    image.addEventListener('error', reject);
    image.src = imageSrc;
  });
}

function drawText(ctx, pos) {
  const fontSize = Math.round(CANVAS_SIZE * 0.1);
  // TODO: replace 'Lato' with Imago Regular once licensed — update --font-overlay in index.css
  const fontFamily = getComputedStyle(document.documentElement)
    .getPropertyValue('--font-overlay')
    .trim() || "'Lato', sans-serif";

  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.font = `300 ${fontSize}px ${fontFamily}`;
  ctx.textBaseline = 'top';

  // Wide letter-spacing: manually space each character
  const letterSpacing = fontSize * 0.18;
  const lines = ['americ an', 'football'];
  const lineHeight = fontSize * 1.25;

  lines.forEach((line, i) => {
    let x = pos.x;
    const y = pos.y + i * lineHeight;
    for (const char of line) {
      ctx.fillText(char, x, y);
      x += ctx.measureText(char).width + letterSpacing;
    }
  });

  ctx.restore();
}

const PreviewCanvas = forwardRef(function PreviewCanvas({ imageSrc, croppedAreaPixels }, canvasRef) {
  const [textPos, setTextPos] = useState(getDefaultPos);
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const baseImageRef = useRef(null);

  // Build the base (cropped) image once
  useEffect(() => {
    if (!imageSrc || !croppedAreaPixels) return;
    getCroppedImage(imageSrc, croppedAreaPixels).then((canvas) => {
      baseImageRef.current = canvas;
      render(textPos);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc, croppedAreaPixels]);

  const render = useCallback((pos) => {
    const canvas = canvasRef.current;
    if (!canvas || !baseImageRef.current) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.drawImage(baseImageRef.current, 0, 0);
    drawText(ctx, pos);
  // canvasRef is a stable forwarded ref object — safe to omit from deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-render whenever textPos changes
  useEffect(() => {
    render(textPos);
  }, [textPos, render]);

  // ── Pointer helpers ──────────────────────────────────────────────────────────

  function canvasPoint(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = CANVAS_SIZE / rect.width;
    const scaleY = CANVAS_SIZE / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }

  function startDrag(e) {
    e.preventDefault();
    const pt = canvasPoint(e);
    dragOffset.current = { x: pt.x - textPos.x, y: pt.y - textPos.y };
    setDragging(true);
  }

  function onDrag(e) {
    if (!dragging) return;
    e.preventDefault();
    const pt = canvasPoint(e);
    setTextPos({ x: pt.x - dragOffset.current.x, y: pt.y - dragOffset.current.y });
  }

  function stopDrag() {
    setDragging(false);
  }

  function resetPosition() {
    setTextPos(getDefaultPos());
  }

  return (
    <div className="preview-wrapper">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className={`preview-canvas${dragging ? ' dragging' : ''}`}
        onMouseDown={startDrag}
        onMouseMove={onDrag}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onTouchStart={startDrag}
        onTouchMove={onDrag}
        onTouchEnd={stopDrag}
      />
      <button className="btn btn-secondary" onClick={resetPosition}>
        Reset text position
      </button>
    </div>
  );
});

export default PreviewCanvas;
