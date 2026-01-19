"use client";

import { useState } from "react";

export default function UploadImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const selected = e.target.files[0];
    setFile(selected);

    // preview ảnh
    setPreview(URL.createObjectURL(selected));
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={onChangeFile} />

      {preview && <img src={preview} alt="preview" style={{ width: 300 }} />}
    </div>
  );
}
