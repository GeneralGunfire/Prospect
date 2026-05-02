import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Camera, ChevronLeft, CheckCircle2, AlertCircle,
  Loader2, Upload, X, ChevronDown,
} from 'lucide-react';
import { withAuth, type AuthedProps } from '../lib/withAuth';
import AppHeader from '../components/AppHeader';
import { createPothole, uploadPotholeImage, type PotholeSeverity } from '../services/potholeService';
import { SA_PROVINCES, getCities, getSuburbs } from '../data/saLocations';

const SEVERITY_META = {
  low:    { label: 'Low',    desc: 'Minor surface crack',    color: 'border-blue-400 bg-blue-50 text-blue-700', ring: 'ring-blue-400' },
  medium: { label: 'Medium', desc: 'Noticeable depression',  color: 'border-amber-400 bg-amber-50 text-amber-700',       ring: 'ring-amber-400' },
  high:   { label: 'High',   desc: 'Large / dangerous hole', color: 'border-red-400 bg-red-50 text-red-700',             ring: 'ring-red-400' },
} as const;

function SelectField({
  label, value, onChange, options, placeholder, required, disabled,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder: string; required?: boolean; disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full h-11 pl-4 pr-10 text-sm border rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-colors ${
            disabled
              ? 'border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50'
              : 'border-slate-200 text-slate-800 cursor-pointer hover:border-slate-300'
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${disabled ? 'text-slate-300' : 'text-slate-400'}`} />
      </div>
    </div>
  );
}

interface FlagPotholePageProps extends AuthedProps {}

function FlagPotholePageComponent({ user, onNavigate }: FlagPotholePageProps) {
  const [province, setProvince]   = useState('');
  const [city, setCity]           = useState('');
  const [suburb, setSuburb]       = useState('');
  const [street, setStreet]       = useState('');
  const [severity, setSeverity]   = useState<PotholeSeverity | ''>('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const cities  = province ? getCities(province)   : [];
  const suburbs = city     ? getSuburbs(province, city) : [];

  function handleProvinceChange(v: string) {
    setProvince(v);
    setCity('');
    setSuburb('');
  }

  function handleCityChange(v: string) {
    setCity(v);
    setSuburb('');
  }

  // Build a human-readable address from the selections
  const builtAddress = [street.trim(), suburb, city, province].filter(Boolean).join(', ');

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB.'); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!province) return setError('Please select a province.');
    if (!city)     return setError('Please select a city.');
    if (!severity) return setError('Please select a severity level.');

    setSubmitting(true);
    try {
      const tempId = `tmp-${Date.now()}`;
      let imageUrl: string | undefined;

      if (imageFile) {
        const { url, error: uploadErr } = await uploadPotholeImage(imageFile, user.id, tempId);
        if (uploadErr) {
          setError(`Image upload failed: ${uploadErr}`);
          setSubmitting(false);
          return;
        }
        imageUrl = url ?? undefined;
      }

      const result = await createPothole({
        userId:      user.id,
        latitude:    0,
        longitude:   0,
        address:     builtAddress,
        streetName:  street.trim() || undefined,
        province,
        municipality: city,
        description: description.trim() || undefined,
        imageUrl,
        severity:    severity as PotholeSeverity,
      });

      if (!result.success) {
        setError(result.error ?? 'Failed to submit. Please try again.');
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => onNavigate('pothole-map'), 2500);
    } catch (err) {
      setError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-10 text-center shadow-xl max-w-sm w-full"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Report Submitted!</h2>
          <p className="text-slate-500 text-sm">
            Thank you! Your report has been submitted. Redirecting to the map…
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader currentPage="flag-pothole" user={user} onNavigate={onNavigate} mode="community" />

      <div className="max-w-2xl mx-auto px-4 pt-20 pb-24">
        <button
          onClick={() => onNavigate('pothole-map')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Map
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-slate-900 mb-1">Report a Pothole</h1>
            <p className="text-slate-500 text-sm">
              Help improve SA roads by reporting potholes in your area.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ── Location cascade ── */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-4 border border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</p>

              {/* Province */}
              <SelectField
                label="Province"
                value={province}
                onChange={handleProvinceChange}
                options={SA_PROVINCES}
                placeholder="Select province…"
                required
              />

              {/* City */}
              <SelectField
                label="City / Municipality"
                value={city}
                onChange={handleCityChange}
                options={cities}
                placeholder={province ? 'Select city…' : 'Select province first'}
                required
                disabled={!province}
              />

              {/* Suburb */}
              <SelectField
                label="Suburb"
                value={suburb}
                onChange={setSuburb}
                options={suburbs}
                placeholder={city ? 'Select suburb…' : 'Select city first'}
                disabled={!city}
              />

              {/* Street */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Street Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Main Road, Jan Smuts Ave"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full h-11 px-4 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 placeholder:text-slate-400"
                />
              </div>

              {/* Address preview */}
              {builtAddress && (
                <div className="flex items-start gap-2 text-xs text-slate-500 bg-white rounded-xl px-3 py-2.5 border border-slate-200">
                  <span className="text-slate-400 shrink-0 mt-0.5">📍</span>
                  <span>{builtAddress}</span>
                </div>
              )}
            </div>

            {/* ── Severity ── */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Severity <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(Object.entries(SEVERITY_META) as [PotholeSeverity, typeof SEVERITY_META[PotholeSeverity]][]).map(([s, meta]) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeverity(s)}
                    className={`py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all text-center ${
                      severity === s
                        ? `${meta.color} ring-2 ${meta.ring} ring-offset-1`
                        : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="font-bold">{meta.label}</div>
                    <div className="text-xs font-normal mt-0.5 opacity-70">{meta.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Description ── */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Description <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                placeholder="How big is it? How deep? Any hazard to vehicles?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 placeholder:text-slate-400 resize-none"
              />
            </div>

            {/* ── Photo ── */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Photo <span className="text-slate-400 font-normal">(recommended)</span>
              </label>
              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50"
                  >
                    <X className="w-4 h-4 text-slate-600" />
                  </button>
                  <div className="px-4 py-2 bg-slate-50 text-xs text-slate-500">
                    {imageFile?.name} · {((imageFile?.size ?? 0) / 1024).toFixed(0)} KB
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 w-full h-32 border-2 border-dashed border-slate-300 rounded-2xl hover:border-blue-400 hover:bg-blue-50/30 transition-colors text-slate-400"
                >
                  <Upload className="w-6 h-6" />
                  <span className="text-sm font-medium">Click to upload photo</span>
                  <span className="text-xs">JPG or PNG · max 5MB</span>
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleImageChange}
                capture="environment"
              />
            </div>

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-2xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                : <><Camera className="w-4 h-4" /> Report Pothole</>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export const FlagPotholePage = withAuth(FlagPotholePageComponent);
export default FlagPotholePage;
