import { useEffect, useRef, useState, useCallback, forwardRef } from 'react';

const CANVAS_SIZE = 600;
const DEFAULT_TEXT_X_RATIO = 0.548; // Default X position 
const DEFAULT_TEXT_Y_RATIO = 0.280; // Default Y position

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

  // Get font family from CSS variable 
  const fontFamily = getComputedStyle(document.documentElement)
  .getPropertyValue('--font-overlay')
  .trim() || "'Lato', sans-serif";
  
  // Font sizes and spacing are relative to canvas size for better scaling results
  const fontSizeLarge = Math.round(CANVAS_SIZE * 0.124);
  const fontSizeSmall  = Math.round(CANVAS_SIZE * 0.035);

  // White fill with some opacity to ensure text is visible on various backgrounds
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.textBaseline = 'top';

  // Letter spacing and line height are also scaled relative to font size
  // Current values work for Noto Sans, but may need adjustments for Imago
  const letterSpacingLarge = fontSizeLarge * 0.16;
  const letterSpacingSmall = fontSizeSmall * 0.31;
  const lineHeight = fontSizeLarge * 0.9;
  const indents = [0, 56];

  // Define text lines
  const lines = [
    { text: 'americ',      fontSize: fontSizeLarge, spacing: letterSpacingLarge, weight: 700 },
    { text: 'anfootball',  fontSize: fontSizeSmall,  spacing: letterSpacingSmall, weight: 400 },
  ];

  // Measure total width of each line to center them relative to each other
  function measureLine({ text, fontSize, spacing, weight }) {
    ctx.font = `${weight} ${fontSize}px ${fontFamily}`;
    let width = 0;
    for (const char of text) {
      width += ctx.measureText(char).width + spacing;
    }
    return width - spacing; // no trailing spacing
  }

  const widths = lines.map(measureLine);
  const maxWidth = Math.max(...widths);

  let y = pos.y;
  lines.forEach((line, i) => {
    ctx.font = `${line.weight} ${line.fontSize}px ${fontFamily}`;
    let x = pos.x + indents[i];
    for (const char of line.text) {
      ctx.fillText(char, x, y);
      x += ctx.measureText(char).width + line.spacing;
    }
    y += i === 0 ? lineHeight : 0;
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
