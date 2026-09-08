"use client";

import { useActionState } from "react";
import { SPECIALTIES } from "@/lib/coach-data";
import {
  saveCoachProfile,
  type MyCoachProfile,
} from "@/lib/coaches";

const input =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm outline-none placeholder:text-slate-500 focus:border-brand-500";
const label = "mb-1.5 block text-sm font-medium";

export default function CoachProfileForm({
  initial,
}: {
  initial: MyCoachProfile;
}) {
  const [state, action, pending] = useActionState(saveCoachProfile, {});

  return (
    <form
      action={action}
      className="max-w-2xl space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
    >
      <div>
        <label htmlFor="displayName" className={label}>
          Display name
        </label>
        <input
          id="displayName"
          name="displayName"
          defaultValue={initial.displayName}
          required
          maxLength={80}
          placeholder="Coach Alex"
          className={input}
        />
      </div>

      <div>
        <label htmlFor="bio" className={label}>
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          defaultValue={initial.bio}
          rows={4}
          maxLength={1000}
          placeholder="Who you coach and how you work…"
          className={input}
        />
      </div>

      <div>
        <span className={label}>Specialties</span>
        <div className="flex flex-wrap gap-2">
          {SPECIALTIES.map((s) => (
            <label
              key={s}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm has-checked:border-brand-500 has-checked:bg-brand-500/15"
            >
              <input
                type="checkbox"
                name="specialties"
                value={s}
                defaultChecked={initial.specialties.includes(s)}
                className="accent-brand-500"
              />
              {s}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="specialtiesOther" className={label}>
          Other specialties (free text)
        </label>
        <input
          id="specialtiesOther"
          name="specialtiesOther"
          defaultValue={initial.specialtiesOther}
          maxLength={200}
          placeholder="e.g. Postnatal, kettlebell sport…"
          className={input}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="years" className={label}>
            Years experience
          </label>
          <input
            id="years"
            name="years"
            type="number"
            min={0}
            max={60}
            defaultValue={initial.years}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="whatsapp" className={label}>
            WhatsApp number
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            defaultValue={initial.whatsapp}
            placeholder="15550001111 (country code + number)"
            className={input}
          />
        </div>
      </div>

      <div>
        <label htmlFor="certifications" className={label}>
          Certifications (one per line)
        </label>
        <textarea
          id="certifications"
          name="certifications"
          defaultValue={initial.certifications}
          rows={3}
          placeholder={"NASM-CPT\nFirst Aid"}
          className={input}
        />
      </div>

      <label className="flex cursor-pointer items-center gap-3 text-sm">
        <input
          type="checkbox"
          name="freeConsult"
          defaultChecked={initial.freeConsult}
          className="h-4 w-4 accent-brand-500"
        />
        Offer free consults (off = paid sessions only)
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/30 transition-all hover:bg-brand-400 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save profile"}
      </button>
      {state?.error && (
        <p role="alert" className="text-sm text-red-400">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="text-sm text-green-400">
          Saved.
        </p>
      )}
    </form>
  );
}
