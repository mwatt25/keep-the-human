```jsx
"use client";

/*
  App.jsx
  Dependencies: React, framer-motion
  Styling: Tailwind CSS configured in the host project.
  No external images, fonts, icon libraries, or audio assets.
*/

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

const DIMENSIONS = [
  {
    key: "people",
    label: "People",
    description: "Relationships & learner support",
    color: "#55745c",
  },
  {
    key: "privacy",
    label: "Privacy",
    description: "Data & personal boundaries",
    color: "#587e93",
  },
  {
    key: "quality",
    label: "Quality",
    description: "Accuracy & instructional fit",
    color: "#ac7746",
  },
  {
    key: "capacity",
    label: "Capacity",
    description: "Time & sustainable workload",
    color: "#887399",
  },
];

const STARTING_SCORES = {
  people: 50,
  privacy: 50,
  quality: 50,
  capacity: 50,
};

const PROFILES = {
  people: {
    title: "The Human-Centric Leader",
    description:
      "Your decisions emphasized relationships, learner support, and empathy.",
  },
  privacy: {
    title: "The Guardian of Trust",
    description:
      "Your decisions emphasized protecting information and maintaining clear data boundaries.",
  },
  quality: {
    title: "The Excellence Architect",
    description:
      "Your decisions emphasized accuracy, instructional alignment, and careful human review.",
  },
  capacity: {
    title: "The Sustainable Strategist",
    description:
      "Your decisions emphasized saving time and preserving capacity. Review the other meters to see where those efficiencies carried a cost.",
  },
};

const COMMITMENTS = [
  {
    title: "I will use AI for:",
    body: "one low-risk task where it can save time.",
    color: "#f1e7b0",
    rotation: -2,
  },
  {
    title: "I will protect:",
    body: "one kind of data or information that should not be casually shared.",
    color: "#dfe8c9",
    rotation: 1.6,
  },
  {
    title: "I will check:",
    body: "one quality question before using AI-generated content.",
    color: "#dce6e7",
    rotation: -1.2,
  },
  {
    title: "I will keep a human in the loop when:",
    body: "an action affects a person, record, decision, or public communication.",
    color: "#efdbcc",
    rotation: 2,
  },
];

const SCENARIOS = [
  {
    id: 1,
    title: "The Helpful Lesson Plan",
    artifact: "tablet",
    category: "Instructional judgment",
    situation:
      "It is late afternoon. A teacher asks an AI assistant for a 15-minute small-group phonics activity on the /sh/ sound. The draft is polished and includes engaging pictures, but one suggested word does not contain the target sound and the activity asks children to guess words from pictures before teaching the sound-spelling relationship. Several learners need clear, explicit instruction and language supports.",
    choices: [
      {
        text: "Fix the incorrect word, keep the activity largely as written, and note the instructional concern for a future revision.",
        points: { people: 0, privacy: 0, quality: -10, capacity: 15 },
        right:
          "Protects capacity and corrects the visible factual error.",
        miss:
          "Leaves an instructional approach in place that may not match learning goals.",
      },
      {
        text: "Ask AI for three new versions, select the one that sounds clearest, and do a quick final review before tomorrow.",
        points: { people: 0, privacy: 0, quality: -5, capacity: 5 },
        right:
          "Invites alternatives and includes some human review.",
        miss:
          "Treats fluency and polish as a substitute for checking instructional alignment.",
      },
      {
        text: "Use the draft only as a starting point, check it against the existing scope and sequence, revise the examples and language supports, and keep only the pieces that fit.",
        points: { people: 10, privacy: 0, quality: 20, capacity: -15 },
        right:
          "Balances capacity with accuracy, explicit instruction, and learner fit.",
        miss:
          "Takes a little more preparation time.",
      },
    ],
    feedback:
      "AI can help you start faster. It cannot decide whether an activity matches your instructional sequence, evidence-based approach, or the learners in front of you.",
  },
  {
    id: 2,
    title: "The Private Notes",
    artifact: "folder",
    category: "Privacy & purpose",
    situation:
      "A colleague has several pages of observation notes about a child’s classroom behavior and wants AI to turn them into a concise family-conference summary. The notes include the child’s name, family details, and descriptions of difficult moments. The school has an approved AI tool, but the team has not yet clarified whether this use is permitted.",
    choices: [
      {
        text: "Replace the child’s name with initials, paste the notes into the tool, and review the summary carefully before using it.",
        points: { people: 5, privacy: -15, quality: 5, capacity: 10 },
        right:
          "Attempts to reduce identifying information and preserves final review.",
        miss:
          "Initials and rich context can still identify a child; approved-use question remains open.",
      },
      {
        text: "Use the approved AI tool because the organization has already vetted the vendor, then edit the output for tone and accuracy.",
        points: { people: 0, privacy: -10, quality: 10, capacity: 10 },
        right:
          "Recognizes that approved tools are safer than unapproved tools.",
        miss:
          "Approval of a tool does not automatically approve every sensitive use case.",
      },
      {
        text: "Pause before sharing notes, confirm the organization’s data rules for this use, and create a brief, de-identified pattern summary.",
        points: { people: 15, privacy: 20, quality: 15, capacity: -10 },
        right:
          "Protects privacy while still working toward a useful family conversation.",
        miss:
          "Requires a deliberate check instead of an immediate shortcut.",
      },
    ],
    feedback:
      "The question is not only whether a tool is approved. It is whether this information, this purpose, and this workflow are approved.",
  },
  {
    id: 3,
    title: "The Quick Family Message",
    artifact: "clipboard",
    category: "Human communication",
    situation:
      "After a difficult day, a teacher needs to send a family a short update before dismissal. AI produces a warm, polished message, but it softens the concern so much that the family may not understand what happened or what support is needed next.",
    choices: [
      {
        text: "Send the AI draft after correcting the student’s name and date, because a calm message is better than a rushed one.",
        points: { people: -15, privacy: 0, quality: -10, capacity: 15 },
        right:
          "Values a respectful tone and reduces immediate workload.",
        miss:
          "Risks vague communication that does not give an accurate, useful picture.",
      },
      {
        text: "Give AI only a general, non-identifying description, use the draft for structure, then add the specific facts, professional context, and next steps.",
        points: { people: 15, privacy: 5, quality: 15, capacity: -5 },
        right:
          "Uses AI to reduce blank-page pressure while preserving truthful, human communication.",
        miss:
          "Requires the teacher to slow down long enough to rewrite rather than merely proofread.",
      },
      {
        text: "Write every message from scratch so the family knows the communication is fully personal.",
        points: { people: 10, privacy: 0, quality: 15, capacity: -20 },
        right:
          "Prioritizes absolute authenticity and avoids AI-related structural errors.",
        miss:
          "May create an unsustainable workload when AI could safely support a low-risk first draft.",
      },
    ],
    feedback:
      "A responsible use of AI can save time without outsourcing the relationship. Let AI help with structure, then add the facts, context, and professional voice only you can provide.",
  },
  {
    id: 4,
    title: "The Perfect Resource",
    artifact: "paper",
    category: "Quality & access",
    situation:
      "A free AI tool generates a visually appealing reading resource for a classroom. It looks engaging and is roughly on-topic, but the examples assume background knowledge some learners do not share, the reading load is uneven, and there is no obvious accessibility check.",
    choices: [
      {
        text: "Share it with a note that teachers should adapt it for their own students.",
        points: { people: -5, privacy: 0, quality: -15, capacity: 15 },
        right:
          "Acknowledges that adaptation matters and preserves access to a useful-looking layout.",
        miss:
          "Shifts the quality-control burden completely to the individuals who need support.",
      },
      {
        text: "Ask AI to lower the reading level and generate a more inclusive version, then distribute the revised resource.",
        points: { people: 5, privacy: 0, quality: -5, capacity: 5 },
        right:
          "Addresses immediate readability concerns and actively invites a rapid revision.",
        miss:
          "A smoother revision may still contain inaccurate, biased, or poorly aligned content.",
      },
      {
        text: "Review the resource for instructional fit, accuracy, representation, and accessibility; then revise, pilot, or reject it.",
        points: { people: 15, privacy: 0, quality: 20, capacity: -15 },
        right:
          "Treats resource quality as more than surface polish and fully protects learners.",
        miss:
          "Takes deep professional judgment and means letting go of a quick, promising layout.",
      },
    ],
    feedback:
      "Generated resources can look finished before they are ready. Quality includes accuracy, access, representation, and fit, not just attractive design.",
  },
  {
    id: 5,
    title: "The Pressure to Adopt",
    artifact: "planner",
    category: "Purposeful adoption",
    situation:
      "A leader announces that an AI feature is available and says the team should begin using it next week to show innovation. It could help with planning, but no one has clarified the instructional problem it solves, the data it accesses, or how success will be measured.",
    choices: [
      {
        text: "Encourage everyone to try it for a month and collect feedback afterward.",
        points: { people: 5, privacy: -10, quality: -5, capacity: 10 },
        right:
          "Respects staff agency and creates a dynamic chance to learn directly from active use.",
        miss:
          "Starts widespread adoption before guardrails, core purpose, and data boundaries are clear.",
      },
      {
        text: "Decline to participate until the organization has a fully developed, long-term AI policy.",
        points: { people: -5, privacy: 15, quality: 5, capacity: -5 },
        right:
          "Protects against rushed adoption and signals highly appropriate professional caution.",
        miss:
          "Can turn a necessary question into an indefinite pause, stalling safe learning opportunities.",
      },
      {
        text: "Recommend a small, opt-in pilot after the team defines the problem, approved uses, data boundaries, and human-review criteria.",
        points: { people: 15, privacy: 15, quality: 15, capacity: -5 },
        right:
          "Makes calculated room for innovation while protecting people, privacy, and quality.",
        miss:
          "Requires leaders to slow down and make decisions explicitly clear up front.",
      },
    ],
    feedback:
      "A confident ‘not yet’ is not resistance to innovation. It is a request for a purpose, a boundary, and a way to learn whether the tool actually helps.",
  },
  {
    id: 6,
    title: "The Agent with Access",
    artifact: "monitor",
    category: "Permissions & oversight",
    situation:
      "An AI assistant promises to organize meetings and draft follow-up notes if it can connect to a professional’s email, calendar, and shared-drive files. The platform offers a convenient one-click connection and says the user can turn off sending permissions.",
    choices: [
      {
        text: "Connect the real accounts with send permissions turned off, then review the assistant’s suggestions before acting.",
        points: { people: 0, privacy: -15, quality: 5, capacity: 15 },
        right:
          "Keeps a human in the final sending step and limits active automated messaging risks.",
        miss:
          "Read access alone can still expose sensitive internal messages, calendars, and secure records.",
      },
      {
        text: "Avoid the assistant completely because any connection to work systems creates too much risk.",
        points: { people: 0, privacy: 20, quality: 0, capacity: -15 },
        right:
          "Strongly protects overall privacy infrastructure and prevents unauthorized background reading.",
        miss:
          "Gives up the chance to evaluate whether a tightly bounded use could safely reduce workloads.",
      },
      {
        text: "Test the assistant with a sandbox or limited, non-sensitive account first, granting only the absolute minimum access needed.",
        points: { people: 10, privacy: 15, quality: 10, capacity: -5 },
        right:
          "Applies least-access thinking and lets the professional evaluate value safely.",
        miss:
          "Requires a more deliberate evaluation process and manual account setup.",
      },
    ],
    feedback:
      "Convenience is not a reason to grant broad access. Start small, define the task, limit the data, and keep a person responsible for the final outcome.",
  },
];

const GLOBAL_STYLES = `
  .human-lab {
    color-scheme: light;
    font-family: Arial, Helvetica, sans-serif;
    background: #f7f5ee;
    color: #243a31;
  }

  .human-lab *, .human-lab *::before, .human-lab *::after {
    box-sizing: border-box;
  }

  .human-lab button {
    font: inherit;
    -webkit-tap-highlight-color: transparent;
  }

  .human-lab button:not(:disabled) {
    cursor: pointer;
  }

  .human-lab button:focus-visible {
    outline: 3px solid #b57542;
    outline-offset: 4px;
  }

  .human-lab .editorial {
    font-family: Georgia, "Times New Roman", serif;
  }

  .human-lab .oak-desk {
    background-color: #e9dfcd;
    background-image:
      radial-gradient(ellipse at 45% 10%, #fffdf67a, transparent 70%),
      repeating-linear-gradient(
        2deg,
        transparent 0,
        transparent 10px,
        #a97c3708 11px,
        transparent 12px,
        transparent 23px,
        #b78d460a 24px,
        transparent 27px
      ),
      repeating-linear-gradient(
        91deg,
        #fff8e715 0,
        #fff8e715 180px,
        #98703f08 181px,
        transparent 182px,
        transparent 380px
      ),
      linear-gradient(105deg, #e7dac1, #f2e9d8 48%, #e9deca);
  }

  .human-lab .artifact-shadow {
    box-shadow:
      0 35px 45px -28px #3b30257a,
      0 12px 20px -14px #3b302540;
  }

  .human-lab .paper-surface {
    background-color: #fffdf6;
    background-image: repeating-linear-gradient(
      0deg,
      transparent 0,
      transparent 3px,
      #8c806003 4px
    );
  }

  .human-lab .metal-clip {
    background: linear-gradient(
      90deg,
      #82887e,
      #eceee7 18%,
      #a8aea2 49%,
      #e7e9e0 82%,
      #848b7e
    );
    box-shadow:
      inset 0 1px 2px #ffffffbb,
      0 3px 5px #202a2240;
  }

  .human-lab dialog {
    margin: auto;
    padding: 0;
    border: 0;
    color: #243a31;
    background: transparent;
    max-height: 92dvh;
    width: min(680px, calc(100vw - 28px));
    overflow: visible;
  }

  .human-lab dialog::backdrop {
    background: #15241dcc;
    backdrop-filter: blur(7px);
    -webkit-backdrop-filter: blur(7px);
  }

  .human-lab .dialog-scroll {
    max-height: 90dvh;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .human-lab .sticky-note {
    box-shadow:
      0 15px 20px -18px #443d24aa,
      inset 0 25px 0 #ffffff17;
  }

  @media (prefers-reduced-motion: reduce) {
    .human-lab *,
    .human-lab *::before,
    .human-lab *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  @media print {
    @page { margin: 14mm; }

    body {
      margin: 0 !important;
      background: white !important;
    }

    .human-lab {
      background: white !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .human-lab .no-print,
    .human-lab dialog {
      display: none !important;
    }

    .human-lab .oak-desk {
      padding: 0 !important;
      min-height: 0 !important;
      border: 0 !important;
      background: white !important;
    }

    .human-lab .snapshot {
      padding: 0 !important;
    }

    .human-lab .snapshot-title {
      font-size: 34px !important;
      margin: 12px 0 !important;
    }

    .human-lab .snapshot-grid {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 14px !important;
    }

    .human-lab .sticky-note,
    .human-lab .profile-card,
    .human-lab .meter-panel {
      break-inside: avoid;
      transform: none !important;
      box-shadow: none !important;
    }

    .human-lab .meter-panel {
      margin-bottom: 18px !important;
    }
  }
`;

function Icon({ name = "arrow", size = 20, className = "" }) {
  const paths = {
    arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    warning: (
      <>
        <path d="m12 3 10 18H2L12 3Z" />
        <path d="M12 9v5m0 3h.01" />
      </>
    ),
    people: (
      <>
        <circle cx="9" cy="7" r="3" />
        <path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m2 5a5 5 0 0 1 3 5" />
      </>
    ),
    privacy: (
      <>
        <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    quality: (
      <>
        <circle cx="12" cy="9" r="6" />
        <path d="m8 14-2 8 6-3 6 3-2-8m-7-5 2 2 4-4" />
      </>
    ),
    capacity: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v6l4 2" />
      </>
    ),
    sound: (
      <>
        <path d="m11 5-5 4H3v6h3l5 4V5Z" />
        <path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" />
      </>
    ),
    mute: (
      <>
        <path d="m11 5-5 4H3v6h3l5 4V5Z" />
        <path d="m16 9 5 6m0-6-5 6" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 6 9 7 9-7" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2" />
      </>
    ),
    folder: (
      <path d="M3 7V5a2 2 0 0 1 2-2h5l3 4h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
    ),
    print: (
      <>
        <path d="M6 9V3h12v6M6 18H3v-9h18v9h-3" />
        <path d="M6 14h12v7H6zM17 12h.01" />
      </>
    ),
    reset: (
      <>
        <path d="M3 10a9 9 0 1 1 1 8M3 4v6h6" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name] || paths.arrow}
    </svg>
  );
}

/* Audio is initialized only after the user presses the sound button. */
function useProceduralAudio() {
  const engineRef = useRef(null);
  const enabledRef = useRef(false);
  const busyRef = useRef(false);
  const mountedRef = useRef(true);

  const [enabled, setEnabled] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  const createEngine = useCallback(() => {
    if (engineRef.current) return engineRef.current;

    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      throw new Error("Web Audio is unavailable.");
    }

    const context = new AudioContextClass();
    const master = context.createGain();
    const compressor = context.createDynamicsCompressor();

    master.gain.value = 0;
    compressor.threshold.value = -18;
    compressor.knee.value = 20;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.01;
    compressor.release.value = 0.3;

    master.connect(compressor);
    compressor.connect(context.destination);

    const ambientBus = context.createGain();
    ambientBus.gain.value = 0.13;
    ambientBus.connect(master);

    const ambientNodes = [];

    [
      { frequency: 130.81, volume: 0.13, pan: -0.55 },
      { frequency: 196, volume: 0.065, pan: 0.55 },
      { frequency: 261.63, volume: 0.035, pan: 0 },
    ].forEach(({ frequency, volume, pan }, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const lfo = context.createOscillator();
      const lfoDepth = context.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.value = volume;

      lfo.frequency.value = 0.045 + index * 0.017;
      lfoDepth.gain.value = volume * 0.2;

      lfo.connect(lfoDepth);
      lfoDepth.connect(gain.gain);
      oscillator.connect(gain);

      if (context.createStereoPanner) {
        const panner = context.createStereoPanner();
        panner.pan.value = pan;
        gain.connect(panner);
        panner.connect(ambientBus);
        ambientNodes.push(panner);
      } else {
        gain.connect(ambientBus);
      }

      oscillator.start();
      lfo.start();

      ambientNodes.push(oscillator, gain, lfo, lfoDepth);
    });

    engineRef.current = {
      context,
      master,
      ambientNodes,
    };

    return engineRef.current;
  }, []);

  const toggle = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;

    try {
      const engine = createEngine();
      const next = !enabledRef.current;

      if (next) {
        await engine.context.resume();

        if (!mountedRef.current) return;

        engine.master.gain.cancelScheduledValues(
          engine.context.currentTime
        );
        engine.master.gain.setTargetAtTime(
          0.5,
          engine.context.currentTime,
          0.12
        );
      } else {
        engine.master.gain.cancelScheduledValues(
          engine.context.currentTime
        );
        engine.master.gain.setValueAtTime(
          0,
          engine.context.currentTime
        );
        await engine.context.suspend();

        if (!mountedRef.current) return;
      }

      enabledRef.current = next;
      setEnabled(next);
      setUnavailable(false);
    } catch {
      enabledRef.current = false;

      if (mountedRef.current) {
        setEnabled(false);
        setUnavailable(true);
      }
    } finally {
      busyRef.current = false;
    }
  }, [createEngine]);

  const play = useCallback((kind) => {
    const engine = engineRef.current;

    if (
      !enabledRef.current ||
      !engine ||
      engine.context.state !== "running"
    ) {
      return;
    }

    const { context, master } = engine;

    const tone = (
      frequency,
      delay = 0,
      duration = 0.25,
      volume = 0.11
    ) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = context.currentTime + delay;

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        start + duration
      );

      oscillator.connect(gain);
      gain.connect(master);

      oscillator.start(start);
      oscillator.stop(start + duration + 0.04);
      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
      };
    };

    try {
      if (kind === "choice") {
        tone(659.25, 0, 0.2, 0.1);
        tone(987.77, 0.025, 0.16, 0.025);
      }

      if (kind === "warning") {
        tone(349.23, 0.15, 0.35, 0.11);
        tone(293.66, 0.34, 0.45, 0.09);
      }

      if (kind === "complete") {
        [261.63, 329.63, 392, 523.25].forEach(
          (frequency, index) => {
            tone(frequency, index * 0.11, 1.15, 0.075);
          }
        );
      }

      if (kind === "move") {
        const duration = 0.48;
        const buffer = context.createBuffer(
          1,
          Math.ceil(context.sampleRate * duration),
          context.sampleRate
        );

        const channel = buffer.getChannelData(0);

        for (let i = 0; i < channel.length; i += 1) {
          channel[i] = Math.random() * 2 - 1;
        }

        const source = context.createBufferSource();
        const filter = context.createBiquadFilter();
        const gain = context.createGain();
        const start = context.currentTime;

        source.buffer = buffer;
        filter.type = "lowpass";
        filter.Q.value = 0.4;
        filter.frequency.setValueAtTime(700, start);
        filter.frequency.exponentialRampToValueAtTime(
          100,
          start + duration
        );

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.2, start + 0.12);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          start + duration
        );

        source.connect(filter);
        filter.connect(gain);
        gain.connect(master);

        source.start(start);
        source.stop(start + duration);

        source.onended = () => {
          source.disconnect();
          filter.disconnect();
          gain.disconnect();
        };

        tone(110, 0, 0.35, 0.06);
      }
    } catch {
      // Audio failure must never interrupt a decision.
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    const handleVisibility = () => {
      const engine = engineRef.current;
      if (!engine) return;

      if (document.hidden) {
        engine.context.suspend().catch(() => {});
      } else if (enabledRef.current) {
        engine.context.resume().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      mountedRef.current = false;
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );

      const engine = engineRef.current;
      engineRef.current = null;

      if (engine && engine.context.state !== "closed") {
        engine.context.close().catch(() => {});
      }
    };
  }, []);

  return { enabled, unavailable, toggle, play };
}

function Eyebrow({ children, className = "" }) {
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-[0.18em] ${className}`}
    >
      {children}
    </p>
  );
}

function PrimaryButton({
  children,
  onClick,
  icon = "arrow",
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-12 items-center justify-center gap-4 rounded-xl bg-[#254b3c] px-6 py-3.5 text-base font-medium text-[#fffdf4] shadow-sm transition-colors hover:bg-[#18372a] ${className}`}
    >
      {children}
      {icon && <Icon name={icon} />}
    </button>
  );
}

function Meter({ dimension, value, delta, reducedMotion }) {
  const danger = value < 30;

  return (
    <div className="min-w-0 px-4 sm:px-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span style={{ color: dimension.color }}>
            <Icon name={dimension.key} size={17} />
          </span>
          <span className="text-sm font-semibold">
            {dimension.label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <AnimatePresence mode="popLayout">
            {delta !== null && delta !== 0 && (
              <motion.span
                key={`${value}-${delta}`}
                initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`hidden text-xs font-medium sm:inline ${
                  delta < 0 ? "text-[#9b5738]" : "text-[#426545]"
                }`}
              >
                {delta > 0 ? "+" : ""}
                {delta}
              </motion.span>
            )}
          </AnimatePresence>

          <span className="text-sm font-semibold tabular-nums">
            {value}
            <span className="ml-1 text-xs font-normal text-[#778171]">
              / 100
            </span>
          </span>
        </div>
      </div>

      <motion.div
        role="progressbar"
        aria-label={dimension.label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={`${value} out of 100${
          danger ? ", needs attention" : ""
        }`}
        animate={
          danger && !reducedMotion
            ? {
                boxShadow: [
                  "0 0 0 0px rgba(166, 65, 46, 0)",
                  "0 0 0 5px rgba(166, 65, 46, 0.12)",
                  "0 0 0 0px rgba(166, 65, 46, 0)",
                ],
              }
            : { boxShadow: "0 0 0 0px rgba(166, 65, 46, 0)" }
        }
        transition={
          danger && !reducedMotion
            ? { duration: 2, repeat: Infinity }
            : { duration: 0.15 }
        }
        className="h-1.5 overflow-hidden rounded-full bg-[#e8ebdf]"
      >
        <motion.div
          initial={false}
          animate={{ width: `${value}%` }}
          transition={{
            duration: reducedMotion ? 0 : 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="h-full rounded-full"
          style={{
            backgroundColor: danger ? "#a6412e" : dimension.color,
          }}
        />
      </motion.div>

      <p
        className={`mt-2.5 flex min-h-4 items-center gap-1.5 text-xs leading-relaxed ${
          danger
            ? "font-semibold text-[#a6412e]"
            : "text-[#707b67]"
        }`}
      >
        {danger && <Icon name="warning" size={13} />}
        {danger ? "Needs attention" : dimension.description}
      </p>
    </div>
  );
}

function SmallTag({ children, tone = "green" }) {
  const colors =
    tone === "amber"
      ? "border-[#dfc8a1] bg-[#f5ead5] text-[#866139]"
      : "border-[#d7dfce] bg-[#edf1e6] text-[#526748]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs ${colors}`}
    >
      {children}
    </span>
  );
}

function ArtifactHeader({ title, right = "•••", dark = false }) {
  return (
    <div
      className={`flex items-center justify-between gap-3 border-b px-5 py-4 ${
        dark
          ? "border-white/10 bg-[#294c3e] text-[#eef0de]"
          : "border-[#e0e4d7] text-[#71806b]"
      }`}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.13em]">
        {title}
      </span>
      <span className="text-xs tracking-widest">{right}</span>
    </div>
  );
}

function TabletArtifact() {
  return (
    <div
      className="artifact-shadow overflow-hidden rounded-[32px] border-[11px] border-[#303832] bg-[#fbfcf5] ring-1 ring-[#778073]"
      style={{ transform: "rotate(-3deg)" }}
    >
      <div
        aria-hidden="true"
        className="flex h-4 items-center justify-center bg-[#303832]"
      >
        <span className="mb-1 h-1.5 w-1.5 rounded-full bg-[#131a16] ring-1 ring-[#4a554b]" />
      </div>

      <ArtifactHeader title="Lesson studio" right="DRAFT" />

      <div className="px-6 pb-7 pt-6 sm:px-8">
        <SmallTag>AI draft · review pending</SmallTag>

        <h3 className="editorial mt-5 text-4xl leading-[1.08] tracking-tight">
          Small group.
          <br />
          Big possibilities.
        </h3>

        <p className="mt-3 text-xs leading-relaxed text-[#78816e]">
          15 MINUTES / PHONICS / THE /SH/ SOUND
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {["ship", "shop", "sun"].map((word, index) => (
            <div
              key={word}
              className={`rounded-xl border px-2 py-5 text-center ${
                index === 2
                  ? "border-[#d9c2a7] bg-[#f2e8d8]"
                  : "border-[#dce2d1] bg-[#edf1e4]"
              }`}
            >
              <span className="editorial text-2xl">{word}</span>
              <span className="mt-1 block text-[11px] uppercase tracking-widest text-[#7b856f]">
                Word {index + 1}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {[
            "Look at the pictures and guess each word.",
            "Say each word aloud.",
            "Circle the words with /sh/.",
          ].map((text, index) => (
            <div
              key={text}
              className="flex gap-3 border-b border-[#e2e6d9] pb-3 text-sm leading-relaxed"
            >
              <span className="text-xs text-[#87947a]">
                0{index + 1}
              </span>
              <p>{text}</p>
            </div>
          ))}
        </div>

        <p className="editorial mt-5 border-l-2 border-[#b8c5a1] pl-3 text-base italic leading-relaxed text-[#70805c]">
          Does a polished draft make a sound lesson?
        </p>
      </div>

      <div
        aria-hidden="true"
        className="mx-auto mb-2 h-1 w-24 rounded-full bg-[#c8cec0]"
      />
    </div>
  );
}

function FolderArtifact() {
  return (
    <div
      className="relative pt-7"
      style={{ transform: "rotate(-3deg)" }}
    >
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 h-12 w-44 rounded-t-xl border border-[#c5a86b] bg-[#d8bb7e]"
      />

      <div className="artifact-shadow relative rounded-b-xl rounded-tr-xl border border-[#c2a46d] bg-[#dfc48e] p-4 pt-5">
        <div className="mb-4 flex items-center justify-between px-2 text-xs uppercase tracking-widest text-[#755d32]">
          <span>Family conference</span>
          <Icon name="folder" size={17} />
        </div>

        <div className="paper-surface relative border border-[#ded7bf] px-6 py-7 shadow-sm">
          <span className="absolute -right-2 top-6 rotate-[5deg] border-2 border-[#a45d4a]/50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a45d4a]">
            Confidential
          </span>

          <Eyebrow className="text-[#8b8c78]">
            Observation notes
          </Eyebrow>

          <h3 className="editorial mt-5 text-4xl leading-[1.12] tracking-tight">
            A clearer picture
            <br />
            of a child.
          </h3>

          <div className="mt-6 space-y-4">
            {[
              ["Personal details", "Name and family context"],
              ["Classroom observations", "Behavior and difficult moments"],
              ["Requested output", "A family-conference summary"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="border-b border-[#e3e2d3] pb-4"
              >
                <p className="text-xs uppercase tracking-wider text-[#909078]">
                  {label}
                </p>
                <p className="mt-1.5 text-base">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg bg-[#f0eedf] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6c745a]">
              Before sharing
            </p>
            <p className="editorial mt-2 text-lg leading-relaxed">
              Approved tool.
              <br />
              Approved use?
            </p>
          </div>
        </div>

        <p className="px-2 pb-1 pt-4 text-xs text-[#7c633b]">
          Illustrative notes. No real student information.
        </p>
      </div>
    </div>
  );
}

function ClipboardArtifact() {
  return (
    <div
      className="artifact-shadow relative rounded-2xl border border-[#956e43] bg-[#b58c5d] p-4 pb-5 pt-9"
      style={{
        transform: "rotate(2deg)",
        backgroundImage:
          "repeating-linear-gradient(90deg, transparent 0px, transparent 16px, #6d452c0b 17px, transparent 19px)",
      }}
    >
      <div
        aria-hidden="true"
        className="metal-clip absolute -top-2 left-1/2 z-10 flex h-12 w-36 -translate-x-1/2 items-center justify-center rounded-b-xl rounded-t-lg border border-[#81887b]"
      >
        <div className="h-2 w-20 rounded-full bg-[#616b5c]/45 shadow-inner" />
      </div>

      <div className="paper-surface min-h-[430px] px-6 pb-8 pt-9 shadow-sm">
        <div className="flex items-center justify-between">
          <Eyebrow className="text-[#7b846e]">
            Family communication
          </Eyebrow>
          <Icon name="mail" size={19} />
        </div>

        <h3 className="editorial mt-6 text-4xl leading-[1.12] tracking-tight">
          Warm words.
          <br />
          Missing context.
        </h3>

        <p className="mt-3 text-xs uppercase tracking-widest text-[#89907d]">
          Before dismissal / Draft not sent
        </p>

        <div className="mt-7 space-y-5 text-base leading-8 text-[#64705b]">
          <p>Dear family,</p>
          <p>
            We had some{" "}
            <span className="bg-[#efe4a8]/60 px-1">
              opportunities to practice
            </span>{" "}
            today. We are continuing to grow together and appreciate
            your support.
          </p>
          <p>Thank you for being part of our classroom community!</p>
        </div>

        <div className="mt-7 border-t border-[#dce1d1] pt-4">
          <p className="editorial text-lg italic text-[#966b47]">
            What happened? What happens next?
          </p>
          <p className="mt-2 text-xs text-[#88907b]">
            Illustrative AI-generated message
          </p>
        </div>
      </div>
    </div>
  );
}

function PaperArtifact() {
  return (
    <div
      className="relative"
      style={{ transform: "rotate(-3deg)" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 translate-x-2 translate-y-2 rotate-[1.5deg] border border-[#d8d2bd] bg-[#f8f4e7]"
      />

      <div className="paper-surface artifact-shadow relative border border-[#d7d4c3] p-7 sm:p-8">
        <div className="flex items-center justify-between border-b border-[#dce1d2] pb-5">
          <Eyebrow className="text-[#7e8871]">
            Reading resource
          </Eyebrow>
          <span className="editorial text-lg text-[#9aab82]">
            Aa
          </span>
        </div>

        <h3 className="editorial mt-6 text-4xl leading-[1.12] tracking-tight">
          Looks ready.
          <br />
          Is it?
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-[#7b866c]">
          An attractive resource is waiting to be shared.
        </p>

        <div className="mt-6 rounded-xl border border-[#dae1cf] bg-[#eaf0dd] p-5">
          <p className="editorial text-2xl">A world of words</p>
          <p className="mt-2 text-sm leading-relaxed text-[#6f7a61]">
            Read. Reflect. Make connections.
          </p>
          <div aria-hidden="true" className="mt-4 space-y-2">
            <div className="h-1.5 w-full rounded bg-[#bac9a5]/55" />
            <div className="h-1.5 w-5/6 rounded bg-[#bac9a5]/55" />
            <div className="h-1.5 w-3/4 rounded bg-[#bac9a5]/55" />
          </div>
        </div>

        <div className="mt-6">
          {[
            ["Background knowledge", "Assumed"],
            ["Reading load", "Uneven"],
            ["Accessibility", "Unchecked"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-3 border-b border-[#e3e4d7] py-3 text-sm"
            >
              <span>{label}</span>
              <span className="rounded bg-[#f3e8d8] px-2 py-1 text-xs text-[#9a704a]">
                {value}
              </span>
            </div>
          ))}
        </div>

        <p className="editorial mt-6 text-base italic text-[#7c8868]">
          Quality lives beyond the layout.
        </p>
      </div>
    </div>
  );
}

function PlannerArtifact() {
  return (
    <div
      className="artifact-shadow overflow-hidden rounded-[22px] border-[8px] border-[#344b40] bg-[#f9fbf3]"
      style={{ transform: "rotate(-1.5deg)" }}
    >
      <ArtifactHeader title="School planner" right="WEEK VIEW" dark />

      <div className="p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <SmallTag>Next week</SmallTag>
          <Icon name="calendar" size={20} />
        </div>

        <h3 className="editorial mt-5 text-4xl leading-[1.12] tracking-tight">
          New tool.
          <br />
          Unclear purpose.
        </h3>

        <div
          aria-hidden="true"
          className="mt-6 grid grid-cols-5 gap-2"
        >
          {["M", "T", "W", "T", "F"].map((day, index) => (
            <div
              key={`${day}-${index}`}
              className={`rounded-lg py-2.5 text-center text-xs ${
                index === 0
                  ? "bg-[#2c5140] text-white"
                  : "bg-[#e9efdf] text-[#8a947c]"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {[
            ["MON", "Introduce the AI feature", "Team meeting"],
            ["TUE", "Everyone begins using it", "Organization-wide"],
            ["TBD", "Define success & boundaries", "Not yet scheduled"],
          ].map(([day, title, detail], index) => (
            <div
              key={title}
              className={`flex gap-3 rounded-xl border p-4 ${
                index === 2
                  ? "border-dashed border-[#ccb589] bg-[#f6efdf]"
                  : "border-[#dce3d0] bg-white/70"
              }`}
            >
              <span className="pt-0.5 text-[11px] font-semibold text-[#8a9578]">
                {day}
              </span>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-1 text-xs text-[#818d72]">
                  {detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="editorial mt-6 text-base italic text-[#71815e]">
          What needs to happen before Monday?
        </p>
      </div>
    </div>
  );
}

function MonitorArtifact() {
  return (
    <div>
      <div className="artifact-shadow relative z-10 overflow-hidden rounded-2xl border-[9px] border-[#303b34] border-b-[24px] bg-[#f8faf4]">
        <ArtifactHeader title="Assistant setup" right="ACCESS" />

        <div className="p-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#e1e9d7] text-[#526a44]">
            <Icon name="privacy" size={24} />
          </div>

          <h3 className="editorial text-3xl leading-[1.14] tracking-tight sm:text-4xl">
            How much access
            <br />
            is enough?
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-[#7d8870]">
            Organize meetings and draft follow-up notes.
          </p>

          <div className="mt-6 space-y-2.5">
            {[
              ["mail", "Email", "Read messages"],
              ["calendar", "Calendar", "Read events"],
              ["folder", "Shared drive", "Read files"],
            ].map(([icon, title, description]) => (
              <div
                key={title}
                className="flex items-center gap-3 rounded-lg border border-[#dce3d2] bg-white px-3 py-3"
              >
                <span className="text-[#789065]">
                  <Icon name={icon} size={19} />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs text-[#87927a]">
                    {description}
                  </p>
                </div>
                <span className="text-xs text-[#a57746]">
                  Requested
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg bg-[#e9eee1] p-3 text-sm">
            <span>Send permissions</span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#738263]">
              OFF
            </span>
          </div>

          <p className="mt-4 text-center text-xs text-[#879079]">
            Permission illustration. No accounts are connected.
          </p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="relative mx-auto -mt-1 h-16 w-20"
        style={{
          background:
            "linear-gradient(90deg, #727b70, #bec4b7 45%, #727b70)",
          clipPath: "polygon(22% 0, 78% 0, 90% 100%, 10% 100%)",
        }}
      />

      <div
        aria-hidden="true"
        className="mx-auto -mt-1 h-3 w-44 rounded-[50%] shadow-md"
        style={{
          background:
            "linear-gradient(0deg, #6c766a, #b1baaa)",
        }}
      />
    </div>
  );
}

const ARTIFACT_COMPONENTS = {
  tablet: TabletArtifact,
  folder: FolderArtifact,
  clipboard: ClipboardArtifact,
  paper: PaperArtifact,
  planner: PlannerArtifact,
  monitor: MonitorArtifact,
};

const ARTIFACT_CAPTIONS = {
  tablet: "A draft is a starting point. Your judgment comes next.",
  folder: "Private information deserves a deliberate pause.",
  clipboard: "Keep the relationship in your own hands.",
  paper: "The final review belongs to a person.",
  planner: "Innovation begins with a useful question.",
  monitor: "Read access is still access.",
};

function DeskArtifact({ type, reducedMotion }) {
  const Component = ARTIFACT_COMPONENTS[type];

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: reducedMotion ? 0 : 18,
      }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: reducedMotion ? 0 : 0.1,
        duration: reducedMotion ? 0 : 0.6,
      }}
      className="relative mx-auto w-full max-w-[470px] px-4 py-5 lg:px-5"
    >
      <Component />

      <p className="editorial mx-auto mt-8 max-w-sm text-center text-base italic leading-relaxed text-[#7b715a]">
        {ARTIFACT_CAPTIONS[type]}
      </p>
    </motion.div>
  );
}

function ConsequenceDialog({
  open,
  scenario,
  choice,
  choiceIndex,
  actualDeltas,
  onClose,
  onNext,
  reducedMotion,
}) {
  const dialogRef = useRef(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;

      if (
        previousFocus instanceof HTMLElement &&
        previousFocus.isConnected
      ) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="consequence-title"
      aria-describedby="consequence-description"
      onCancel={(event) => {
        event.preventDefault();
        closeRef.current();
      }}
    >
      {open && scenario && choice && (
        <motion.div
          initial={{
            opacity: 0,
            y: reducedMotion ? 0 : 20,
            scale: reducedMotion ? 1 : 0.97,
          }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: reducedMotion ? 0 : 0.28,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="dialog-scroll rounded-2xl border border-[#d4ddca] bg-[#fbfcf5] p-6 shadow-2xl sm:p-9"
        >
          <div className="flex items-start justify-between gap-4">
            <Eyebrow className="pt-2 text-[#7b896a]">
              The trade-off / Decision 0{scenario.id}
            </Eyebrow>

            <button
              type="button"
              onClick={onClose}
              autoFocus
              aria-label="Close feedback"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dce2d3] text-[#78866a] transition-colors hover:bg-[#e9efdf]"
            >
              <Icon name="close" size={18} />
            </button>
          </div>

          <h2
            id="consequence-title"
            className="editorial mt-4 text-3xl leading-tight tracking-tight sm:text-4xl"
          >
            Every choice
            <br />
            protects something.
          </h2>

          <p
            id="consequence-description"
            className="mt-3 text-base leading-relaxed text-[#77816a]"
          >
            You chose {String.fromCharCode(65 + choiceIndex)}.
            Consider what this decision protects and what it costs.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {DIMENSIONS.map((dimension) => {
              const delta = actualDeltas[dimension.key];

              return (
                <span
                  key={dimension.key}
                  className={`rounded-lg border px-3 py-2 text-sm ${
                    delta < 0
                      ? "border-[#e7cdb4] bg-[#f6eadd] text-[#985e37]"
                      : delta > 0
                      ? "border-[#d4dfc7] bg-[#eaf1df] text-[#597443]"
                      : "border-[#e1e4d9] bg-[#f0f2e9] text-[#818a73]"
                  }`}
                >
                  {dimension.label}{" "}
                  <strong>
                    {delta > 0 ? "+" : ""}
                    {delta}
                  </strong>
                </span>
              );
            })}
          </div>

          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            <section>
              <div className="mb-2 flex items-center gap-2 text-[#62804b]">
                <Icon name="check" size={17} />
                <Eyebrow>What it gets right</Eyebrow>
              </div>
              <p className="text-base leading-7 text-[#53644b]">
                {choice.right}
              </p>
            </section>

            <section>
              <div className="mb-2 flex items-center gap-2 text-[#a77b4c]">
                <Icon name="warning" size={16} />
                <Eyebrow>What it misses</Eyebrow>
              </div>
              <p className="text-base leading-7 text-[#68715c]">
                {choice.miss}
              </p>
            </section>
          </div>

          <section className="mt-7 rounded-xl border border-[#d9e2cc] bg-[#eaf0df] p-5 sm:p-6">
            <Eyebrow className="text-[#7c8c67]">
              Keep this in mind
            </Eyebrow>
            <p className="editorial mt-3 text-xl leading-relaxed text-[#42573a] sm:text-2xl">
              {scenario.feedback}
            </p>
          </section>

          <PrimaryButton
            onClick={onNext}
            className="mt-6 w-full"
          >
            {scenario.id === SCENARIOS.length
              ? "See my practice snapshot"
              : "Move to next task"}
          </PrimaryButton>
        </motion.div>
      )}
    </dialog>
  );
}

function Snapshot({ scores, onRestart, reducedMotion }) {
  const highestScore = Math.max(...Object.values(scores));
  const leaders = DIMENSIONS.filter(
    (dimension) => scores[dimension.key] === highestScore
  );
  const needsAttention = DIMENSIONS.filter(
    (dimension) => scores[dimension.key] < 30
  );

  return (
    <section
      className="snapshot mx-auto max-w-6xl py-6 text-center"
      aria-labelledby="snapshot-title"
    >
      <Eyebrow className="text-[#7b856b]">
        Personal AI Practice Snapshot
      </Eyebrow>

      <h2
        id="snapshot-title"
        data-scene-heading
        tabIndex={-1}
        className="snapshot-title editorial mb-8 mt-5 text-4xl leading-[1.08] tracking-[-0.04em] outline-none sm:text-6xl"
      >
        Keep the human.
        <br />
        <em className="font-normal text-[#7b8a69]">
          Carry the learning.
        </em>
      </h2>

      <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-4">
        {leaders.map((dimension, index) => {
          const profile = PROFILES[dimension.key];

          return (
            <motion.article
              key={dimension.key}
              initial={{
                opacity: 0,
                y: reducedMotion ? 0 : 20,
              }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: reducedMotion ? 0 : 0.12 + index * 0.08,
                duration: reducedMotion ? 0 : 0.45,
              }}
              className="profile-card min-w-0 max-w-[470px] flex-[1_1_290px] rounded-2xl border border-[#cdd8bf] bg-[#fcfdf5] p-7 shadow-sm"
            >
              <div
                className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#fcfdf5] text-white ring-1 ring-[#ccd8bd]"
                style={{ backgroundColor: dimension.color }}
              >
                <Icon name={dimension.key} size={29} />
              </div>

              <Eyebrow className="text-[#7f8b71]">
                {leaders.length > 1
                  ? "Shared highest priority"
                  : "Your highest priority"}
                {" · "}
                {dimension.label}
              </Eyebrow>

              <h3 className="editorial mt-4 text-3xl leading-tight">
                {profile.title}
              </h3>

              <p className="mt-4 text-base leading-7 text-[#758168]">
                {profile.description}
              </p>
            </motion.article>
          );
        })}
      </div>

      <p className="mx-auto mt-5 max-w-2xl text-xs leading-6 text-[#7d846f]">
        Based on your final meters. Tied priorities appear together.
        This reflection exercise is not a validated assessment or
        certification. Scores stay between 0 and 100.
      </p>

      {needsAttention.length > 0 && (
        <div
          role="status"
          className="mx-auto mt-5 max-w-2xl rounded-xl border border-[#dfc29f] bg-[#f7ead6] p-4 text-sm leading-6 text-[#8c603d]"
        >
          <strong>Give these priorities another look:</strong>{" "}
          {needsAttention.map((dimension) => dimension.label).join(", ")}.
          Consider which decision you would revisit to protect them.
        </div>
      )}

      <h3 className="editorial mb-6 mt-10 text-2xl">
        Four commitments to take back to work
      </h3>

      <div className="snapshot-grid grid gap-5 text-left sm:grid-cols-2 lg:grid-cols-4">
        {COMMITMENTS.map((commitment, index) => (
          <motion.article
            key={commitment.title}
            initial={{
              opacity: 0,
              y: reducedMotion ? 0 : 24,
              rotate: reducedMotion ? 0 : 0,
            }}
            animate={{
              opacity: 1,
              y: 0,
              rotate: reducedMotion ? 0 : commitment.rotation,
            }}
            transition={{
              delay: reducedMotion ? 0 : 0.3 + index * 0.08,
              duration: reducedMotion ? 0 : 0.45,
            }}
            className="sticky-note relative min-h-[225px] p-6"
            style={{ backgroundColor: commitment.color }}
          >
            <span className="text-xs text-[#788062]">
              0{index + 1}
            </span>

            <h4 className="editorial mt-6 text-xl leading-snug">
              {commitment.title}
            </h4>

            <p className="mt-3 text-base leading-7 text-[#647155]">
              {commitment.body}
            </p>
          </motion.article>
        ))}
      </div>

      <div className="no-print mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <PrimaryButton
          onClick={() => window.print()}
          icon="print"
        >
          Print / save snapshot
        </PrimaryButton>

        <button
          type="button"
          onClick={onRestart}
          className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-[#aab99b] bg-white/30 px-6 py-3.5 text-base transition-colors hover:bg-white/65"
        >
          <Icon name="reset" size={18} />
          Try the decisions again
        </button>
      </div>

      <p className="no-print mt-5 text-xs text-[#828a74]">
        Your responses stay in this session.
      </p>
    </section>
  );
}

export default function App() {
  const reducedMotion = Boolean(useReducedMotion());
  const audio = useProceduralAudio();

  const [step, setStep] = useState(0);
  const [scores, setScores] = useState(() => ({
    ...STARTING_SCORES,
  }));
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [actualDeltas, setActualDeltas] = useState(null);
  const [transitioning, setTransitioning] = useState(false);

  const selectionLock = useRef(false);
  const transitionLock = useRef(false);
  const mainRef = useRef(null);

  const complete = step >= SCENARIOS.length;
  const scenario = complete ? null : SCENARIOS[step];
  const selectedChoice =
    scenario && selectedIndex !== null
      ? scenario.choices[selectedIndex]
      : null;

  const focusScene = () => {
    const heading = mainRef.current?.querySelector(
      "[data-scene-heading]"
    );
    heading?.focus({ preventScroll: true });
  };

  function choose(index) {
    if (
      selectionLock.current ||
      transitionLock.current ||
      complete ||
      selectedIndex !== null
    ) {
      return;
    }

    selectionLock.current = true;

    const choice = scenario.choices[index];
    const nextScores = {};
    const changes = {};

    DIMENSIONS.forEach(({ key }) => {
      nextScores[key] = Math.max(
        0,
        Math.min(100, scores[key] + choice.points[key])
      );
      changes[key] = nextScores[key] - scores[key];
    });

    const crossedDangerThreshold = DIMENSIONS.some(
      ({ key }) => scores[key] >= 30 && nextScores[key] < 30
    );

    setScores(nextScores);
    setActualDeltas(changes);
    setSelectedIndex(index);
    setFeedbackOpen(true);

    audio.play("choice");

    if (crossedDangerThreshold) {
      audio.play("warning");
    }
  }

  function next() {
    if (
      selectedIndex === null ||
      transitionLock.current ||
      complete
    ) {
      return;
    }

    transitionLock.current = true;
    setTransitioning(true);
    setFeedbackOpen(false);

    audio.play(
      step === SCENARIOS.length - 1 ? "complete" : "move"
    );

    setStep((current) => current + 1);
    setSelectedIndex(null);
    setActualDeltas(null);
  }

  function restart() {
    if (transitionLock.current) return;

    transitionLock.current = true;
    setTransitioning(true);
    setFeedbackOpen(false);
    setSelectedIndex(null);
    setActualDeltas(null);
    setScores({ ...STARTING_SCORES });
    setStep(0);

    audio.play("move");
  }

  function handleSceneEntered() {
    const wasTransitioning = transitionLock.current;

    transitionLock.current = false;
    selectionLock.current = false;
    setTransitioning(false);

    if (wasTransitioning) {
      if (window.innerWidth < 1024) {
        mainRef.current?.scrollIntoView({
          behavior: "auto",
          block: "start",
        });
      }

      focusScene();
    }
  }

  const sceneVariants = {
    enter: {
      opacity: 0,
      x: reducedMotion ? 0 : 120,
    },
    center: {
      opacity: 1,
      x: 0,
      transition: {
        duration: reducedMotion ? 0.01 : 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      x: reducedMotion ? 0 : -160,
      transition: {
        duration: reducedMotion ? 0.01 : 0.3,
        ease: [0.55, 0, 1, 0.45],
      },
    },
  };

  return (
    <div className="human-lab min-h-screen">
      <style>{GLOBAL_STYLES}</style>

      <header className="no-print border-b border-[#dde1d3] bg-[#fbfcf6]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="editorial flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#284e3e] pb-1 text-3xl font-bold text-[#faf9e9]">
              h.
            </div>

            <div>
              <p className="editorial text-xl font-semibold tracking-tight sm:text-2xl">
                keep the human
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#829074]">
                The AI Decision Lab
              </p>
            </div>
          </div>

          <div className="flex items-center gap-7">
            <span className="hidden text-xs uppercase tracking-[0.16em] text-[#879178] md:block">
              Educator edition / 01
            </span>

            <button
              type="button"
              onClick={audio.toggle}
              aria-pressed={audio.enabled}
              aria-label={
                audio.enabled
                  ? "Mute ambient music and sound effects"
                  : "Enable ambient music and sound effects"
              }
              title={
                audio.enabled
                  ? "Mute music and sounds"
                  : "Enable music and sounds"
              }
              className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-[#d2dbc6] bg-white/50 px-3 py-2.5 text-sm text-[#6d7b5d] transition-colors hover:bg-[#eaf0e0] sm:px-4"
            >
              <Icon name={audio.enabled ? "sound" : "mute"} />
              <span className="hidden sm:inline">
                Sound {audio.enabled ? "on" : "off"}
              </span>
            </button>
          </div>
        </div>
      </header>

      <section className="no-print mx-auto flex max-w-[1500px] items-center justify-between gap-5 px-5 pb-7 pt-8 sm:px-8 lg:px-12 lg:pt-10">
        <div>
          <Eyebrow className="text-[#889377]">
            Your judgment. Your desk.
          </Eyebrow>

          <h1 className="editorial mt-3 text-3xl leading-tight tracking-[-0.035em] sm:text-4xl lg:text-[44px]">
            {complete
              ? "Take your practice forward."
              : "A little AI. A lot of human judgment."}
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#7b856e]">
            {complete
              ? "Six decisions made. Here is what you chose to protect."
              : "Work through six everyday decisions. Every choice carries a trade-off."}
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-3 sm:flex">
          <span className="editorial text-6xl leading-none tracking-tight">
            {String(Math.min(step + 1, SCENARIOS.length)).padStart(
              2,
              "0"
            )}
          </span>
          <span className="text-xs leading-6 text-[#879179]">
            / 06
            <br />
            {complete ? "complete" : "decisions"}
          </span>
        </div>
      </section>

      <div className="mx-auto max-w-[1500px] px-5 pb-7 sm:px-8 lg:px-12">
        <section
          aria-label="Your practice meters"
          className="meter-panel grid grid-cols-2 gap-y-5 rounded-2xl border border-[#d9e0cc] bg-[#fdfef7] py-5 shadow-[0_3px_10px_#243a3103] md:grid-cols-4 md:divide-x md:divide-[#e1e6d7]"
        >
          {DIMENSIONS.map((dimension) => (
            <Meter
              key={dimension.key}
              dimension={dimension}
              value={scores[dimension.key]}
              delta={
                actualDeltas ? actualDeltas[dimension.key] : null
              }
              reducedMotion={reducedMotion}
            />
          ))}
        </section>

        <p className="sr-only" role="status" aria-live="polite">
          {DIMENSIONS.map(
            (dimension) =>
              `${dimension.label}: ${scores[dimension.key]} out of 100`
          ).join(". ")}
        </p>

        {audio.unavailable && (
          <p
            role="status"
            className="no-print mt-3 text-sm leading-relaxed text-[#96663e]"
          >
            Audio is unavailable in this browser. You can still
            complete every activity.
          </p>
        )}
      </div>

      <main
        ref={mainRef}
        aria-busy={transitioning}
        className="oak-desk relative overflow-hidden border-y border-[#d6cbb6] px-5 py-7 sm:px-8 lg:min-h-[710px] lg:px-12"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#756342]/[0.035] to-transparent"
        />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={complete ? "snapshot" : `scenario-${step}`}
            variants={sceneVariants}
            initial="enter"
            animate="center"
            exit="exit"
            onAnimationComplete={(definition) => {
              if (definition === "center") {
                handleSceneEntered();
              }
            }}
            className="relative mx-auto max-w-[1404px]"
          >
            {complete ? (
              <Snapshot
                scores={scores}
                onRestart={restart}
                reducedMotion={reducedMotion}
              />
            ) : (
              <>
                <div className="mb-7 flex items-center gap-5 text-xs text-[#867e67]">
                  <span className="font-semibold uppercase tracking-[0.18em] text-[#5d6952]">
                    On your desk
                  </span>

                  <span className="uppercase tracking-[0.1em]">
                    0{scenario.id} / {scenario.category}
                  </span>

                  <span className="editorial ml-auto hidden text-base italic sm:block">
                    Pause. Consider. Decide.
                  </span>
                </div>

                <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 xl:gap-20">
                  <section
                    aria-label={`${scenario.title} desk artifact`}
                    className="min-w-0"
                  >
                    <DeskArtifact
                      type={scenario.artifact}
                      reducedMotion={reducedMotion}
                    />
                  </section>

                  <section
                    aria-labelledby={`scenario-title-${scenario.id}`}
                    className="min-w-0 pb-5 lg:py-3"
                  >
                    <Eyebrow className="text-[#8b896d]">
                      The situation
                    </Eyebrow>

                    <h2
                      id={`scenario-title-${scenario.id}`}
                      data-scene-heading
                      tabIndex={-1}
                      className="editorial mt-3 text-3xl leading-tight tracking-[-0.025em] outline-none sm:text-4xl"
                    >
                      {scenario.title}
                    </h2>

                    <p className="mt-4 text-base leading-7 text-[#677059]">
                      {scenario.situation}
                    </p>

                    <div className="mb-3 mt-7 flex items-center justify-between">
                      <h3 className="text-base font-semibold">
                        What would you do?
                      </h3>
                      <span className="text-xs text-[#8d927b]">
                        Choose one
                      </span>
                    </div>

                    <div className="space-y-3">
                      {scenario.choices.map((choice, index) => {
                        const isSelected = selectedIndex === index;
                        const hasSelection = selectedIndex !== null;

                        return (
                          <motion.button
                            key={`${scenario.id}-${index}`}
                            type="button"
                            onClick={() => choose(index)}
                            disabled={hasSelection || transitioning}
                            whileHover={
                              !hasSelection &&
                              !transitioning &&
                              !reducedMotion
                                ? { x: 5, y: -1 }
                                : undefined
                            }
                            whileTap={
                              !hasSelection && !reducedMotion
                                ? { scale: 0.99 }
                                : undefined
                            }
                            transition={{ duration: 0.18 }}
                            className={`group flex w-full items-start gap-3.5 rounded-xl border p-4 text-left text-base leading-relaxed transition-colors sm:p-5 ${
                              isSelected
                                ? "border-[#75925a] bg-[#e8efdc] shadow-sm"
                                : hasSelection
                                ? "border-[#d7dacb] bg-[#fffdf4]/50 text-[#8b937c]"
                                : "border-[#d1d7c1] bg-[#fffef6]/90 shadow-[0_2px_5px_#3b302503] hover:border-[#83996f] hover:bg-[#fffffa]"
                            }`}
                          >
                            <span
                              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium ${
                                isSelected
                                  ? "border-[#345640] bg-[#345640] text-white"
                                  : "border-[#ccd5be] text-[#7d8f6a]"
                              }`}
                            >
                              {String.fromCharCode(65 + index)}
                            </span>

                            <span className="flex-1">
                              {choice.text}
                            </span>

                            <span
                              className={`mt-1 hidden shrink-0 sm:block ${
                                isSelected
                                  ? "text-[#51713c]"
                                  : "text-[#a5b297] group-hover:text-[#627d4e]"
                              }`}
                            >
                              <Icon
                                name={isSelected ? "check" : "arrow"}
                                size={18}
                              />
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>

                    {selectedIndex !== null && !feedbackOpen && (
                      <PrimaryButton
                        onClick={() => setFeedbackOpen(true)}
                        className="mt-5 w-full sm:w-auto"
                      >
                        Review your trade-off
                      </PrimaryButton>
                    )}

                    <p className="mt-4 text-xs leading-6 text-[#8a9078]">
                      Your choice updates the meters. Then explore
                      what it protects and what it costs.
                    </p>
                  </section>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="no-print mx-auto flex max-w-[1500px] flex-wrap items-center justify-center gap-5 px-5 py-6 sm:justify-between sm:px-8 lg:px-12">
        <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-[#7f8b70] sm:block">
          Keep the human
        </span>

        <ol
          aria-label="Progress through the six decisions"
          className="flex list-none items-center gap-2.5 p-0"
        >
          {SCENARIOS.map((item, index) => {
            const finished = complete || index < step;
            const current = !complete && index === step;

            return (
              <li
                key={item.id}
                aria-current={current ? "step" : undefined}
                aria-label={`${item.title}: ${
                  finished
                    ? "completed"
                    : current
                    ? "current decision"
                    : "upcoming"
                }`}
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs ${
                  current
                    ? "border-[#31573f] bg-[#31573f] text-white"
                    : finished
                    ? "border-[#d4dec7] bg-[#e8efdd] text-[#69864e]"
                    : "border-[#dde3d3] text-[#a1ad91]"
                }`}
              >
                {finished ? (
                  <Icon name="check" size={15} />
                ) : (
                  String(index + 1).padStart(2, "0")
                )}
              </li>
            );
          })}
        </ol>

        <p className="hidden text-xs text-[#89967a] lg:block">
          The tool can assist. The judgment stays yours.
        </p>
      </footer>

      <ConsequenceDialog
        open={feedbackOpen}
        scenario={scenario}
        choice={selectedChoice}
        choiceIndex={selectedIndex ?? 0}
        actualDeltas={actualDeltas || STARTING_SCORES}
        onClose={() => setFeedbackOpen(false)}
        onNext={next}
        reducedMotion={reducedMotion}
      />
    </div>
  );
}
```
