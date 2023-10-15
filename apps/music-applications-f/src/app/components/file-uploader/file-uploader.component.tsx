import React, { useRef } from 'react';
import './file-uploader.styles.scss';

const FileUploader = ({
  handleFile,
  buttonText,
}: {
  handleFile: (file: File) => void;
  buttonText: string;
}) => {
  const hiddenInput = useRef<any>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileUploaded = event.target.files[0];
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
    </>
  );
};

export default FileUploader;
