"use client";

import { useActionState, useState } from "react";
import { logWeight, uploadPhoto } from "@/lib/progress-actions";
import type { LivePhoto } from "@/lib/progress-queries";
import type { Dict } from "@/lib/locale";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  type MeasurementPoint,
  type ProgressPhoto,
  type StrengthPoint,
  type WeightPoint,
} from "@/data/userProgress";

const TABS = ["weight", "strength", "measurements", "photos"] as const;

const chartBox = "h-[280px]";
const tipStyle = {
  background: "#0b1220",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
};

export default function UserProgress({
  weight = [],
  strength = [],
  measurements = [],
  photos = [],
  photosLive = [],
  live = false,
  t,
}: {
  weight?: WeightPoint[];
  strength?: StrengthPoint[];
  measurements?: MeasurementPoint[];
  photos?: ProgressPhoto[];
  photosLive?: LivePhoto[];
  live?: boolean;
  t: Dict;
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("weight");
  const tabLabel = (tb: (typeof TABS)[number]) =>
    tb === "weight" ? t.progress.tabWeight : tb === "strength" ? t.progress.tabStrength : tb === "measurements" ? t.progress.tabMeasure : t.progress.tabPhotos;

  return (
    <div>
      <div className="grid max-w-lg grid-cols-4 gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
        {TABS.map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={`rounded-full py-2 text-xs font-semibold capitalize transition-colors sm:text-sm ${
              tab === tb ? "bg-brand-500 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            {tabLabel(tb)}
          </button>
        ))}
      </div>

      {tab === "weight" && (
        <>
          {live && <WeightLogForm t={t} />}
          <div className={`mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 ${chartBox}`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weight} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" />
              <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} domain={["dataMin - 5", "dataMax + 5"]} />
              <Tooltip contentStyle={tipStyle} />
              <Line type="monotone" dataKey="weight" stroke="#0080ff" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          </div>
        </>
      )}

      {tab === "strength" && (
        <div className={`mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 ${chartBox}`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={strength} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" />
              <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} domain={["dataMin - 20", "dataMax + 20"]} />
              <Tooltip contentStyle={tipStyle} />
              <Line type="monotone" dataKey="squat" stroke="#0080ff" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="bench" stroke="#22c55e" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="deadlift" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {tab === "measurements" && (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
          <table className="w-full min-w-[480px] text-start text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="px-5 py-3 font-semibold">{t.progress.weekCol}</th>
                <th className="px-5 py-3 font-semibold">{t.progress.chestCol}</th>
                <th className="px-5 py-3 font-semibold">{t.progress.waistCol}</th>
                <th className="px-5 py-3 font-semibold">{t.progress.armsCol}</th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((m) => (
                <tr key={m.date} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3 font-semibold">{m.date}</td>
                  <td className="px-5 py-3">{m.chest}</td>
                  <td className="px-5 py-3">{m.waist}</td>
                  <td className="px-5 py-3">{m.arms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "photos" && (
        <>
          {live && <PhotoUploadForm t={t} />}
          {live ? (
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {photosLive.length === 0 && (
                <p className="col-span-full rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-400">
                  {t.progress.noPhotos}
                </p>
              )}
              {photosLive.map((p) => (
                <div key={p.url} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={p.name} className="aspect-[2/3] w-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {photos.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-400">
              {t.progress.noPhotos}
            </p>
          ) : (
            photos.map((p) => (
            <div key={p.week} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
              <p className="text-sm font-bold">{p.week}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.front} alt={`${p.week} front`} className="rounded-xl" loading="lazy" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.side} alt={`${p.week} side`} className="rounded-xl" loading="lazy" />
              </div>
            </div>
            ))
          )}
        </div>
          )}
        </>
      )}
    </div>
  );
}

function WeightLogForm({ t }: { t: Dict }) {
  const [state, action, pending] = useActionState(logWeight, {});

  return (
    <form
      action={action}
      className="mt-5 flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label htmlFor="weight" className="mb-1.5 block text-sm font-medium">
          {t.progress.logWeightLabel}
        </label>
        <input
          id="weight"
          name="weight"
          type="number"
          step="0.1"
          min="1"
          required
          placeholder="80.5"
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-slate-500 focus:border-brand-500"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-brand-400 disabled:opacity-60"
      >
        {pending ? t.common.saving : t.progress.logWeightBtn}
      </button>
      {state?.error && (
        <p role="alert" className="text-xs text-red-400 sm:self-center">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="text-xs text-green-400 sm:self-center">
          {t.common.saved}
        </p>
      )}
    </form>
  );
}

function PhotoUploadForm({ t }: { t: Dict }) {
  const [state, action, pending] = useActionState(uploadPhoto, {});

  return (
    <form
      action={action}
      className="mt-5 flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label htmlFor="photo" className="mb-1.5 block text-sm font-medium">
          {t.progress.photoLabel}
        </label>
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="w-full text-sm text-slate-300 file:me-3 file:rounded-full file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-brand-400"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-brand-400 disabled:opacity-60"
      >
        {pending ? t.coach.uploading : t.coach.uploadBtn}
      </button>
      {state?.error && (
        <p role="alert" className="text-xs text-red-400 sm:self-center">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="text-xs text-green-400 sm:self-center">
          {t.coach.uploaded}
        </p>
      )}
    </form>
  );
}
