"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export type AspectRatioOption = {
  id: string;
  label: string;
  ratio: number | null;
  icon: string;
};

const ASPECT_RATIO_PRESETS: AspectRatioOption[] = [
  { id: "original", label: "Original", ratio: null, icon: "bi-aspect-ratio" },
  { id: "1:1", label: "1:1", ratio: 1, icon: "bi-square" },
  { id: "16:9", label: "16:9", ratio: 16 / 9, icon: "bi-laptop" },
  { id: "9:16", label: "9:16", ratio: 9 / 16, icon: "bi-phone" },
  { id: "4:3", label: "4:3", ratio: 4 / 3, icon: "bi-card-image" },
  { id: "21:9", label: "21:9", ratio: 21 / 9, icon: "bi-display" },
];

interface Props {
  isOpen: boolean;
  imageSrc: string;
  onApply: (processedDataUrl: string) => void;
  onCancel: () => void;
  bannerContext?: string;
}

export default function LinkedInImageCropper({
  isOpen,
  imageSrc,
  onApply,
  onCancel,
  bannerContext,
}: Props) {
  const [selectedRatioId, setSelectedRatioId] = useState<string>("16:9");
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageMeta, setImageMeta] = useState<{ width: number; height: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);
  const logoImageRef = useRef<HTMLImageElement | null>(null);

  // Preload logo
  useEffect(() => {
    const logo = new Image();
    logo.crossOrigin = "anonymous";
    logo.src = "/ads/tinyadds-watermark-logo.png";
    logo.onload = () => {
      logoImageRef.current = logo;
    };
    logo.onerror = () => {
      const fallbackLogo = new Image();
      fallbackLogo.crossOrigin = "anonymous";
      fallbackLogo.src = "/logo-removebg.png";
      fallbackLogo.onload = () => {
        logoImageRef.current = fallbackLogo;
      };
    };
  }, []);

  // Recommend ratio based on banner context if provided
  useEffect(() => {
    if (!bannerContext) return;
    const lower = bannerContext.toLowerCase();
    if (lower.includes("standy")) {
      setSelectedRatioId("9:16");
    } else if (lower.includes("slider") || lower.includes("section")) {
      setSelectedRatioId("16:9");
    }
  }, [bannerContext]);

  // Load natural dimensions of input image
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      setImageMeta({ width: img.naturalWidth, height: img.naturalHeight });
      imageElementRef.current = img;
      setZoom(1);
      setPan({ x: 0, y: 0 });
    };
  }, [imageSrc]);

  // Current active ratio
  const activePreset = ASPECT_RATIO_PRESETS.find((p) => p.id === selectedRatioId) || ASPECT_RATIO_PRESETS[0];
  const activeRatio: number =
    activePreset.ratio !== null
      ? activePreset.ratio
      : imageMeta
      ? imageMeta.width / imageMeta.height
      : 16 / 9;

  // Viewport / Crop Box sizing (large, full width modal)
  const VIEWPORT_MAX_WIDTH = 840;
  const VIEWPORT_MAX_HEIGHT = 460;

  let cropBoxWidth = VIEWPORT_MAX_WIDTH;
  let cropBoxHeight = VIEWPORT_MAX_WIDTH / activeRatio;

  if (cropBoxHeight > VIEWPORT_MAX_HEIGHT) {
    cropBoxHeight = VIEWPORT_MAX_HEIGHT;
    cropBoxWidth = VIEWPORT_MAX_HEIGHT * activeRatio;
  }

  // Calculate base scale to cover crop box
  const naturalW = imageMeta?.width || 1;
  const naturalH = imageMeta?.height || 1;
  const baseScale = Math.max(cropBoxWidth / naturalW, cropBoxHeight / naturalH);
  const currentScale = baseScale * zoom;

  const currentDisplayW = naturalW * currentScale;
  const currentDisplayH = naturalH * currentScale;

  // Max pan bounds so image doesn't expose empty space inside the crop box
  const maxPanX = Math.max(0, (currentDisplayW - cropBoxWidth) / 2);
  const maxPanY = Math.max(0, (currentDisplayH - cropBoxHeight) / 2);

  // Clamp pan within bounds
  const clampedPanX = Math.max(-maxPanX, Math.min(maxPanX, pan.x));
  const clampedPanY = Math.max(-maxPanY, Math.min(maxPanY, pan.y));

  // Mouse / Touch handlers for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - clampedPanX, y: e.clientY - clampedPanY });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPan({
        x: Math.max(-maxPanX, Math.min(maxPanX, newX)),
        y: Math.max(-maxPanY, Math.min(maxPanY, newY)),
      });
    },
    [isDragging, dragStart, maxPanX, maxPanY]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile/tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - clampedPanX,
        y: e.touches[0].clientY - clampedPanY,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const newX = e.touches[0].clientX - dragStart.x;
    const newY = e.touches[0].clientY - dragStart.y;
    setPan({
      x: Math.max(-maxPanX, Math.min(maxPanX, newX)),
      y: Math.max(-maxPanY, Math.min(maxPanY, newY)),
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const resetAdjustments = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Apply crop & burn TinyAdds logo into top-left corner
  const handleApplyCrop = async () => {
    const img = imageElementRef.current;
    if (!img || !imageMeta) return;

    setIsProcessing(true);

    try {
      const targetWidth = Math.min(1600, Math.max(900, Math.round(naturalW)));
      const targetHeight = Math.round(targetWidth / activeRatio);

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Unable to create canvas context");
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const visibleW = cropBoxWidth / currentScale;
      const visibleH = cropBoxHeight / currentScale;

      const sourceX = (naturalW - visibleW) / 2 - clampedPanX / currentScale;
      const sourceY = (naturalH - visibleH) / 2 - clampedPanY / currentScale;

      ctx.drawImage(img, sourceX, sourceY, visibleW, visibleH, 0, 0, targetWidth, targetHeight);

      // Draw TinyAdds Logo in Top-Left Corner
      const logoImg = logoImageRef.current;
      if (logoImg && logoImg.naturalWidth) {
        const logoW = Math.max(120, Math.min(260, Math.round(targetWidth * 0.17)));
        const logoH = Math.round(logoW * (logoImg.naturalHeight / logoImg.naturalWidth));

        const marginX = Math.max(16, Math.round(targetWidth * 0.035));
        const marginY = Math.max(16, Math.round(targetHeight * 0.035));

        const padX = Math.round(logoW * 0.09);
        const padY = Math.round(logoH * 0.14);
        const radius = Math.round(logoH * 0.24);

        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.22)";
        ctx.shadowBlur = Math.round(logoH * 0.28);
        ctx.shadowOffsetY = Math.round(logoH * 0.08);

        ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(marginX - padX, marginY - padY, logoW + padX * 2, logoH + padY * 2, radius);
        } else {
          ctx.rect(marginX - padX, marginY - padY, logoW + padX * 2, logoH + padY * 2);
        }
        ctx.fill();

        ctx.shadowColor = "transparent";
        ctx.strokeStyle = "rgba(212, 87, 43, 0.25)";
        ctx.lineWidth = Math.max(1, Math.round(logoW * 0.008));
        ctx.stroke();

        ctx.drawImage(logoImg, marginX, marginY, logoW, logoH);
        ctx.restore();
      }

      const finalDataUrl = canvas.toDataURL("image/jpeg", 0.92);
      onApply(finalDataUrl);
    } catch (err) {
      console.error("Error cropping image:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="lb-cropper-backdrop">
      <div className="lb-cropper-modal" role="dialog" aria-modal="true" aria-labelledby="cropper-title">
        {/* Header - Clean & Minimal */}
        <div className="lb-cropper-header">
          <h5 id="cropper-title" className="lb-cropper-title m-0">
            <i className="bi bi-crop me-2 text-primary" />
            Adjust Dimensions
          </h5>
          <button type="button" className="lb-cropper-close-btn" onClick={onCancel} aria-label="Close dialog">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* Viewport Area */}
        <div
          className="lb-cropper-viewport-area"
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Active Crop Box */}
          <div
            className={`lb-cropper-box ${isDragging ? "is-dragging" : ""}`}
            style={{
              width: cropBoxWidth,
              height: cropBoxHeight,
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {imageSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt="Crop preview"
                className="lb-cropper-img"
                draggable={false}
                style={{
                  width: currentDisplayW,
                  height: currentDisplayH,
                  transform: `translate(${clampedPanX}px, ${clampedPanY}px)`,
                }}
              />
            )}

            {/* Rule of Thirds Grid Guidelines */}
            <div className="lb-cropper-grid">
              <div className="lb-grid-line lb-grid-h-1" />
              <div className="lb-grid-line lb-grid-h-2" />
              <div className="lb-grid-line lb-grid-v-1" />
              <div className="lb-grid-line lb-grid-v-2" />
            </div>

            {/* Real-time Top-Left Watermark Badge Preview */}
            <div className="lb-cropper-logo-badge">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ads/tinyadds-watermark-logo.png" alt="TinyAdds Logo watermark" />
            </div>
          </div>
        </div>

        {/* Controls Toolbar - Clean & Essential Only */}
        <div className="lb-cropper-toolbar">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            {/* Aspect Ratio Presets */}
            <div className="lb-cropper-presets">
              {ASPECT_RATIO_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`lb-cropper-preset-btn ${selectedRatioId === preset.id ? "active" : ""}`}
                  onClick={() => {
                    setSelectedRatioId(preset.id);
                    setPan({ x: 0, y: 0 });
                    setZoom(1);
                  }}
                >
                  <i className={`bi ${preset.icon} me-1`} />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>

            {/* Zoom Controls & Reset */}
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary lb-zoom-step-btn"
                onClick={() => setZoom((z) => Math.max(1, +(z - 0.1).toFixed(2)))}
                disabled={zoom <= 1}
                aria-label="Zoom out"
              >
                <i className="bi bi-dash" />
              </button>
              <input
                type="range"
                className="form-range lb-cropper-slider"
                style={{ width: "110px" }}
                min="1"
                max="3"
                step="0.02"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
              />
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary lb-zoom-step-btn"
                onClick={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)))}
                disabled={zoom >= 3}
                aria-label="Zoom in"
              >
                <i className="bi bi-plus" />
              </button>
              <span className="lb-zoom-val text-muted ms-1">{Math.round(zoom * 100)}%</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary ms-2"
                onClick={resetAdjustments}
                title="Reset Pan & Zoom"
              >
                <i className="bi bi-arrow-counterclockwise" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="lb-cropper-footer">
          <button type="button" className="btn btn-outline-secondary px-4" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn lb-btn-primary px-4 d-inline-flex align-items-center gap-2"
            onClick={handleApplyCrop}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                Processing...
              </>
            ) : (
              <>
                <i className="bi bi-check2" />
                Apply
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
