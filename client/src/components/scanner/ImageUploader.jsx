import { useState, useRef } from 'react';
import styles from './ImageUploader.module.css';

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
      className={styles.dropzone}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg"
        className={styles.hidden}
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {preview ? (
        <div className={styles.preview}>
          <img src={preview} alt="Food label preview" />
          <button
            className={styles.changeBtn}
            onClick={(e) => { e.stopPropagation(); setPreview(null); onFileSelect(null); }}
          >
            Upload Different Image
          </button>
        </div>
      ) : (
        <div className={styles.empty}>
          <div className={styles.icon}>↑</div>
          <p>Click to upload or drag and drop</p>
          <span>PNG, JPG, JPEG (max 10MB)</span>
        </div>
      )}
    </div>
  );
}
