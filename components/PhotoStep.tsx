"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { photoLimits } from "@/data/site";

export type StagedPhoto = {
  id: string;
  file: File;
  url: string; // object URL for preview
};

/**
 * Photo step for the quote questionnaire.
 *
 * Supports TWO ways to add photos:
 *   1. Upload — choose existing images from the device.
 *   2. Camera — capture a photo live from the website using the device camera
 *      (rear camera preferred on mobile; webcam on desktop).
 *
 * Photos are optional for now. Limits (count + size) come from `photoLimits`.
 */
export function PhotoStep({
  photos,
  setPhotos,
}: {
  photos: StagedPhoto[];
  setPhotos: React.Dispatch<React.SetStateAction<StagedPhoto[]>>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addFiles(files: FileList | File[]) {
    setError(null);
    const incoming = Array.from(files);
    const room = photoLimits.maxFiles - photos.length;

    if (room <= 0) {
      setError(`You can add up to ${photoLimits.maxFiles} photos.`);
      return;
    }

    const accepted: StagedPhoto[] = [];
    for (const file of incoming.slice(0, room)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > photoLimits.maxSizeMB * 1024 * 1024) {
        setError(`Each photo must be under ${photoLimits.maxSizeMB} MB.`);
        continue;
      }
      accepted.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        url: URL.createObjectURL(file),
      });
    }

    if (incoming.length > room) {
      setError(`Only the first ${room} photo(s) were added (max ${photoLimits.maxFiles}).`);
    }

    setPhotos((prev) => [...prev, ...accepted]);
  }

  function removePhoto(id: string) {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  }

  return (
    <div>
      {/* Thumbnails */}
      {photos.length > 0 && (
        <div className="mb-5 grid grid-cols-3 gap-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt="Home preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(photo.id)}
                aria-label="Remove photo"
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-charcoal/60 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 focus:opacity-100"
              >
                <Icon name="trash" className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-emerald/30 bg-white px-4 py-6 text-emerald transition-colors hover:border-emerald/60 hover:bg-emerald/5 dark:border-white/15 dark:bg-white/5 dark:text-sage-light"
        >
          <Icon name="upload" className="h-6 w-6" />
          <span className="text-sm font-semibold">Upload photos</span>
        </button>

        <button
          type="button"
          onClick={() => setCameraOpen(true)}
          className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-emerald/30 bg-white px-4 py-6 text-emerald transition-colors hover:border-emerald/60 hover:bg-emerald/5 dark:border-white/15 dark:bg-white/5 dark:text-sage-light"
        >
          <Icon name="camera" className="h-6 w-6" />
          <span className="text-sm font-semibold">Use camera</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files);
          e.target.value = ""; // allow re-selecting the same file
        }}
      />

      <p className="mt-3 text-center text-xs text-charcoal/50 dark:text-cream/50">
        {photos.length}/{photoLimits.maxFiles} photos · up to {photoLimits.maxSizeMB} MB each
      </p>

      {error && (
        <p className="mt-2 text-center text-xs font-medium text-red-500">
          {error}
        </p>
      )}

      {cameraOpen && (
        <CameraCapture
          onCapture={(file) => addFiles([file])}
          onClose={() => setCameraOpen(false)}
          disabled={photos.length >= photoLimits.maxFiles}
        />
      )}
    </div>
  );
}

/**
 * Live camera capture overlay using the MediaDevices API.
 * Falls back gracefully (with a helpful message) if the browser blocks access
 * or no camera is available — the user can still upload from their device.
 */
function CameraCapture({
  onCapture,
  onClose,
  disabled,
}: {
  onCapture: (file: File) => void;
  onClose: () => void;
  disabled: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setReady(true);
        }
      } catch {
        setError(
          "We couldn't access your camera. Please check your browser permissions, or upload a photo instead."
        );
      }
    }

    start();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function capture() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `home-photo-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        onCapture(file);
        onClose();
      },
      "image/jpeg",
      0.85
    );
  }

  // Fullscreen camera overlay. Uses `100dvh` (dynamic viewport height) so the
  // controls are never hidden behind the mobile browser toolbar, and pins the
  // shutter to the bottom within the device safe-area inset.
  return (
    <div
      className="fixed inset-0 z-[120] h-[100dvh] overflow-hidden bg-black"
      role="dialog"
      aria-modal="true"
      aria-label="Take a photo"
    >
      {error ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center text-white/85">
          <Icon name="camera" className="h-12 w-12 opacity-60" />
          <p className="max-w-xs text-sm">{error}</p>
          <button type="button" onClick={onClose} className="btn-primary mt-2">
            Close
          </button>
        </div>
      ) : (
        <>
          {/* Live camera feed fills the screen */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Top bar: title + close */}
          <div
            className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-4 pb-10 pt-4"
            style={{ paddingTop: "calc(env(safe-area-inset-top) + 1rem)" }}
          >
            <span className="font-display text-lg font-bold text-white drop-shadow">
              Take a photo
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close camera"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
            >
              <Icon name="close" className="h-5 w-5" />
            </button>
          </div>

          {/* Bottom controls: shutter, always visible above the safe area */}
          <div
            className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 pt-12"
            style={{
              paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)",
            }}
          >
            {!ready && (
              <p className="text-sm text-white/80">Starting camera…</p>
            )}
            {disabled ? (
              <p className="rounded-full bg-black/40 px-4 py-2 text-center text-sm text-white/90">
                Photo limit reached — close to review your photos.
              </p>
            ) : (
              <button
                type="button"
                onClick={capture}
                disabled={!ready}
                aria-label="Capture photo"
                className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-white/25 ring-4 ring-white/50 backdrop-blur-sm transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="h-14 w-14 rounded-full bg-white shadow-lg" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
