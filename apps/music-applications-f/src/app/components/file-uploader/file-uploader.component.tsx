import React, { useRef, useState } from 'react';
import './file-uploader.styles.scss';

const FileUploader = ({
  handleFile,
  buttonText,
  showFileName,
}: {
  handleFile: (file: File) => void;
  buttonText: string;
  showFileName: boolean;
}) => {
  const hiddenInput = useRef<any>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileUploaded = event.target.files[0];
      setFile(fileUploaded);
      handleFile(fileUploaded);
    }
  };

  return (
    <>
      <div
        className="upload-button"
        onClick={(_) => hiddenInput.current.click()}
      >
        {buttonText}
      </div>
      <input
        type="file"
        onChange={handleChange}
        ref={hiddenInput}
        style={{ display: 'none', cursor: 'pointer' }}
      />
      {showFileName && file && <div className="file-name">{file.name}</div>}
    </>
  );
};

export default FileUploader;
