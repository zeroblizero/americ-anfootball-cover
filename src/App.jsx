import { useState, useRef, useCallback } from 'react';
import QuoteBanner from './components/QuoteBanner.jsx';
import CropView from './components/CropView.jsx';
import PreviewCanvas from './components/PreviewCanvas.jsx';
import DownloadButton from './components/DownloadButton.jsx';
import './App.css';

export default function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropped, setIsCropped] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const canvasRef = useRef(null);

  function loadFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setImageSrc(e.target.result);
    reader.readAsDataURL(file);
  }

  function handleFileInput(e) {
    loadFile(e.target.files[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    loadFile(e.dataTransfer.files[0]);
  }

  const handleCropComplete = useCallback((_croppedArea, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  function handleCropConfirm() {
    if (croppedAreaPixels) setIsCropped(true);
  }

  function handleStartOver() {
    setImageSrc(null);
    setCroppedAreaPixels(null);
    setIsCropped(false);
  }

  // Header declaration
  const appHeader = (
    <header className="app-header">
      <QuoteBanner />
      <h1 className="app-title">americ anfootball<br />cover generator</h1>
    </header>
  );

  // Footer declaration
  const appFooter = (
    <footer className="app-footer">
      <span>made with love by zeroblizero</span>
      <a href="https://github.com/zeroblizero/americ-anfootball-cover" className="footer-icon" aria-label="GitHub">
        <svg viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </a>
      <a href="https://instagram.com/zeroblizero" className="footer-icon" aria-label="Instagram">
        <svg viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.204 0-3.584-.012-4.849-.069-3.259-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.265-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 11-2.881.001 1.44 1.44 0 012.881-.001z"/>
        </svg>
      </a>
    </footer>
  );

  // ── Step 3: preview + download ───────────────────────────────────────────────
  if (isCropped) {
    return (
      <div className="app">
        {appHeader}
        <main className="app-main">
          <p className="step-hint">Drag the text to reposition it, then download.</p>
          <PreviewCanvas
            ref={canvasRef}
            imageSrc={imageSrc}
            croppedAreaPixels={croppedAreaPixels}
          />
          <div className="action-row">
            <button className="btn btn-ghost" onClick={handleStartOver}>
              Start over
            </button>
            <DownloadButton canvasRef={canvasRef} />
          </div>
        </main>
        {appFooter}
      </div>
    );
  }

  // ── Step 2: crop view ────────────────────────────────────────────────────────
  if (imageSrc) {
    return (
      <div className="app">
        {appHeader}
        <main className="app-main">
          <p className="step-hint">Position your photo in the square, then crop.</p>
          <CropView imageSrc={imageSrc} onCropComplete={handleCropComplete} />
          <div className="action-row">
            <button className="btn btn-ghost" onClick={handleStartOver}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCropConfirm}>
              Crop &amp; Continue
            </button>
          </div>
        </main>
        {appFooter}
      </div>
    );
  }

  // ── Step 1: upload zone ──────────────────────────────────────────────────────
  return (
    <div className="app">
      {appHeader}
      <main className="app-main">
        <label
          className={`upload-zone${isDragOver ? ' drag-over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            className="upload-input"
            onChange={handleFileInput}
          />
          <span className="upload-icon" aria-hidden="true">⬆</span>
          <span className="upload-label">Drop a photo here, or click to browse</span>
          <span className="upload-sublabel">Any image — it will be cropped to a square</span>
        </label>
      </main>
      {appFooter}
    </div>
  );
}
