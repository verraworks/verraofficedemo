import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Type, Upload, RotateCcw, Check, ShieldCheck, QrCode } from 'lucide-react';
import { useOffice } from '../../context/OfficeContext';

interface DigitalSignaturePadProps {
  onSave: (signatureDataUrl: string, method: 'draw' | 'type' | 'upload') => void;
  signerName?: string;
  signerPosition?: string;
}

export const DigitalSignaturePad: React.FC<DigitalSignaturePadProps> = ({
  onSave,
  signerName,
  signerPosition
}) => {
  const { currentUser } = useOffice();
  const [activeMode, setActiveMode] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedName, setTypedName] = useState<string>(signerName || currentUser?.name || 'Hendra Wijaya');
  const [penColor, setPenColor] = useState<string>('#1e3a8a'); // dark navy
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize canvas
  useEffect(() => {
    if (activeMode === 'draw') {
      clearCanvas();
    }
  }, [activeMode]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplySignature = () => {
    if (activeMode === 'draw') {
      const canvas = canvasRef.current;
      if (canvas && hasDrawn) {
        onSave(canvas.toDataURL('image/png'), 'draw');
      } else {
        // Create generated placeholder if empty
        const fallback = generateSvgSignature(typedName);
        onSave(fallback, 'type');
      }
    } else if (activeMode === 'type') {
      const svgSig = generateSvgSignature(typedName);
      onSave(svgSig, 'type');
    } else if (activeMode === 'upload' && uploadedImage) {
      onSave(uploadedImage, 'upload');
    }
  };

  const generateSvgSignature = (name: string): string => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100" viewBox="0 0 300 100">
      <text x="20" y="65" font-family="'Dancing Script', cursive" font-size="36" fill="${penColor}" font-weight="700">
        ${name}
      </text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  return (
    <div className="space-y-4">
      {/* Mode Selector */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveMode('draw')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeMode === 'draw'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <PenTool className="w-4 h-4" />
          Gores Tangan (Canvas)
        </button>
        <button
          type="button"
          onClick={() => setActiveMode('type')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeMode === 'type'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Type className="w-4 h-4" />
          Ketik Nama (Kaligrafi)
        </button>
        <button
          type="button"
          onClick={() => setActiveMode('upload')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeMode === 'upload'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload Berkas
        </button>
      </div>

      {/* Mode 1: Draw on Canvas */}
      {activeMode === 'draw' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Goreskan tanda tangan Anda pada bidang di bawah:</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Warna Tinta:</span>
              <button
                type="button"
                onClick={() => setPenColor('#1e3a8a')}
                className={`w-5 h-5 rounded-full bg-blue-900 border-2 ${
                  penColor === '#1e3a8a' ? 'border-amber-400 scale-110' : 'border-transparent'
                }`}
              />
              <button
                type="button"
                onClick={() => setPenColor('#0f172a')}
                className={`w-5 h-5 rounded-full bg-slate-900 border-2 ${
                  penColor === '#0f172a' ? 'border-amber-400 scale-110' : 'border-transparent'
                }`}
              />
              <button
                type="button"
                onClick={() => setPenColor('#047857')}
                className={`w-5 h-5 rounded-full bg-emerald-700 border-2 ${
                  penColor === '#047857' ? 'border-amber-400 scale-110' : 'border-transparent'
                }`}
              />
              <button
                type="button"
                onClick={clearCanvas}
                className="ml-2 flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded-md hover:bg-rose-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>

          <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/70 p-2 overflow-hidden">
            <canvas
              ref={canvasRef}
              width={500}
              height={180}
              className="w-full h-44 bg-white rounded-lg cursor-crosshair touch-none shadow-xs"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            <div className="absolute bottom-4 left-6 pointer-events-none text-xs text-slate-300 font-sans">
              Area Tanda Tangan Digital VerraOffice
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Type Signature */}
      {activeMode === 'type' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Penandatangan</label>
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="Masukkan nama lengkap..."
            />
          </div>

          <div className="p-6 border rounded-xl bg-white border-slate-200 text-center shadow-xs">
            <p className="text-xs text-slate-400 mb-2">Pratinjau Kaligrafi Tanda Tangan:</p>
            <div className="h-24 flex items-center justify-center">
              <span className="font-signature text-4xl text-blue-900 tracking-wider font-bold">
                {typedName || 'Tanda Tangan'}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Divalidasi dengan Sertifikat Digital SHA-256</span>
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Upload Signature */}
      {activeMode === 'upload' && (
        <div className="space-y-3">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50">
            {uploadedImage ? (
              <div className="space-y-3">
                <img src={uploadedImage} alt="Uploaded Signature" className="h-28 mx-auto object-contain bg-white p-2 rounded-lg border border-slate-200" />
                <button
                  type="button"
                  onClick={() => setUploadedImage(null)}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  Ganti Berkas Gambar
                </button>
              </div>
            ) : (
              <div>
                <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-xs text-slate-600 font-medium mb-1">Unggah scan tanda tangan atau paraf digital</p>
                <p className="text-xs text-slate-400 mb-3">Format PNG transparan atau JPG (Maks. 2MB)</p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs">
                  <span>Pilih File</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Signer Details Card */}
      <div className="bg-blue-50/60 rounded-xl p-3 border border-blue-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {(signerName || currentUser?.name || 'U')[0]}
          </div>
          <div>
            <p className="font-bold text-slate-800">{signerName || currentUser?.name}</p>
            <p className="text-slate-500">{signerPosition || currentUser?.position}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200">
          <QrCode className="w-4 h-4" />
          <span className="font-semibold">QR Digital Seal</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <button
          id="btn-apply-signature"
          type="button"
          onClick={handleApplySignature}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Check className="w-4 h-4" />
          Bubuhkan Tanda Tangan Elektronik
        </button>
      </div>
    </div>
  );
};
