"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { MediaEntry } from "@/lib/types";
import { TITLE_POS, GRID_TILE_URL, centerPan } from "@/lib/mat";
import Card from "./Card";
import styles from "./AdminCanvas.module.css";

type SaveState = "idle" | "saving" | "saved" | "error";

export default function AdminCanvas({
  initialEntries,
}: {
  initialEntries: MediaEntry[];
}) {
  const [entries, setEntries] = useState(initialEntries);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const pointerOrigin = useRef({ x: 0, y: 0 });
  const panOrigin = useRef({ x: 0, y: 0 });
  const cardOrigin = useRef({ x: 0, y: 0 });
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    setPan(centerPan());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startCardDrag(i: number, e: React.PointerEvent) {
    // Keep the background pan handler from also engaging.
    e.stopPropagation();
    setDragIndex(i);
    pointerOrigin.current = { x: e.clientX, y: e.clientY };
    cardOrigin.current = { x: entries[i].x, y: entries[i].y };
    (e.target as Element).setPointerCapture(e.pointerId);
  }

  function onPointerDown(e: React.PointerEvent) {
    setPanning(true);
    pointerOrigin.current = { x: e.clientX, y: e.clientY };
    panOrigin.current = pan;
    (e.target as Element).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    const dx = e.clientX - pointerOrigin.current.x;
    const dy = e.clientY - pointerOrigin.current.y;
    if (dragIndex !== null) {
      // The world isn't scaled in admin mode, so screen deltas map 1:1
      // onto mat coordinates.
      setEntries((prev) =>
        prev.map((entry, i) =>
          i === dragIndex
            ? { ...entry, x: cardOrigin.current.x + dx, y: cardOrigin.current.y + dy }
            : entry
        )
      );
    } else if (panning) {
      setPan({ x: panOrigin.current.x + dx, y: panOrigin.current.y + dy });
    }
  }

  async function onPointerUp() {
    setPanning(false);
    if (dragIndex === null) return;
    const entry = entries[dragIndex];
    setDragIndex(null);

    setSaveState("saving");
    if (savedTimer.current) clearTimeout(savedTimer.current);
    try {
      const res = await fetch("/api/position", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entry.id, x: entry.x, y: entry.y }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSaveState("saved");
      savedTimer.current = setTimeout(() => setSaveState("idle"), 1500);
    } catch {
      setSaveState("error");
    }
  }

  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  async function syncNow() {
    if (syncing) return;
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/sync", { method: "POST" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "sync failed");
      setSyncResult(
        `${body.inserted} new · ${body.updated} updated` +
          (body.directors ? ` · ${body.directors} directors added` : "")
      );
      // New/updated entries come from the server payload, so the simplest
      // correct refresh is a reload.
      if (body.inserted > 0 || body.updated > 0) {
        setTimeout(() => window.location.reload(), 900);
      }
    } catch (e) {
      setSyncResult(e instanceof Error ? e.message : "sync failed");
    } finally {
      setSyncing(false);
    }
  }

  const statusLabel = {
    idle: "",
    saving: "saving…",
    saved: "saved",
    error: "save failed — try again",
  }[saveState];

  return (
    <div
      className={`${styles.viewport} ${panning ? styles.dragging : ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div
        className={styles.world}
        style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
      >
        <div className={styles.grid} style={{ backgroundImage: GRID_TILE_URL }} />

        <div className={styles.title} style={{ left: TITLE_POS.x, top: TITLE_POS.y }}>
          <div className={styles.titleMain}>matt&#39;s thoughtscape</div>
          <div className={styles.titleSub}>
            entryway to my opinions about different forms of media
          </div>
        </div>

        {entries.map((entry, i) => (
          <Card
            key={entry.id}
            entry={entry}
            interactive={false}
            onPosterPointerDown={(e) => startCardDrag(i, e)}
          />
        ))}
      </div>

      <div className={styles.adminBadge}>
        ADMIN MODE — drag cards to arrange
        {statusLabel && <span className={styles.saveStatus}> · {statusLabel}</span>}
        {syncResult && <span className={styles.saveStatus}> · {syncResult}</span>}
      </div>

      <button className={styles.syncButton} onClick={syncNow} disabled={syncing}>
        {syncing ? "syncing…" : "sync now"}
      </button>

      <a className={styles.exitButton} href="/">
        back to live
      </a>
    </div>
  );
}
