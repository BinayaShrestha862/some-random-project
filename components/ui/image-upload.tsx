"use client";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { ImagePlusIcon, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string[]) => void; // Accept an array of URLs
  onRemove: (value: string) => void;
  value: string[];
}

interface Results {
  event: string;
  info?: {
    secure_url: string;
  };
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value = [],
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(value);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Sync the local state with the parent's value
    setUploadedUrls(value);
  }, []);

  useEffect(() => {
    // Notify the parent component of the updated URLs
    onChange(uploadedUrls);
  }, [uploadedUrls]); // Triggered whenever uploadedUrls changes

  const handleUpload = (result: Results) => {
    if (result.event === "success" && result.info?.secure_url) {
      // Add the new URL to the local state
      setUploadedUrls((prevUrls) => [...prevUrls, result.info?.secure_url||""]);
    }
  };

  if (!isMounted) return null;

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {uploadedUrls.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="absolute z-10 top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
                aria-label="Remove image"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Uploaded image"
              src={url}
            />
          </div>
        ))}
      </div>

      <CldUploadWidget
        uploadPreset="spkd0oze"
        options={{ multiple: true }} // Allow multiple file selection
        onSuccess={(results) => {
          handleUpload(results as Results);
        }}
      >
        {({ open }) => (
          <Button
            type="button"
            disabled={disabled}
            variant="secondary"
            onClick={() => {
              if (typeof open === "function") open();
            }}
          >
            <ImagePlusIcon className="h-4 w-4 mr-2" /> Upload images
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;