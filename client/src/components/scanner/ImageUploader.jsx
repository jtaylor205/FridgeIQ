import { useState, useRef } from 'react';

export default function ImageUploader({ onFileSelect }) {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      className="uploader-dropzone"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg"
        className="uploader-hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {preview ? (
        <div className="uploader-preview">
          <img src={preview} alt="Food label preview" />
          <button
            className="uploader-change-btn"
            onClick={(e) => { e.stopPropagation(); setPreview(null); onFileSelect(null); }}
          >
            Change image
          </button>
        </div>
      ) : (
        <div className="uploader-empty">
          <div className="uploader-upload-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p>Click or drag to upload</p>
          <span>PNG, JPG up to 10MB</span>
        </div>
      )}
    </div>
  );
}
