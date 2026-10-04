import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  RotateCw, 
  EyeOff, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck 
} from 'lucide-react';
import { 
  requestBrowserGeolocation, 
  saveRetailerLocation, 
  setRetailerLocationSharing, 
  formatLocationFreshness,
  GEOLOCATION_STATUS 
} from '../services/locationService';

/**
 * RetailerLocationCard Component
 * 
 * Provides an on-demand location management panel in the Retailer Portal:
 * - Shows current GPS status, accuracy, and freshness.
 * - Allows updating GPS location on demand.
 * - Allows pausing/stopping location sharing or resuming sharing.
 */
export default function RetailerLocationCard({ 
  retailerId, 
  initialLocation, 
  onLocationUpdate 
}) {
  const [location, setLocation] = useState(initialLocation || null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isTogglingShare, setIsTogglingShare] = useState(false);
  const [notice, setNotice] = useState(null); // { type: 'success' | 'error', message: string }

  const isShared = location?.sharingEnabled !== false && location?.latitude != null;
  const freshness = formatLocationFreshness(location?.updatedAt);

  const handleUpdateLocation = async () => {
    setIsUpdating(true);
    setNotice(null);

    try {
      const coords = await requestBrowserGeolocation({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });

      if (retailerId) {
        await saveRetailerLocation(retailerId, coords);
      }

      const updatedLoc = {
        ...coords,
        updatedAt: new Date().toISOString(),
        permissionGranted: true,
        sharingEnabled: true,
        source: 'device_gps'
      };

      setLocation(updatedLoc);
      if (onLocationUpdate) onLocationUpdate(updatedLoc);

      setNotice({
        type: 'success',
        message: `Store location updated successfully (accurate to ±${coords.accuracy}m).`
      });
      setTimeout(() => setNotice(null), 4000);
    } catch (err) {
      console.warn('[RetailerLocationCard] Location error:', err);
      setNotice({
        type: 'error',
        message: err.message || 'Failed to update store location.'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleSharing = async () => {
    if (!retailerId) return;
    setIsTogglingShare(true);
    setNotice(null);

    const nextState = !isShared;

    try {
      if (nextState && !location?.latitude) {
        // Needs initial coordinates first
        await handleUpdateLocation();
      } else {
        await setRetailerLocationSharing(retailerId, nextState);
        const updated = {
          ...location,
          sharingEnabled: nextState
        };
        setLocation(updated);
        if (onLocationUpdate) onLocationUpdate(updated);

        setNotice({
          type: 'success',
          message: nextState 
            ? 'Location sharing resumed. Nearby suppliers can now calculate direct delivery routes.' 
            : 'Location sharing stopped. Your precise coordinates are hidden from suppliers.'
        });
        setTimeout(() => setNotice(null), 4000);
      }
    } catch (err) {
      setNotice({
        type: 'error',
        message: err.message || 'Failed to update sharing preference.'
      });
    } finally {
      setIsTogglingShare(false);
    }
  };

  return (
    <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-4 relative overflow-hidden group">
      {/* Ambient hover light */}
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      {/* Header & Status Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/20 dark:border-white/10 relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm border border-white/20 ${
            isShared ? 'bg-gradient-to-br from-emerald-600 to-teal-700' : 'bg-slate-700'
          }`}>
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-tight text-slate-900 dark:text-white">
              Store Location & Proximity Sharing
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Used for pooled delivery grouping and real supplier driving routes.
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {isShared ? (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-semibold glass-pill text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Location Shared</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-semibold glass-pill text-slate-600 dark:text-slate-300">
              <EyeOff className="w-3.5 h-3.5" />
              <span>Location Not Shared</span>
            </span>
          )}
        </div>
      </div>

      {/* Notice Alert */}
      {notice && (
        <div className={`p-3 rounded-xl text-xs flex items-start space-x-2 backdrop-blur-md relative z-10 ${
          notice.type === 'success'
            ? 'glass-pill text-emerald-800 dark:text-emerald-300'
            : 'glass-pill text-rose-800 dark:text-rose-300 border-rose-500/30'
        }`}>
          {notice.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          )}
          <span>{notice.message}</span>
        </div>
      )}

      {/* Metrics Row */}
      {isShared ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs relative z-10">
          <div className="p-3 rounded-xl glass-pill">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">GPS Accuracy</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">
              ±{location?.accuracy || 15} meters
            </span>
          </div>

          <div className="p-3 rounded-xl glass-pill">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Last Verified</span>
            <span className={`font-bold ${freshness.isStale ? 'text-amber-500' : 'text-slate-800 dark:text-slate-100'}`}>
              {freshness.text}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 rounded-xl glass-pill">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">GPS Source</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">
              Device Sensor (Real)
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl glass-pill text-xs text-slate-500 dark:text-slate-400 relative z-10">
          Sharing your real store coordinates enables nearby suppliers to verify wholesale delivery eligibility and calculate direct route savings for your orders.
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-1 relative z-10">
        {isShared ? (
          <>
            <button
              type="button"
              disabled={isUpdating}
              onClick={handleUpdateLocation}
              className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 disabled:opacity-60 border border-white/20"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Acquiring GPS...</span>
                </>
              ) : (
                <>
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Update Location</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isTogglingShare}
              onClick={handleToggleSharing}
              className="py-2 px-3.5 rounded-xl border border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 font-semibold text-xs transition flex items-center space-x-1.5 disabled:opacity-60 shadow-sm"
            >
              {isTogglingShare ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>Stop Sharing Location</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={isUpdating}
            onClick={handleUpdateLocation}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 disabled:opacity-60 border border-white/20"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Requesting GPS...</span>
              </>
            ) : (
              <>
                <Navigation className="w-3.5 h-3.5" />
                <span>Share My Location</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
