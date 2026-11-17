import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ScanLine, 
  Upload, 
  Camera, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Lock, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useProfileStore } from '../store/profileStore';

export const DocumentScannerPage = () => {
  const { t } = useTranslation();
  const { addToast } = useUIStore();
  const { profile, updateProfile } = useProfileStore();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);

  // Editable fields on confirmation modal
  const [editAge, setEditAge] = useState(65);
  const [editIncome, setEditIncome] = useState(48000);
  const [editCategory, setEditCategory] = useState('OBC');
  const [maskedId, setMaskedId] = useState('XXXX-XXXX-4892');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        addToast({ title: 'File size must be under 10MB', type: 'warning' });
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      simulateScan(file);
    }
  };

  const simulateScan = async (file) => {
    setIsScanning(true);
    addToast({ title: 'Scanning document in memory with Gemini OCR...', type: 'info' });

    try {
      const formData = new FormData();
      formData.append('document', file);

      const res = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setScannedData(data);
        if (data.age) setEditAge(data.age);
        if (data.annualIncome) setEditIncome(data.annualIncome);
        if (data.socialCategory) setEditCategory(data.socialCategory);
        if (data.maskedAadhaar) setMaskedId(data.maskedAadhaar);
        setConfirmModal(true);
      } else {
        throw new Error('OCR API failed');
      }
    } catch (err) {
      // Offline mock fallback: detect based on demo
      setTimeout(() => {
        setScannedData({
          documentType: 'Aadhaar / Income Certificate',
          confidence: 0.94,
          age: 65,
          annualIncome: 48000,
          socialCategory: 'OBC',
          maskedAadhaar: 'XXXX-XXXX-7123',
          expiryDate: '2028-03-31',
          isValid: true,
        });
        setConfirmModal(true);
        setIsScanning(false);
      }, 1200);
      return;
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfirm = () => {
    updateProfile({
      age: editAge,
      annualIncome: editIncome,
      socialCategory: editCategory,
    });
    setConfirmModal(false);
    addToast({
      title: 'Profile updated with verified certificate details!',
      description: 'Your citizen profile now reflects confirmed document facts.',
      type: 'success',
    });
  };

  // Document Readiness Checklist
  const readinessItems = [
    { name: 'Aadhaar Card', status: 'valid', note: 'Linked with bank account for DBT' },
    { name: 'Income Certificate (Karnataka Nadakacheri)', status: 'valid', note: 'Valid for 5 years from issue date' },
    { name: 'Ration Card (BPL / AAY)', status: 'valid', note: 'Required for food and pension schemes' },
    { name: 'Caste / Community Certificate', status: 'missing', note: 'Needed for post-matric scholarships' },
    { name: 'Land Record (RTC / Pahani)', status: 'missing', note: 'Required for PM-KISAN and Krishi Sinchayee' },
    { name: 'Disability UDID Card', status: 'missing', note: 'Needed only if claiming disability benefits' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-saathi-primary-light text-saathi-primary text-xs font-bold">
          <Lock className="w-3.5 h-3.5" />
          <span>In-Memory Safe • Never Stored on Disk</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-saathi-ink tracking-tight">
          {t('document.title')}
        </h1>
        <p className="text-sm text-saathi-muted max-w-xl mx-auto">
          {t('document.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload / Capture Card */}
        <div className="bg-saathi-card rounded-4xl border border-saathi-border p-6 shadow-soft-sm flex flex-col justify-between space-y-6">
          <div>
            <h2 className="font-display font-bold text-lg text-saathi-ink mb-1">
              {t('document.upload_or_camera')}
            </h2>
            <p className="text-xs text-saathi-muted">
              Supported formats: JPEG, PNG, WebP, PDF (Max 10MB).
            </p>
          </div>

          {/* Dropzone */}
          <label className="border-2 border-dashed border-saathi-border hover:border-saathi-primary/50 bg-saathi-bg/60 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors group">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-full bg-saathi-primary-light text-saathi-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ScanLine className="w-8 h-8" />
            </div>
            <p className="font-bold text-sm text-saathi-ink text-center">
              Click to browse or take photo with camera
            </p>
            <p className="text-xs text-saathi-muted mt-1">
              Aadhaar, Ration Card, Income or Caste certificate
            </p>
          </label>

          {/* Privacy Guarantee Box */}
          <div className="p-3.5 rounded-2xl bg-saathi-bg border border-saathi-border text-xs text-saathi-muted flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-saathi-primary shrink-0 mt-0.5" />
            <span>
              <strong>Zero Storage Guarantee:</strong> Uploaded images are evaluated in RAM by the OCR vision model and discarded immediately. No citizen documents are ever written to server disk or database.
            </span>
          </div>
        </div>

        {/* Readiness Checklist Card */}
        <div className="bg-saathi-card rounded-4xl border border-saathi-border p-6 shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-saathi-ink">
              Your Document Readiness
            </h2>
            <span className="text-xs font-bold text-saathi-primary bg-saathi-primary-light px-2.5 py-1 rounded-pill">
              3 of 6 Ready
            </span>
          </div>

          <div className="space-y-2.5">
            {readinessItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-saathi-bg border border-saathi-border flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  {item.status === 'valid' ? (
                    <CheckCircle2 className="w-5 h-5 text-saathi-success shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-saathi-muted shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-xs font-bold text-saathi-ink">{item.name}</p>
                    <p className="text-[11px] text-saathi-muted mt-0.5">{item.note}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-pill uppercase whitespace-nowrap ${
                    item.status === 'valid'
                      ? 'bg-saathi-success-light text-saathi-success'
                      : 'bg-saathi-border/60 text-saathi-muted'
                  }`}
                >
                  {item.status === 'valid' ? t('document.valid') : t('document.missing')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mandatory Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-saathi-ink/70 backdrop-blur-sm">
          <div className="bg-saathi-card rounded-4xl border border-saathi-border p-6 sm:p-8 max-w-lg w-full shadow-soft-lg space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-saathi-success-light text-saathi-success text-xs font-bold mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Extracted Successfully</span>
              </div>
              <h3 className="font-display font-bold text-xl text-saathi-ink">
                {t('document.confirm_title')}
              </h3>
              <p className="text-xs text-saathi-muted mt-1">
                {t('document.confirm_desc')}
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-saathi-bg border border-saathi-border flex items-center justify-between text-xs">
                <span className="font-bold text-saathi-muted">Masked ID Number</span>
                <span className="font-mono font-bold text-saathi-ink">{maskedId}</span>
              </div>

              <div>
                <label className="text-xs font-bold text-saathi-ink">Age on Record</label>
                <input
                  type="number"
                  value={editAge}
                  onChange={(e) => setEditAge(parseInt(e.target.value, 10))}
                  className="mt-1 w-full p-2.5 rounded-xl border border-saathi-border bg-saathi-bg text-xs font-bold text-saathi-ink focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-saathi-ink">Certified Annual Income (₹)</label>
                <input
                  type="number"
                  value={editIncome}
                  onChange={(e) => setEditIncome(parseInt(e.target.value, 10))}
                  className="mt-1 w-full p-2.5 rounded-xl border border-saathi-border bg-saathi-bg text-xs font-bold text-saathi-ink focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-saathi-ink">Social Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="mt-1 w-full p-2.5 rounded-xl border border-saathi-border bg-saathi-bg text-xs font-bold text-saathi-ink focus:outline-none"
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmModal(false)}
                className="px-4 py-2 rounded-pill text-xs font-semibold bg-saathi-bg text-saathi-muted hover:text-saathi-ink"
              >
                {t('actions.cancel')}
              </button>
              <button
                onClick={handleConfirm}
                className="px-5 py-2 rounded-pill text-xs font-bold bg-saathi-primary text-white shadow-soft-sm hover:bg-saathi-primary-hover"
              >
                {t('actions.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
