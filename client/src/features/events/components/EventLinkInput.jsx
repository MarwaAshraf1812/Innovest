import React, { useState, useId } from 'react'
import { Link2, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react'

/**
 * EventLinkInput
 *
 * Underline-style URL input field that validates the URL on blur,
 * shows a live status indicator, and lets the user set an optional
 * human-readable label for the link.
 *
 * Props:
 *   label        {string}   – field group label, default "External Link"
 *   urlValue     {string}
 *   labelValue   {string}   – the display label for the link
 *   onUrlChange  {Function}
 *   onLabelChange {Function}
 *   error        {string|null}
 *   required     {boolean}
 */
export default function EventLinkInput({
  label       = 'External Link',
  urlValue    = '',
  labelValue  = '',
  onUrlChange,
  onLabelChange,
  error       = null,
  required    = false,
}) {
  const uid         = useId()
  const urlId       = `${uid}-url`
  const labelId     = `${uid}-label`
  const [touched, setTouched] = useState(false)
  const [focused, setFocused] = useState(false)

  // ── Validation ─────────────────────────────────────────────────────────────
  const isValidUrl = (v) => {
    if (!v) return null // neutral — not yet typed
    try {
      const u = new URL(v.startsWith('http') ? v : `https://${v}`)
      return u.protocol === 'http:' || u.protocol === 'https:'
    } catch {
      return false
    }
  }

  const valid       = isValidUrl(urlValue)
  const showError   = touched && valid === false
  const showSuccess = valid === true && urlValue.length > 0

  // ── Normalise on blur (prepend https:// if missing) ──────────────────────
  const handleBlur = () => {
    setTouched(true)
    setFocused(false)
    if (urlValue && !urlValue.startsWith('http')) {
      onUrlChange?.({ target: { value: `https://${urlValue}` } })
    }
  }

  // Resolve favicon domain for preview
  let faviconSrc = null
  if (showSuccess) {
    try {
      const domain = new URL(urlValue).hostname
      faviconSrc = `https://www.google.com/s2/favicons?domain=${domain}&sz=16`
    } catch { /* ignore */ }
  }

  return (
    <div className="space-y-5">
      {/* Section label */}
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
        {label} {required && <span className="text-rose-500 not-uppercase">*</span>}
      </p>

      {/* Link label (optional display text) */}
      <div className="space-y-1">
        <label htmlFor={labelId} className="text-[11px] font-semibold text-slate-400">
          Link Label <span className="font-normal italic">(optional)</span>
        </label>
        <div className="relative flex items-center border-b border-slate-200 focus-within:border-slate-900 transition-colors duration-200 pb-2">
          <span className="text-slate-300 mr-3 shrink-0">
            <Link2 className="h-4 w-4" />
          </span>
          <input
            id={labelId}
            type="text"
            placeholder="e.g. Register Here, Zoom Link, Agenda PDF"
            value={labelValue}
            onChange={onLabelChange}
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-300 focus:outline-none"
          />
        </div>
      </div>

      {/* URL field */}
      <div className="space-y-1">
        <label htmlFor={urlId} className="text-[11px] font-semibold text-slate-400">
          URL
        </label>
        <div
          className={`relative flex items-center border-b pb-2 transition-colors duration-200 ${
            showError
              ? 'border-rose-400'
              : focused
              ? 'border-slate-900'
              : showSuccess
              ? 'border-emerald-400'
              : 'border-slate-200'
          }`}
        >
          {/* Leading icon or favicon */}
          <span className="text-slate-300 mr-3 shrink-0">
            {faviconSrc ? (
              <img
                src={faviconSrc}
                alt=""
                className="h-4 w-4 rounded-sm"
                onError={e => { e.target.style.display = 'none' }}
              />
            ) : (
              <ExternalLink className="h-4 w-4" />
            )}
          </span>

          <input
            id={urlId}
            type="url"
            placeholder="https://zoom.us/j/… or registration page"
            value={urlValue}
            onChange={onUrlChange}
            onFocus={() => setFocused(true)}
            onBlur={handleBlur}
            required={required}
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-300 focus:outline-none"
          />

          {/* Trailing status icon */}
          {touched && urlValue && (
            <span className="ml-2 shrink-0">
              {showSuccess
                ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                : <AlertCircle  className="h-3.5 w-3.5 text-rose-400"    />
              }
            </span>
          )}
        </div>

        {/* Validation feedback */}
        {showError && (
          <p className="text-[11px] font-medium text-rose-500 mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Please enter a valid URL (e.g. https://zoom.us/…)
          </p>
        )}
        {error && (
          <p className="text-[11px] font-medium text-rose-500 mt-1">{error}</p>
        )}
        {showSuccess && (
          <p className="text-[11px] font-medium text-emerald-600 mt-1 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Link looks good
          </p>
        )}
      </div>
    </div>
  )
}
