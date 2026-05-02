export default function DownloadButton({ canvasRef }) {
  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'americ-anfootball.png';
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  return (
    <button className="btn btn-primary" onClick={handleDownload}>
      Download
    </button>
  );
}
