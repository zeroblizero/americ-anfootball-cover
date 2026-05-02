import Cropper from 'react-easy-crop';
import { useState } from 'react';

export default function CropView({ imageSrc, onCropComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  return (
    <div className="crop-wrapper">
      <div className="crop-container">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          objectFit='cover'
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <p className="crop-hint">Drag to reposition · Scroll or pinch to zoom</p>
    </div>
  );
}
