

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const DIMENSIONS = [
  { key: "people", label: "People", description: "Relationships & learner support", color: "#55745c" },
  { key: "privacy", label: "Privacy", description: "Data & personal boundaries", color: "#587e93" },
  { key: "quality", label: "Quality", description: "Accuracy & instructional fit", color: "#ac7746" },
  { key: "capacity", label: "Capacity", description: "Time & sustainable workload", color: "#887399" }
];

const STARTING_SCORES = { people: 50, privacy: 50, quality: 50, capacity: 50 };

const PROFILES = {
  people: { title: "The Human-Centric Leader", description: "Your decisions emphasized relationships, learner support, and empathy." },
  privacy: { title: "The Guardian of Trust", description: "Your decisions emphasized protecting information and maintaining clear data boundaries." },
  quality: { title: "The Excellence Architect", description: "Your decisions emphasized accuracy, instructional alignment, and careful human review." },
  capacity: { title: "The Sustainable Strategist", description: "Your decisions emphasized saving time and preserving capacity." }
};

const COMMITMENTS = [
  { title: "I will use AI for:", body: "one low-risk task where it can save time.", color: "#f1e7b0", rotation: -2 },
  { title: "I will protect:", body: "one kind of data or information that should not be casually shared.", color: "#dfe8c9", rotation: 1.6 },
  { title: "I will check:", body: "one quality question before using AI-generated content.", color: "#dce6e7", rotation: -1.2 },
  { title: "I will keep a human in the loop when:", body: "an action affects a person, record, decision, or public communication.", color: "#efdbcc", rotation: 2 }
];

const SCENARIOS = [
  {
    id: 1,
    title: "1. The Helpful Lesson Plan",
    artifact: "tablet",
    situation: "It is late afternoon. A teacher asks an AI assistant for a 15-minute small-group phonics activity on the /sh/ sound. The draft is polished and includes engaging pictures, but one suggested word does not contain the target sound and the activity asks children to guess words from pictures before teaching the sound-spelling relationship. Several learners need clear, explicit instruction and language supports.",
    choices: [
      { text: "A. Fix the incorrect word, keep the activity largely as written, and note the instructional concern for a future revision.", points: { people: 0, privacy: 0, quality: -10, capacity: 15 }, right: "Protects capacity and corrects the visible factual error.", miss: "Leaves an instructional approach in place that may not match learning goals." },
      { text: "B. Ask AI for three new versions, select the one that sounds clearest, and do a quick final review before tomorrow.", points: { people: 0, privacy: 0, quality: -5, capacity: 5 }, right: "Invites alternatives and includes some human review.", miss: "Treats fluency and polish as a substitute for checking instructional alignment." },
      { text: "C. Use the draft only as a starting point, check it against the existing scope and sequence, revise the examples and language supports, and keep only the pieces that fit.", points: { people: 10, privacy: 0, quality: 20, capacity: -15 }, right: "Balances capacity with accuracy, explicit instruction, and learner fit.", miss: "Takes a little more preparation time." }
    ],
    feedback: "AI can help you start faster. It cannot decide whether an activity matches your instructional sequence, evidence-based approach, or the learners in front of you."
  },
  {
    id: 2,
    title: "2. The Private Notes",
    artifact: "folder",
    situation: "A colleague has several pages of observation notes about a child’s classroom behavior and wants AI to turn them into a concise family-conference summary. The notes include the child’s name, family details, and descriptions of difficult moments. The school has an approved AI tool, but the team has not yet clarified whether this use is permitted.",
    choices: [
      { text: "A. Replace the child’s name with initials, paste the notes into the tool, and review the summary carefully before using it.", points: { people: 5, privacy: -15, quality: 5, capacity: 10 }, right: "Attempts to reduce identifying information and preserves final review.", miss: "Initials and rich context can still identify a child; approved-use question remains open." },
      { text: "B. Use the approved AI tool because the organization has already vetted the vendor, then edit the output for tone and accuracy.", points: { people: 0, privacy: -10, quality: 10, capacity: 10 }, right: "Recognizes that approved tools are safer than unapproved tools.", miss: "Approval of a tool does not automatically approve every sensitive use case." },
      { text: "C. Pause before sharing notes, confirm the organization’s data rules for this use, and create a brief, de-identified pattern summary.", points: { people: 15, privacy: 20, quality: 15, capacity: -10 }, right: "Protects privacy while still working toward a useful family conversation.", miss: "Requires a deliberate check instead of an immediate shortcut." }
    ],
    feedback: "The question is not only whether a tool is approved. It is whether this information, this purpose, and this workflow are approved."
  },
  {
    id: 3,
    title: "3. The Quick Family Message",
    artifact: "clipboard",
    situation: "After a difficult day, a teacher needs to send a family a short update before dismissal. AI produces a warm, polished message, but it softens the concern so much that the family may not understand what happened or what support is needed next.",
    choices: [
      { text: "A. Send the AI draft after correcting the student’s name and date, because a calm message is better than a rushed one.", points: { people: -15, privacy: 0, quality: -10, capacity: 15 }, right: "Values a respectful tone and reduces immediate workload.", miss: "Risks vague communication that does not give an accurate, useful picture." },
      { text: "B. Give AI only a general, non-identifying description, use the draft for structure, then add the specific facts, professional context, and next steps.", points: { people: 15, privacy: 5, quality: 15, capacity: -5 }, right: "Uses AI to reduce blank-page pressure while preserving truthful, human communication.", miss: "Requires the teacher to slow down long enough to rewrite rather than merely proofread." },
      { text: "C. Write every message from scratch so the family knows the communication is fully personal.", points: { people: 10, privacy: 0, quality: 15, capacity: -20 }, right: "Prioritizes absolute authenticity and avoids AI-related structural errors.", miss: "May create an unsustainable workload when AI could safely support a low-risk first draft." }
    ],
    feedback: "A responsible use of AI can save time without outsourcing the relationship. Let AI help with structure, then add the facts, context, and professional voice only you can provide."
  },
  {
    id: 4,
    title: "4. The Perfect Resource",
    artifact: "paper",
    situation: "A free AI tool generates a visually appealing reading resource for a classroom. It looks engaging and is roughly on-topic, but the examples assume background knowledge some learners do not share, the reading load is uneven, and there is no obvious accessibility check.",
    choices: [
      { text: "A. Share it with a note that teachers should adapt it for their own students.", points: { people: -5, privacy: 0, quality: -15, capacity: 15 }, right: "Acknowledges that adaptation matters and preserves access to a useful-looking layout.", miss: "Shifts the quality-control burden completely to the individuals who need support." },
      { text: "B. Ask AI to lower the reading level and generate a more inclusive version, then distribute the revised resource.", points: { people: 5, privacy: 0, quality: -5, capacity: 5 }, right: "Addresses immediate readability concerns and actively invites a rapid revision.", miss: "A smoother revision may still contain inaccurate, biased, or poorly aligned content." },
      { text: "C. Review the resource for instructional fit, accuracy, representation, and accessibility; then revise, pilot, or reject it.", points: { people: 15, privacy: 0, quality: 20, capacity: -15 }, right: "Treats resource quality as more than surface polish and fully protects learners.", miss: "Takes deep professional judgment and means letting go of a quick, promising layout." }
    ],
    feedback: "Generated resources can look finished before they are ready. Quality includes accuracy, access, representation, and fit, not just attractive design."
  },
  {
    id: 5,
    title: "5. The Pressure to Adopt",
    artifact: "planner",
    situation: "A leader announces that an AI feature is available and says the team should begin using it next week to show innovation. It could help with planning, but no one has clarified the instructional problem it solves, the data it accesses, or how success will be measured.",
    choices: [
      { text: "A. Encourage everyone to try it for a month and collect feedback afterward.", points: { people: 5, privacy: -10, quality: -5, capacity: 10 }, right: "Respects staff agency and creates a dynamic chance to learn directly from active use.", miss: "Starts widespread adoption before guardrails, core purpose, and data boundaries are clear." },
      { text: "B. Decline to participate until the organization has a fully developed, long-term AI policy.", points: { people: -5, privacy: 15, quality: 5, capacity: -5 }, right: "Protects against rushed adoption and signals highly appropriate professional caution.", miss: "Can turn a necessary question into an indefinite pause, stalling safe learning opportunities." },

{ text: "C. Recommend a small, opt-in pilot after the team defines the problem, approved uses, data boundaries, and human-review criteria.", points: { people: 15, privacy: 15, quality: 15, capacity: -5 }, right: "Makes calculated room for innovation while protecting people, privacy, and quality.", miss: "Requires leaders to slow down and make decisions explicitly clear up front." }
],
feedback: "A confident ‘not yet’ is not resistance to innovation. It is a request for a purpose, a boundary, and a way to learn whether the tool actually helps."
},
{
id: 6,
title: "6. The Agent with Access",
artifact: "monitor",
situation: "An AI assistant promises to organize meetings and draft follow-up notes if it can connect to a professional’s email, calendar, and shared-drive files. The platform offers a convenient one-click connection and says the user can turn off sending permissions.",
choices: [
{ text: "A. Connect the real accounts with send permissions turned off, then review the assistant’s suggestions before acting.", points: { people: 0, privacy: -15, quality: 5, capacity: 15 }, right: "Keeps a human in the final sending step and limits active automated messaging risks.", miss: "Read access alone can still expose sensitive internal messages, calendars, and secure records." },
{ text: "B. Avoid the assistant completely because any connection to work systems creates too much risk.", points: { people: 0, privacy: 20, quality: 0, capacity: -15 }, right: "Strongly protects overall privacy infrastructure and prevents unauthorized background reading.", miss: "Gives up the chance to evaluate whether a tightly bounded use could safely reduce workloads." },
{ text: "C. Test the assistant with a sandbox or limited, non-sensitive account first, granting only the absolute minimum access needed.", points: { people: 10, privacy: 15, quality: 10, capacity: -5 }, right: "Applies least-access thinking and lets the professional evaluate value safely.", miss: "Requires a more deliberate evaluation process and manual account setup." }
],
feedback: "Convenience is not a reason to grant broad access. Start small, define the task, limit the data, and keep a person responsible for the final outcome."
}
];
export default function App() {
const [scores, setScores] = useState(STARTING_SCORES);
const [currentIndex, setCurrentIndex] = useState(0);
const [selectedChoice, setSelectedChoice] = useState(null);
const [showOverlay, setShowOverlay] = useState(false);
const [audioMuted, setAudioMuted] = useState(true);
const audioCtxRef = useRef(null);
const musicOscRef = useRef(null);
const initAudio = () => {
if (!audioCtxRef.current) {
audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
}
if (audioCtxRef.current.state === "suspended") {
audioCtxRef.current.resume();
}
};
const playSound = (type) => {
if (audioMuted) return;
initAudio();
const ctx = audioCtxRef.current;
const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.connect(gain);
gain.connect(ctx.destination);
if (type === "click") {
osc.type = "sine";
osc.frequency.setValueAtTime(580, ctx.currentTime);
gain.gain.setValueAtTime(0.1, ctx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
osc.start();
osc.stop(ctx.currentTime + 0.1);
} else if (type === "whoosh") {
osc.type = "triangle";
osc.frequency.setValueAtTime(150, ctx.currentTime);
osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.4);
gain.gain.setValueAtTime(0.15, ctx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
osc.start();
osc.stop(ctx.currentTime + 0.4);
} else if (type === "warning") {
osc.type = "sawtooth";
osc.frequency.setValueAtTime(220, ctx.currentTime);
gain.gain.setValueAtTime(0.08, ctx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
osc.start();
osc.stop(ctx.currentTime + 0.3);
} else if (type === "complete") {
osc.type = "sine";
osc.frequency.setValueAtTime(440, ctx.currentTime);
osc.frequency.setValueAtTime(554, ctx.currentTime + 0.1);
osc.frequency.setValueAtTime(659, ctx.currentTime + 0.2);
gain.gain.setValueAtTime(0.12, ctx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
osc.start();
osc.stop(ctx.currentTime + 0.5);
}
};
useEffect(() => {
if (!audioMuted) {
initAudio();
const ctx = audioCtxRef.current;
const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.type = "sine";
osc.frequency.setValueAtTime(110, ctx.currentTime);
gain.gain.setValueAtTime(0.03, ctx.currentTime);
osc.connect(gain);
gain.connect(ctx.destination);
osc.start();
musicOscRef.current = osc;
} else {
if (musicOscRef.current) {
try { musicOscRef.current.stop(); } catch(e){}
musicOscRef.current = null;
}
}
return () => {
if (musicOscRef.current) {
try { musicOscRef.current.stop(); } catch(e){}
}
};
}, [audioMuted]);
const handleChoice = (choice) => {
setSelectedChoice(choice);
playSound("click");
setScores(prev => {
const next = { ...prev };
let dynamicWarning = false;
Object.keys(choice.points).forEach(k => {
next[k] = Math.max(0, Math.min(100, next[k] + choice.points[k]));
if (next[k] < 30) dynamicWarning = true;
});
if (dynamicWarning) playSound("warning");
return next;
});
setShowOverlay(true);
};
const handleNext = () => {
setShowOverlay(false);
setSelectedChoice(null);
if (currentIndex < SCENARIOS.length - 1) {
playSound("whoosh");
setCurrentIndex(prev => prev + 1);
} else {
playSound("complete");
setCurrentIndex(SCENARIOS.length);
}
};
const getArchetype = () => {
let highestKey = "people";
let highestVal = scores.people;
DIMENSIONS.forEach(d => {
if (scores[d.key] > highestVal) {
highestVal = scores[d.key];
highestKey = d.key;
}
});
return PROFILES[highestKey];
};
const currentScenario = SCENARIOS[currentIndex];
const isFinished = currentIndex >= SCENARIOS.length;
const archetype = isFinished ? getArchetype() : null;
return (
Keep the Human
The AI Decision Lab for Educators

<button
onClick={() => setAudioMuted(!audioMuted)}
className="p-2 rounded-full hover:bg-stone-200/70 border border-stone-300/80 transition-colors"
>
{audioMuted ? (

) : (

)}

{showOverlay && selectedChoice && (
<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50"
>
<motion.div
initial={{ scale: 0.95, y: 30 }}
animate={{ scale: 1, y: 0 }}
exit={{ scale: 0.95, y: 30 }}
className="bg-white max-w-xl w-full p-6 rounded-2xl shadow-xl border border-stone-200 text-left flex flex-col gap-4"
>

Trade-Off Analysis Matrix
What It Gets Right
{selectedChoice.right}


What It Misses
{selectedChoice.miss}

Instructional Insight
{currentScenario.feedback}
{currentIndex === SCENARIOS.length - 1 ? "Complete Lab Evaluation" : "Move to Next Task →"}

</motion.div>
</motion.div>
)}
Dashboard compiled via Web Audio and Native Core Elements. Zero external data calls tracking parameters.
Keep the Human Loop Operational © 2026


);
}


