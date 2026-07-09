import { useState } from "react";

// ---------------------------------------------------------------
// MAT PEEL PROTOTYPE — matt's thoughtscape
// Feel test for: corner curl on hover, full peel on click,
// stacked mats as time chapters, return tabs to go back up.
// ---------------------------------------------------------------

const MONO = "'Space Mono', 'Courier New', monospace";

const PALETTES = [
  ["#2a3440", "#1c242e"],
  ["#3a2b28", "#241a18"],
  ["#26302a", "#181f1a"],
  ["#342a36", "#201823"],
  ["#30302a", "#1e1e18"],
  ["#222c38", "#161d26"],
];

const MATS = [
  {
    id: 3,
    label: "MAT 03 / MAY–JUL 2026",
    base: "#191a1b",
    cards: [
      { x: 12, y: 14, p: 0, r: 5 },
      { x: 33, y: 19, p: 1, r: 4 },
      { x: 55, y: 12, p: 2, r: 5 },
      { x: 76, y: 17, p: 3, r: 3 },
      { x: 20, y: 56, p: 4, r: 4 },
      { x: 44, y: 60, p: 5, r: 5 },
      { x: 66, y: 55, p: 0, r: 3 },
    ],
  },
  {
    id: 2,
    label: "MAT 02 / JAN–APR 2026",
    base: "#151617",
    cards: [
      { x: 16, y: 16, p: 3, r: 4 },
      { x: 38, y: 11, p: 4, r: 5 },
      { x: 60, y: 18, p: 5, r: 3 },
      { x: 79, y: 13, p: 0, r: 4 },
      { x: 26, y: 58, p: 1, r: 5 },
      { x: 52, y: 62, p: 2, r: 4 },
      { x: 74, y: 56, p: 3, r: 3 },
    ],
  },
  {
    id: 1,
    label: "MAT 01 / SEP–DEC 2025",
    base: "#121314",
    cards: [
      { x: 14, y: 20, p: 5, r: 5 },
      { x: 36, y: 14, p: 2, r: 4 },
      { x: 58, y: 21, p: 1, r: 4 },
      { x: 78, y: 15, p: 4, r: 5 },
      { x: 24, y: 60, p: 0, r: 3 },
      { x: 48, y: 57, p: 3, r: 4 },
      { x: 70, y: 62, p: 5, r: 5 },
    ],
  },
];

function Grid({ opacity = 1 }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        backgroundImage: `
          linear-gradient(to right, rgba(120,122,128,0.28) 1.5px, transparent 1.5px),
          linear-gradient(to bottom, rgba(120,122,128,0.28) 1.5px, transparent 1.5px),
          linear-gradient(to right, rgba(120,122,128,0.12) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(120,122,128,0.12) 1px, transparent 1px)
        `,
        backgroundSize: "200px 200px, 200px 200px, 40px 40px, 40px 40px",
        pointerEvents: "none",
      }}
    />
  );
}

function Card({ card, small }) {
  const [hov, setHov] = useState(false);
  const [c1, c2] = PALETTES[card.p];
  const w = small ? 96 : 128;
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "absolute",
        left: `${card.x}%`,
        top: `${card.y}%`,
        width: w,
        height: w * 1.5,
        background: `linear-gradient(135deg, ${c1}, ${c2})`,
        border: "3px solid #f2f0e9",
        borderRadius: 3,
        boxShadow: hov
          ? "0 12px 28px rgba(0,0,0,0.65)"
          : "0 5px 14px rgba(0,0,0,0.5)",
        transform: hov ? "translateY(-4px) scale(1.03)" : "none",
        transition: "transform 180ms ease, box-shadow 180ms ease",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: -22,
          left: 0,
          color: "#d8e04a",
          fontSize: 11,
          letterSpacing: 2,
          fontFamily: MONO,
          opacity: hov ? 1 : 0.85,
        }}
      >
        {"★".repeat(card.r)}
      </div>
    </div>
  );
}

// Curled-corner flap rendered as SVG so the fold can curve
function Flap({ size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        position: "absolute",
        right: 0,
        bottom: 0,
        filter: "drop-shadow(-8px -8px 14px rgba(0,0,0,0.55))",
        pointerEvents: "none",
        transition: "width 260ms cubic-bezier(0.22,1,0.36,1), height 260ms cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <defs>
        <linearGradient id="flapGrad" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#54555a" />
          <stop offset="55%" stopColor="#333438" />
          <stop offset="100%" stopColor="#212226" />
        </linearGradient>
      </defs>
      <path
        d="M 0 100 L 100 0 Q 42 8 22 22 Q 8 42 0 100 Z"
        fill="url(#flapGrad)"
      />
    </svg>
  );
}

function Mat({ mat, state, cut, onCornerEnter, onBodyClick, onPeel, depth, isTop, canPeel }) {
  // state: "top" | "under" | "peeled"
  const peeled = state === "peeled";

  return (
    <div
      style={{
        position: "absolute",
        inset: `${depth * 14}px 24px ${36 - depth * 14}px 24px`,
        background: mat.base,
        borderRadius: 12,
        boxShadow: isTop
          ? "0 10px 40px rgba(0,0,0,0.7)"
          : "0 4px 16px rgba(0,0,0,0.5)",
        clipPath: isTop && canPeel
          ? `polygon(0 0, 100% 0, 100% calc(100% - ${cut}px), calc(100% - ${cut}px) 100%, 0 100%)`
          : "none",
        transform: peeled
          ? "translate(-115%, -28%) rotate(-7deg)"
          : "none",
        transformOrigin: "100% 100%",
        transition:
          "transform 850ms cubic-bezier(0.55, 0, 0.25, 1), clip-path 260ms cubic-bezier(0.22,1,0.36,1)",
        filter: !isTop && !peeled ? "brightness(0.92)" : "none",
        zIndex: peeled ? 50 : 20 - depth,
        overflow: "visible",
      }}
    >
      <div
        onClick={isTop ? onBodyClick : undefined}
        style={{ position: "absolute", inset: 0, borderRadius: 12, overflow: "hidden" }}
      >
        <Grid opacity={isTop ? 1 : 0.6} />
        <div
          style={{
            position: "absolute",
            top: 22,
            left: 26,
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: 3,
            color: "#828288",
          }}
        >
          {mat.label}
        </div>
        {mat.id === 3 && (
          <div
            style={{
              position: "absolute",
              top: "44%",
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
              fontFamily: MONO,
              pointerEvents: "none",
            }}
          >
            <div style={{ color: "#e8e8ea", fontSize: 15, fontWeight: 700 }}>
              matt's thoughtscape
            </div>
            <div style={{ color: "#77777d", fontSize: 11, marginTop: 6 }}>
              entryway to my opinions about different forms of media
            </div>
          </div>
        )}
        {mat.cards.map((c, i) => (
          <Card key={i} card={c} small={false} />
        ))}
      </div>

      {/* peel hotzone + flap, only on the active top mat when there's a mat beneath */}
      {isTop && canPeel && (
        <>
          <Flap size={cut} />
          <div
            onMouseEnter={onCornerEnter}
            onClick={onPeel}
            title="peel back"
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: 150,
              height: 150,
              cursor: "pointer",
              zIndex: 60,
            }}
          />
        </>
      )}
    </div>
  );
}

export default function MatPeelPrototype() {
  // index into MATS of the currently-top visible mat
  const [topIdx, setTopIdx] = useState(0);
  const [curlOpen, setCurlOpen] = useState(false);
  const [peelingIdx, setPeelingIdx] = useState(null);

  const REST_CUT = 52;
  const OPEN_CUT = 190;
  const cut = curlOpen ? OPEN_CUT : REST_CUT;

  const peel = () => {
    if (topIdx >= MATS.length - 1) return;
    setPeelingIdx(topIdx);
    setCurlOpen(false);
    setTimeout(() => {
      setTopIdx((i) => i + 1);
      setPeelingIdx(null);
    }, 860);
  };

  const unpeel = () => {
    if (topIdx <= 0) return;
    // returning mat animates back in: mount it in "peeled" position, then clear
    const returning = topIdx - 1;
    setPeelingIdx(returning);
    setTopIdx(returning);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setPeelingIdx(null))
    );
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: 600,
        background: "#0a0a0c",
        overflow: "hidden",
        fontFamily: MONO,
      }}
    >
      {/* stack of mats: render from oldest (deepest) to the current top */}
      {MATS.map((mat, i) => {
        if (i < topIdx && i !== peelingIdx) return null; // fully peeled away, not animating
        const isTop = i === topIdx && peelingIdx === null;
        const state =
          i === peelingIdx && i < topIdx
            ? "peeled"
            : i === peelingIdx
            ? "peeled"
            : i === topIdx
            ? "top"
            : "under";
        // during a return animation, the returning mat is topIdx AND peelingIdx: starts peeled, transitions to top
        const effState = i === topIdx && i === peelingIdx ? "peeled" : state;
        return (
          <Mat
            key={mat.id}
            mat={mat}
            state={effState}
            cut={cut}
            depth={i - topIdx < 0 ? 0 : i - topIdx}
            isTop={isTop}
            canPeel={topIdx < MATS.length - 1}
            onCornerEnter={() => setCurlOpen(true)}
            onBodyClick={() => setCurlOpen(false)}
            onPeel={peel}
          />
        );
      })}

      {/* peeled-mat return tab, pinned top-left like the edge of a mat set aside */}
      {topIdx > 0 && (
        <div
          onClick={unpeel}
          style={{
            position: "absolute",
            top: 90,
            left: 0,
            padding: "10px 18px 10px 14px",
            background: "#1d1e20",
            color: "#9a9aa0",
            fontSize: 11,
            letterSpacing: 2,
            borderRadius: "0 6px 6px 0",
            borderLeft: "3px solid #46464c",
            cursor: "pointer",
            boxShadow: "4px 4px 14px rgba(0,0,0,0.5)",
            zIndex: 70,
            transform: "rotate(-1.5deg)",
          }}
        >
          ↩ {MATS[topIdx - 1].label.split(" /")[0]}
        </div>
      )}

      {/* stack indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 52,
          right: 44,
          color: "#77777d",
          fontSize: 10,
          letterSpacing: 2,
          background: "#1b1c1e",
          padding: "8px 14px",
          borderRadius: 6,
          zIndex: 70,
          pointerEvents: "none",
        }}
      >
        MAT {MATS[topIdx].id} OF {MATS.length}
        {topIdx < MATS.length - 1 ? "  ·  peel corner ↘" : "  ·  bottom of stack"}
      </div>
    </div>
  );
}
