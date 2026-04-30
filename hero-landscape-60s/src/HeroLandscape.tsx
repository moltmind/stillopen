import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { HookScene } from "./scenes/HookScene";
import { PivotScene } from "./scenes/PivotScene";
import { BookingScene } from "./scenes/BookingScene";
import { ProofScene } from "./scenes/ProofScene";
import { OfferScene } from "./scenes/OfferScene";
import { CtaScene } from "./scenes/CtaScene";

/**
 * StillOpen Homepage Hero — 60s landscape · 1920x1080 · 30fps · 1800 frames
 *
 * Plumber-as-hero arc:
 *   0:00–0:08  HOOK    (frames    0–240)  Plumber on couch at 2:14 AM, lets call go to voicemail
 *   0:08–0:18  PIVOT   (frames  240–540)  Browser + StillOpen widget catches the call
 *   0:18–0:32  BOOKING (frames  540–960)  Slot picked, $99 deposit, calendar locked
 *   0:32–0:44  PROOF   (frames  960–1320) Morning, three notifications, Stripe $297, calendar full
 *   0:44–0:54  OFFER   (frames 1320–1620) Pricing card, "Custom-trained on your business" hero
 *   0:54–1:00  CTA     (frames 1620–1800) DoorAjarLogo, tagline, stillopen.ai
 *
 * Audio layer (final mix — Cole's clone voice on all six segments):
 *   - Music bed: full duration, 0.14 volume, ducks to 0.07 during VO with 12-frame ramps
 *   - VO 1 hook    f60   (4.00s)
 *   - VO 2 pivot   f270  (5.75s)
 *   - VO 3 booking f600  (4.31s)
 *   - VO 4 proof   f1020 (8.31s)
 *   - VO 5 offer   f1380 (5.43s)
 *   - VO 6 cta     f1620 (5.62s) — moved earlier from f1680 so the read fits before the cut
 *   - SFX: percussive accents on every major beat
 */

// VO time ranges in composition frames, used by the music-bed ducking function.
const VO_RANGES: [number, number][] = [
  [60, 180],     // VO 1 hook
  [270, 443],    // VO 2 pivot
  [600, 730],    // VO 3 booking
  [1020, 1270],  // VO 4 proof
  [1380, 1543],  // VO 5 offer
  [1620, 1789],  // VO 6 cta
];

const musicVolume = (f: number) => {
  // Tuned for bed_loop_60s.wav: real Pixabay cinematic track, loudness-normalized
  // to -16 LUFS, peak -1.5 dB. Properly mastered so values can be subtle.
  const baseVol = 0.22;
  const duckedVol = 0.08;
  const fade = 12;
  for (const [start, end] of VO_RANGES) {
    if (f >= start - fade && f <= end + fade) {
      if (f < start) return baseVol - (baseVol - duckedVol) * ((f - (start - fade)) / fade);
      if (f > end) return duckedVol + (baseVol - duckedVol) * ((f - end) / fade);
      return duckedVol;
    }
  }
  return baseVol;
};
export const HeroLandscape: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#050506" }}>
      {/* ── SCENES ────────────────────────────────────────────────── */}
      <Sequence from={0} durationInFrames={240} name="Hook">
        <HookScene />
      </Sequence>

      <Sequence from={240} durationInFrames={300} name="Pivot">
        <PivotScene />
      </Sequence>

      <Sequence from={540} durationInFrames={420} name="Booking">
        <BookingScene />
      </Sequence>

      <Sequence from={960} durationInFrames={360} name="Proof">
        <ProofScene />
      </Sequence>

      <Sequence from={1320} durationInFrames={300} name="Offer">
        <OfferScene />
      </Sequence>

      <Sequence from={1620} durationInFrames={180} name="CTA">
        <CtaScene />
      </Sequence>

      {/* ── MUSIC BED ─────────────────────────────────────────────── */}
      {/* Cole-removed 2026-04-29. Voice + SFX only on the homepage cut. */}
      {/* <Audio src={staticFile("audio/bed_loop_60s.wav")} volume={musicVolume} /> */}

      {/* ── VOICE LAYER (Cole's clone D73ZEfJs3CetiSnT1UkG) ───────── */}

      {/* VO 1 — Hook: "It's 2 AM. Another emergency call just went to voicemail." */}
      <Sequence from={60} durationInFrames={120} layout="none">
        <Audio src={staticFile("audio/vo_01_hook.mp3")} volume={1.0} />
      </Sequence>

      {/* VO 2 — Pivot */}
      <Sequence from={270} durationInFrames={173} layout="none">
        <Audio src={staticFile("audio/vo_02_pivot.mp3")} volume={1.0} />
      </Sequence>

      {/* VO 3 — Booking: "It books the job. Takes the deposit. Locks it on your calendar." */}
      <Sequence from={600} durationInFrames={130} layout="none">
        <Audio src={staticFile("audio/vo_03_booking.mp3")} volume={1.0} />
      </Sequence>

      {/* VO 4 — Proof */}
      <Sequence from={1020} durationInFrames={250} layout="none">
        <Audio src={staticFile("audio/vo_04_proof.mp3")} volume={1.0} />
      </Sequence>

      {/* VO 5 — Offer: "Two ninety-seven to set up. Forty-seven a month. Custom-trained on your business." */}
      <Sequence from={1380} durationInFrames={163} layout="none">
        <Audio src={staticFile("audio/vo_05_offer.mp3")} volume={1.0} />
      </Sequence>

      {/* VO 6 — CTA: "Your sign says closed. StillOpen stays open. stillopen.ai." */}
      <Sequence from={1620} durationInFrames={169} layout="none">
        <Audio src={staticFile("audio/vo_06_cta.mp3")} volume={1.0} />
      </Sequence>

      {/* ── SFX LAYER ─────────────────────────────────────────────── */}

      {/* HOOK — phone vibrate buzz + voicemail beep + title slam */}
      <Sequence from={30} durationInFrames={45} layout="none">
        <Audio src={staticFile("audio/sfx_impact.wav")} volume={0.18} />
      </Sequence>
      <Sequence from={148} durationInFrames={20} layout="none">
        <Audio src={staticFile("audio/sfx_ding.wav")} volume={0.25} />
      </Sequence>
      <Sequence from={180} durationInFrames={30} layout="none">
        <Audio src={staticFile("audio/sfx_impact.wav")} volume={0.55} />
      </Sequence>

      {/* PIVOT — widget opens, customer types, AI replies */}
      <Sequence from={250} durationInFrames={30} layout="none">
        <Audio src={staticFile("audio/sfx_whoosh.wav")} volume={0.30} />
      </Sequence>
      <Sequence from={270} durationInFrames={20} layout="none">
        <Audio src={staticFile("audio/sfx_ding.wav")} volume={0.30} />
      </Sequence>
      <Sequence from={400} durationInFrames={20} layout="none">
        <Audio src={staticFile("audio/sfx_chime.wav")} volume={0.32} />
      </Sequence>

      {/* BOOKING — slot tap, Stripe ka-ching, confirmation, calendar snap */}
      <Sequence from={540} durationInFrames={30} layout="none">
        <Audio src={staticFile("audio/sfx_whoosh.wav")} volume={0.28} />
      </Sequence>
      <Sequence from={630} durationInFrames={20} layout="none">
        <Audio src={staticFile("audio/sfx_tap.wav")} volume={0.50} />
      </Sequence>
      <Sequence from={710} durationInFrames={30} layout="none">
        <Audio src={staticFile("audio/sfx_chime.wav")} volume={0.50} />
      </Sequence>
      <Sequence from={760} durationInFrames={25} layout="none">
        <Audio src={staticFile("audio/sfx_ding.wav")} volume={0.40} />
      </Sequence>
      <Sequence from={820} durationInFrames={20} layout="none">
        <Audio src={staticFile("audio/sfx_tap.wav")} volume={0.35} />
      </Sequence>

      {/* PROOF — three rising-tone booking pings + counter ticks */}
      <Sequence from={960} durationInFrames={30} layout="none">
        <Audio src={staticFile("audio/sfx_whoosh.wav")} volume={0.25} />
      </Sequence>
      <Sequence from={990} durationInFrames={20} layout="none">
        <Audio src={staticFile("audio/sfx_ding.wav")} volume={0.45} />
      </Sequence>
      <Sequence from={1032} durationInFrames={20} layout="none">
        <Audio src={staticFile("audio/sfx_ding.wav")} volume={0.45} />
      </Sequence>
      <Sequence from={1074} durationInFrames={20} layout="none">
        <Audio src={staticFile("audio/sfx_ding.wav")} volume={0.45} />
      </Sequence>
      <Sequence from={1140} durationInFrames={36} layout="none">
        <Audio src={staticFile("audio/sfx_tap.wav")} volume={0.18} />
      </Sequence>

      {/* OFFER — card whoosh, $297 impact, three checkmark taps */}
      <Sequence from={1320} durationInFrames={30} layout="none">
        <Audio src={staticFile("audio/sfx_whoosh.wav")} volume={0.40} />
      </Sequence>
      <Sequence from={1340} durationInFrames={30} layout="none">
        <Audio src={staticFile("audio/sfx_impact.wav")} volume={0.30} />
      </Sequence>
      <Sequence from={1410} durationInFrames={15} layout="none">
        <Audio src={staticFile("audio/sfx_tap.wav")} volume={0.35} />
      </Sequence>
      <Sequence from={1434} durationInFrames={15} layout="none">
        <Audio src={staticFile("audio/sfx_tap.wav")} volume={0.35} />
      </Sequence>
      <Sequence from={1458} durationInFrames={15} layout="none">
        <Audio src={staticFile("audio/sfx_tap.wav")} volume={0.35} />
      </Sequence>

      {/* CTA — door creak, cursor blip */}
      <Sequence from={1620} durationInFrames={45} layout="none">
        <Audio src={staticFile("audio/sfx_whoosh.wav")} volume={0.30} />
      </Sequence>
      <Sequence from={1660} durationInFrames={20} layout="none">
        <Audio src={staticFile("audio/sfx_chime.wav")} volume={0.30} />
      </Sequence>
    </AbsoluteFill>
  );
};
