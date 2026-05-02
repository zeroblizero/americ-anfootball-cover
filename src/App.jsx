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

  // ── Step 3: preview + download ───────────────────────────────────────────────
  if (isCropped) {
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">americ anfootball cover generator</h1>
        </header>
        <main className="app-main">
          <p className="step-hint">Drag the text to reposition it, then download.</p>
          <PreviewCanvas
            ref={canvasRef}
            imageSrc={imageSrc}
            croppedAreaPixels={croppedAreaPixels}
          />
          <div className="action-row">
            <DownloadButton canvasRef={canvasRef} />
            <button className="btn btn-ghost" onClick={handleStartOver}>
              Start over
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ── Step 2: crop view ────────────────────────────────────────────────────────
  if (imageSrc) {
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">americ anfootball cover generator</h1>
        </header>
        <main className="app-main">
          <p className="step-hint">Position your photo in the square, then crop.</p>
          <CropView imageSrc={imageSrc} onCropComplete={handleCropComplete} />
          <div className="action-row">
            <button className="btn btn-primary" onClick={handleCropConfirm}>
              Crop &amp; Continue
            </button>
            <button className="btn btn-ghost" onClick={handleStartOver}>
              Cancel
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ── Step 1: upload zone ──────────────────────────────────────────────────────
  return (
    <div className="app">
      <header className="app-header">
        <QuoteBanner />
        <h1 className="app-title">americ anfootball cover generator </h1>
      </header>
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
    </div>
  );
}
