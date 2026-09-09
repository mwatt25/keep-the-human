// Complete App.jsx. Requires react and framer-motion. All custom styles are included.
"use client";
import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
const scenarios = [
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
    situation: "A colleague has several pages of observation notes about a child\u2019s classroom behavior and wants AI to turn them into a concise family-conference summary. The notes include the child\u2019s name, family details, and descriptions of difficult moments. The school has an approved AI tool, but the team has not yet clarified whether this use is permitted.",
    choices: [
      { text: "A. Replace the child\u2019s name with initials, paste the notes into the tool, and review the summary carefully before using it.", points: { people: 5, privacy: -15, quality: 5, capacity: 10 }, right: "Attempts to reduce identifying information and preserves final review.", miss: "Initials and rich context can still identify a child; approved-use question remains open." },
      { text: "B. Use the approved AI tool because the organization has already vetted the vendor, then edit the output for tone and accuracy.", points: { people: 0, privacy: -10, quality: 10, capacity: 10 }, right: "Recognizes that approved tools are safer than unapproved tools.", miss: "Approval of a tool does not automatically approve every sensitive use case." },
      { text: "C. Pause before sharing notes, confirm the organization\u2019s data rules for this use, and create a brief, de-identified pattern summary.", points: { people: 15, privacy: 20, quality: 15, capacity: -10 }, right: "Protects privacy while still working toward a useful family conversation.", miss: "Requires a deliberate check instead of an immediate shortcut." }
    ],
    feedback: "The question is not only whether a tool is approved. It is whether this information, this purpose, and this workflow are approved."
  },
  {
    id: 3,
    title: "3. The Quick Family Message",
    artifact: "clipboard",
    situation: "After a difficult day, a teacher needs to send a family a short update before dismissal. AI produces a warm, polished message, but it softens the concern so much that the family may not understand what happened or what support is needed next.",
    choices: [
      { text: "A. Send the AI draft after correcting the student\u2019s name and date, because a calm message is better than a rushed one.", points: { people: -15, privacy: 0, quality: -10, capacity: 15 }, right: "Values a respectful tone and reduces immediate workload.", miss: "Risks vague communication that does not give an accurate, useful picture." },
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
    feedback: "A confident \u2018not yet\u2019 is not resistance to innovation. It is a request for a purpose, a boundary, and a way to learn whether the tool actually helps."
  },
  {
    id: 6,
    title: "6. The Agent with Access",
    artifact: "monitor",
    situation: "An AI assistant promises to organize meetings and draft follow-up notes if it can connect to a professional\u2019s email, calendar, and shared-drive files. The platform offers a convenient one-click connection and says the user can turn off sending permissions.",
    choices: [
      { text: "A. Connect the real accounts with send permissions turned off, then review the assistant\u2019s suggestions before acting.", points: { people: 0, privacy: -15, quality: 5, capacity: 15 }, right: "Keeps a human in the final sending step and limits active automated messaging risks.", miss: "Read access alone can still expose sensitive internal messages, calendars, and secure records." },
      { text: "B. Avoid the assistant completely because any connection to work systems creates too much risk.", points: { people: 0, privacy: 20, quality: 0, capacity: -15 }, right: "Strongly protects overall privacy infrastructure and prevents unauthorized background reading.", miss: "Gives up the chance to evaluate whether a tightly bounded use could safely reduce workloads." },
      { text: "C. Test the assistant with a sandbox or limited, non-sensitive account first, granting only the absolute minimum access needed.", points: { people: 10, privacy: 15, quality: 10, capacity: -5 }, right: "Applies least-access thinking and lets the professional evaluate value safely.", miss: "Requires a more deliberate evaluation process and manual account setup." }
    ],
    feedback: "Convenience is not a reason to grant broad access. Start small, define the task, limit the data, and keep a person responsible for the final outcome."
  }
];
const APP_STYLES = "body{margin:0;color:#20372f;font-family:Arial,Helvetica,sans-serif;background:#f7f4ec}button,a{-webkit-tap-highlight-color:transparent}button{cursor:pointer}button:focus-visible,a:focus-visible{outline:3px solid #bd673d;outline-offset:4px}button:disabled{cursor:default}h1,h2,h3,h4,p{margin:0}.lab{min-height:100vh}.masthead{height:94px;padding:0 5%;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #dcded3;background:#fbfaf5}.wordmark{display:flex;align-items:center;gap:12px;color:inherit;text-decoration:none;font-family:Georgia,serif;font-size:24px;font-weight:bold;letter-spacing:-.6px}.brand-mark{background:#244b3e;color:#faf6e9;border-radius:50%;width:46px;height:46px;display:grid;place-items:center;font-size:34px;padding-bottom:6px}.brand-sub{display:block;font-family:Arial,sans-serif;font-size:10px;letter-spacing:2px;margin-top:5px}.header-right{display:flex;align-items:center;gap:32px}.edition{font-size:12px;letter-spacing:1.6px;color:#63716b}.audio-btn{display:flex;align-items:center;gap:9px;background:none;border:1px solid #cdd3c9;padding:11px 15px;border-radius:30px;font-size:14px}.lab-top{padding:32px 5% 28px;display:flex;align-items:center;justify-content:space-between;gap:24px}.eyebrow{font-size:12px;letter-spacing:1.7px;font-weight:700;color:#687365}h1{font-family:Georgia,serif;font-size:clamp(27px,2.7vw,43px);font-weight:400;letter-spacing:-1.2px;margin:10px 0}.intro{font-size:16px;color:#647064;line-height:1.5}.session-counter{display:flex;align-items:center;gap:12px}.session-counter strong{font-size:52px;font-family:Georgia,serif;font-weight:400}.session-counter>span{font-size:13px;color:#647064;line-height:1.8}.meter-strip{display:grid;grid-template-columns:repeat(4,1fr);margin:0 5% 28px;border:1px solid #d9ddd1;border-radius:12px;background:#fffdf7;padding:20px 6px}.meter{padding:0 24px;border-right:1px solid #e4e6dd;--meter-color:#547762}.meter:last-child{border:0}.privacy{--meter-color:#688292}.quality{--meter-color:#ab7955}.capacity{--meter-color:#8c829b}.meter-label{display:flex;justify-content:space-between;font-size:14px;margin-bottom:11px;gap:8px}.meter-label strong{font-weight:600}.meter-label small{font-size:12px;font-weight:400;color:#7a8177}.meter [data-slot=progress]{height:5px;background:#eceee6}.meter [data-slot=progress-indicator]{background:var(--meter-color);transition:transform .6s}.meter-detail{display:block;font-size:12px;color:#667164;margin-top:10px}.danger{--meter-color:#a63731}.danger [data-slot=progress]{animation:caution 1.8s ease-in-out infinite}.danger .meter-detail{color:#a63731;font-weight:700}@keyframes caution{50%{box-shadow:0 0 0 5px #ae46331a}}\n.desk{background-color:#eae1cf;background-image:repeating-linear-gradient(2deg,transparent 0px,transparent 17px,#c9ad7f08 18px,transparent 20px),linear-gradient(100deg,#ece4d5,#f2ecdf 43%,#e9dfcc);padding:22px 5% 38px;border-top:1px solid #dcd3c1;border-bottom:1px solid #dcd3c1;overflow:hidden;min-height:640px}.task-line{display:flex;align-items:center;gap:26px;font-size:11px;letter-spacing:1.5px;color:#6f7464;margin-bottom:30px}.task-line>span:first-child{font-weight:bold;color:#394d3f}.task-line-right{margin-left:auto;letter-spacing:0;font-family:Georgia,serif;font-style:italic;font-size:15px}.workspace{display:grid;grid-template-columns:minmax(0,.92fr) minmax(0,1.08fr);gap:7%;align-items:center;max-width:1400px;margin:auto}.artifact-zone{padding:20px 12px 8px;min-width:0}.artifact{background:#fafaf5;box-shadow:0 24px 35px -17px #443b305e;border:1px solid #d2cfc3}.artifact-chrome{display:flex;justify-content:space-between;align-items:center;padding:15px 22px;font-size:10px;letter-spacing:1.4px;color:#727c71;border-bottom:1px solid #e5e8df}.artifact-content{padding:28px}.tablet{border:11px solid #303733;border-radius:28px;transform:rotate(-2deg);outline:1px solid #7f8277}.tablet .artifact-chrome{border-radius:17px 17px 0 0}.artifact-tag{display:inline-block;font-size:11px;padding:7px 9px;background:#e9ede2;color:#546749;border-radius:4px}.artifact h2{font-family:Georgia,serif;font-size:clamp(28px,2.6vw,40px);font-weight:400;letter-spacing:-1px;line-height:1.1;margin:23px 0 13px;max-width:350px}.artifact-sub{font-size:12px;color:#777d73;line-height:1.5}.artifact-body{margin:25px 0 20px}.artifact-body>div{display:flex;align-items:baseline;gap:13px;padding:14px 0;border-bottom:1px solid #e3e6dd;font-size:15px;line-height:1.6}.artifact-number{font-size:11px;color:#8a9688}.artifact-note{font-family:Georgia,serif;font-size:16px;line-height:1.5;font-style:italic;color:#6b755f;border-left:2px solid #b7bb98;padding-left:13px}.desk-caption{text-align:center;font-family:Georgia,serif;font-style:italic;font-size:14px;color:#776f5c;margin:27px 10px 0;line-height:1.5}.folder{background:#ead09b;border-radius:0 10px 10px 10px;padding:14px 10px 10px;transform:rotate(-2deg);border-top:14px solid #cbb175}.folder .artifact-content{background:#fffdf5;margin:10px}.folder .artifact-chrome{border:0;color:#615431}.clipboard{border:15px solid #ac845a;border-top:28px solid #ac845a;border-radius:12px;transform:rotate(1deg)}.clipboard .artifact-chrome{background:#ddd9ce;color:#434e43}.paper{transform:rotate(-3deg);border-radius:1px;box-shadow:2px 3px 0 #f7f3e6,4px 5px 0 #d6ccba,0 22px 30px -20px #443b3070}.planner{border:8px solid #384844;border-radius:20px;transform:rotate(-1deg)}.planner .artifact-chrome{background:#244b3e;color:#faf8eb}.planner .artifact-body>div{background:#eef1e8;border-radius:5px;margin:8px 0;padding:12px}.monitor{border:10px solid #303733;border-bottom:24px solid #303733;border-radius:10px}.permission-foot{display:flex;justify-content:space-between;font-size:13px;margin-top:23px;padding:12px;background:#eef0e9}.decision h2{font-family:Georgia,serif;font-weight:400;font-size:34px;letter-spacing:-.7px;margin:10px 0 16px;outline:0}.situation{font-size:15px;line-height:1.75;color:#4f5c50}.choice-heading{display:flex;align-items:center;justify-content:space-between;margin:25px 0 13px}.choice-heading h3{font-size:16px}.choice-heading>span{font-size:12px;color:#777c6d}.choices{display:grid;gap:10px}.choice{display:flex;text-align:left;gap:14px;align-items:center;background:#fffdf6d9;border:1px solid #d0d3c2;border-radius:9px;padding:16px 17px;color:#36493b;font-size:14px;line-height:1.5;transition:background .2s,border-color .2s,transform .2s;width:100%}.choice:not(:disabled):hover{background:#fffef9;border-color:#557563;transform:translateX(4px)}.choice-letter{width:29px;height:29px;display:grid;place-items:center;flex-shrink:0;border:1px solid #ced4c4;border-radius:50%;font-size:12px;color:#6b7b66}.choice-end{margin-left:auto;opacity:.45;flex-shrink:0}.choice.selected{background:#e4ebdb;border-color:#547762}.choice.selected .choice-letter{background:#244b3e;color:white;border-color:#244b3e}.choice:disabled:not(.selected){opacity:.6}.decision-note{font-size:12px;color:#74806c;line-height:1.6;margin-top:17px}.primary{display:flex;justify-content:center;align-items:center;gap:20px;background:#244b3e;color:#fffdf3;padding:15px 23px;border:0;border-radius:7px;font-size:15px}.primary:hover{background:#163a2e}.secondary{padding:14px 20px;font-size:14px;background:transparent;border:1px solid #aab7a1;border-radius:7px}.review-btn{margin-top:18px}.footer{display:flex;align-items:center;justify-content:space-between;padding:24px 5%;gap:20px}.footer>span:first-child{font-size:11px;letter-spacing:1.8px;font-weight:700}.footer ol{display:flex;gap:12px;padding:0;margin:0;list-style:none}.footer li>span:first-child{width:29px;height:29px;border:1px solid #d7dbd0;border-radius:50%;font-size:10px;color:#8e9688;display:grid;place-items:center}.footer li.current>span:first-child{background:#244b3e;color:white;border-color:#244b3e}.footer li.complete>span:first-child{background:#e5ebdf;color:#244b3e}.footer li svg{width:15px}.footer-note{font-size:12px;color:#75806e}.consequence{background:#fcfbf5;padding:32px;border:1px solid #d2dacb;border-radius:15px;max-height:90dvh;overflow-y:auto;gap:16px}.consequence-title{font-family:Georgia,serif;font-size:31px;line-height:1.15;font-weight:400;letter-spacing:-.6px;margin-right:10px}.consequence-desc{color:#677262;font-size:14px;line-height:1.5}.impact-chips{display:flex;gap:8px;flex-wrap:wrap}.impact-chips>span{font-size:12px;background:#e7eddf;padding:8px 12px;border-radius:5px}.impact-chips .negative{background:#f3e6da;color:#8c5636}.feedback-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin:9px 0}.feedback-label{font-size:11px;letter-spacing:1.3px;font-weight:700;color:#6f795f}.feedback-grid p{font-size:15px;line-height:1.65;margin-top:8px}.learning{padding:21px;background:#e9eedf;border-radius:8px}.learning p{font-family:Georgia,serif;font-size:21px;line-height:1.5;margin-top:9px}.next-btn{margin-top:8px}.snapshot{max-width:1080px;margin:20px auto;text-align:center}.snapshot>h2{font-family:Georgia,serif;font-size:clamp(35px,4.5vw,61px);font-weight:400;line-height:1.13;letter-spacing:-2px;margin:22px 0;outline:0}.snapshot>h2 em{color:#708064;font-weight:400}.badge-row{display:flex;flex-wrap:wrap;justify-content:center;gap:16px}.archetype{max-width:470px;flex:1;min-width:250px;background:#fbfcf3;border:1px solid #c8d2bc;padding:26px;border-radius:12px}.profile-seal{width:44px;height:44px;background:#244b3e;color:white;border-radius:50%;display:grid;place-items:center;margin:0 auto 16px}.archetype h3{font-family:Georgia,serif;font-size:27px;margin:13px 0}.archetype>p:last-child{font-size:15px;line-height:1.7;color:#66735d}.snapshot-note{font-size:12px;line-height:1.6;max-width:650px;margin:16px auto 26px;color:#737969}.commitment-heading{font-family:Georgia,serif;font-size:24px;font-weight:400;margin:30px 0 23px}.commitments{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;text-align:left}.sticky{background:#ede7b9;padding:23px 20px;box-shadow:0 10px 15px -12px #5d5b3b77;transform:rotate(-1deg)}.sticky-1{background:#e4eaca;transform:rotate(2deg)}.sticky-2{background:#e3e7e5;transform:rotate(-2deg)}.sticky-3{background:#eadbcb;transform:rotate(1deg)}.sticky>span{font-size:12px;opacity:.6}.sticky h4{font-family:Georgia,serif;font-size:20px;font-weight:400;margin:22px 0 12px;line-height:1.3}.sticky p{font-size:14px;line-height:1.7}.snapshot-actions{display:flex;justify-content:center;gap:16px;margin-top:36px}.attention{background:#f9e6d8;color:#7b462f;padding:16px;border-radius:6px;font-size:14px;line-height:1.6}.audio-error{padding:10px 5%;font-size:14px}\n@media(min-width:1600px){.lab-top,.meter-strip{max-width:1440px;margin-left:auto;margin-right:auto}.lab-top{padding-left:0;padding-right:0}}\n@media(max-width:1000px){.workspace{gap:4%;grid-template-columns:1fr 1.1fr}.artifact-content{padding:20px}.artifact-zone{padding:10px 0}.meter{padding:0 16px}.edition{display:none}.decision h2{font-size:28px}.choice{padding:13px;gap:10px}.choice-end{display:none}.footer-note{display:none}.commitments{grid-template-columns:1fr 1fr}}\n@media(max-width:760px){.masthead{height:80px}.wordmark{font-size:20px}.brand-mark{width:38px;height:38px;font-size:28px}.brand-sub{font-size:8px;letter-spacing:1.6px}.audio-btn{padding:10px}.audio-btn>span{display:none}.lab-top{padding-top:25px;align-items:flex-start}.session-counter{display:none}.meter-strip{grid-template-columns:1fr 1fr;gap:20px 0;padding:18px 0}.meter:nth-child(2){border:0}.meter-detail{font-size:11px}.workspace{grid-template-columns:1fr;gap:25px}.artifact-zone{max-width:420px;width:100%;margin:auto;padding:0 12px}.artifact-content{padding:20px}.artifact h2{font-size:31px;margin:16px 0 10px}.artifact-body{margin:16px 0}.artifact-body>div{padding:9px 0}.artifact-note{font-size:14px}.desk-caption{margin-top:20px}.task-line{font-size:10px;gap:14px;margin-bottom:24px}.task-line-right{display:none}.decision h2{font-size:32px}.situation{font-size:16px}.choice{font-size:15px;padding:16px}.footer{flex-wrap:wrap;justify-content:center}.footer>span:first-child{display:none}.consequence{padding:25px 20px}.consequence-title{font-size:27px}.feedback-grid{gap:18px}.snapshot-actions{flex-direction:column}.sticky{padding:20px 16px}.sticky h4{font-size:19px}.commitments{gap:12px}.snapshot>h2{letter-spacing:-1px}}\n@media(max-width:400px){.feedback-grid,.commitments{grid-template-columns:1fr}.meter-label{font-size:13px}.header-right{gap:0}}\n@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}\n@media print{.masthead,.lab-top,.footer,.snapshot-actions,.decision-note,.audio-error{display:none!important}.desk{background:white;padding:0;border:0;min-height:0}.meter-strip{margin:0 0 20px;break-inside:avoid}.snapshot{margin:0}.snapshot>h2{font-size:34px}.snapshot .archetype,.sticky{break-inside:avoid}.commitments{grid-template-columns:repeat(4,1fr)}.sticky{transform:none;box-shadow:none}.lab{min-height:0}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}\n\n/* Reset the default Vite starter styles without requiring another file. */\nhtml { min-width:320px; background:#f7f4ec; }\nbody { margin:0; min-width:320px; min-height:100vh; display:block; }\n#root { margin:0; padding:0; max-width:none; width:100%; text-align:left; }\n.lab { width:100%; font-size:16px; line-height:1.5; color-scheme:light; }\n.lab *, .lab *::before, .lab *::after { box-sizing:border-box; }\n.lab button { font-family:inherit; }\n.lab svg { display:block; flex-shrink:0; }\n.lab h1,.lab h2,.lab h3,.lab h4 { color:inherit; }\n.lab .sr-only {position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}\n.lab .feedback-dialog { margin:auto;padding:0;border:0;width:min(660px,calc(100vw - 28px));max-width:none;max-height:90dvh;background:transparent;color:#20372f;overflow:visible; }\n.lab .feedback-dialog::backdrop {background:#17291fc4;backdrop-filter:blur(7px);}\n.lab .feedback-dialog .consequence {position:relative;width:100%;max-height:88dvh;overflow-y:auto;display:grid;gap:18px;box-shadow:0 30px 90px #14241f55;}\n.lab .feedback-close {position:absolute;right:15px;top:12px;width:34px;height:34px;display:grid;place-items:center;padding:0;border:1px solid #d2dacb;border-radius:50%;background:#f8faf1;color:#456043;font-size:23px;}\n.lab .consequence>.eyebrow {padding-right:28px;}\n.lab .consequence-title {margin-right:24px;}\n.lab .situation,.lab .choice,.lab .artifact-body>div {font-size:16px;}\n.lab .folder {position:relative;margin-top:24px;}\n.lab .folder::before {content:'';position:absolute;left:-1px;top:-37px;width:42%;height:24px;border-radius:12px 12px 0 0;background:#cbb175;}\n.lab .clipboard {position:relative;}\n.lab .clipboard::before {content:'';position:absolute;left:50%;top:-43px;transform:translateX(-50%);width:118px;height:30px;border:1px solid #81887a;border-radius:5px;background:linear-gradient(90deg,#929c8c,#e7eade 22%,#aab29f 50%,#e7eade 80%,#929c8c);box-shadow:0 4px 5px #20372f33;}\n.lab .monitor {position:relative;margin-bottom:68px;}\n.lab .monitor::before {content:'';position:absolute;width:58px;height:50px;left:50%;bottom:-71px;transform:translateX(-50%);background:linear-gradient(90deg,#858f80,#b9c0b2,#858f80);}\n.lab .monitor::after {content:'';position:absolute;width:145px;height:11px;border-radius:50%;left:50%;bottom:-76px;transform:translateX(-50%);background:#949f8c;box-shadow:0 5px 6px #20372f25;}\n.lab .artifact-chrome>span:first-child {font-size:12px;}\n.lab .snapshot-actions button,.lab .audio-btn {line-height:1.4;}\n@media print {.lab .feedback-dialog {display:none!important;}}\n";
const dimensions = ["people", "privacy", "quality", "capacity"];
const names = { people: "People", privacy: "Privacy", quality: "Quality", capacity: "Capacity" };
const details = { people: "Relationships & learner support", privacy: "Data & personal boundaries", quality: "Accuracy & instructional fit", capacity: "Time & sustainable workload" };
const profiles = { people: ["The Human-Centric Leader", "Your choices emphasized relationships, learner support, and empathy."], privacy: ["The Guardian of Trust", "Your choices emphasized data boundaries and careful access."], quality: ["The Excellence Architect", "Your choices emphasized accuracy and instructional alignment."], capacity: ["The Sustainable Strategist", "Your choices emphasized saving time. Consider where that efficiency needs stronger safeguards."] };
const initial = () => ({ people: 50, privacy: 50, quality: 50, capacity: 50 });
const artifacts = [
  { label: "LESSON STUDIO", tag: "AI draft \xB7 review pending", heading: "Small group. Big possibilities.", sub: "15 minutes / Phonics / The /sh/ sound", body: ["1. Look at the pictures and guess each word.", "2. Say the words: ship, shop, sun.", "3. Circle the words with /sh/."], note: "Does a polished draft make a sound lesson?" },
  { label: "FAMILY CONFERENCE", tag: "Confidential \xB7 observation notes", heading: "A clearer picture of a child.", sub: "Classroom observations / Summary requested", body: ["Classroom behavior and difficult moments", "Family details and personal context", "A concise summary for a family conversation"], note: "Tool approval. Use approval. Two different questions." },
  { label: "FAMILY COMMUNICATION", tag: "Draft \xB7 not sent", heading: "Warm words. Missing context.", sub: "Today\u2019s update / Before dismissal", body: ["\u201CWe had some opportunities to practice today.\u201D", "\u201CWe are continuing to grow together.\u201D", "\u201CThank you for your support!\u201D"], note: "Illustrative AI draft: what would a family actually learn?" },
  { label: "RESOURCE REVIEW", tag: "Generated resource \xB7 unchecked", heading: "Looks ready. Is it?", sub: "Reading / Classroom resource", body: ["Background knowledge: assumed", "Reading load: uneven", "Representation & accessibility: unchecked"], note: "An attractive layout is only the beginning." },
  { label: "SCHOOL PLANNER", tag: "Next week \xB7 proposed rollout", heading: "New tool. Unclear purpose.", sub: "Team agenda / AI adoption", body: ["MON   Introduce the new AI feature", "TUE    Begin using it across the team", "TBD   Define purpose, data rules & success"], note: "What needs to happen before Monday?" },
  { label: "ASSISTANT CONNECTION", tag: "Permission request \xB7 not connected", heading: "How much access is enough?", sub: "Organize meetings & draft follow-up notes", body: ["Email: read messages", "Calendar: read events", "Shared drive: read files"], note: "Sending disabled does not mean reading disabled." }
];
function Icon({ type = "arrow" }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{type === "sound" ? <><path d="M11 5 6 9H3v6h3l5 4V5Z" /><path d="M15 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14" /></> : type === "mute" ? <><path d="M11 5 6 9H3v6h3l5 4V5Z" /><path d="m16 9 5 6m0-6-5 6" /></> : type === "check" ? <path d="m5 12 4 4L19 6" /> : <path d="M4 12h15m-6-6 6 6-6 6" />}</svg>;
}
function Progress({ value, ...props }) {
  return <div data-slot="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} {...props}>
    <div data-slot="progress-indicator" style={{ width: `${value}%`, height: "100%", transition: "width 0.6s ease" }} />
  </div>;
}
function FeedbackDialog({ open, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!open) {
      if (dialog?.open) dialog.close();
      return;
    }
    const focus = document.activeElement;
    const overflow = document.body.style.overflow;
    if (dialog && !dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      if (dialog?.open) dialog.close();
      document.body.style.overflow = overflow;
      if (focus instanceof HTMLElement && focus.isConnected) focus.focus({ preventScroll: true });
    };
  }, [open]);
  return <dialog ref={ref} className="feedback-dialog" aria-labelledby="feedback-title" aria-describedby="feedback-description" onCancel={(event) => {
    event.preventDefault();
    onClose();
  }}>
    {open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="consequence">
      <button type="button" className="feedback-close" aria-label="Close feedback" onClick={onClose} autoFocus>×</button>
      {children}
    </motion.div>}
  </dialog>;
}
function useAudio() {
  const engine = useRef(null), enabledRef = useRef(false), busy = useRef(false), alive = useRef(true);
  const [enabled, setEnabled] = useState(false), [error, setError] = useState("");
  useEffect(() => {
    alive.current = true;
    const visibility = () => {
      if (!engine.current) return;
      if (document.hidden) engine.current.ctx.suspend().catch(() => {
      });
      else if (enabledRef.current) engine.current.ctx.resume().catch(() => {
      });
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      alive.current = false;
      document.removeEventListener("visibilitychange", visibility);
      const old = engine.current;
      engine.current = null;
      if (old && old.ctx.state !== "closed") old.ctx.close().catch(() => {
      });
    };
  }, []);
  async function toggle() {
    if (busy.current) return;
    busy.current = true;
    try {
      if (!engine.current) {
        const C = window.AudioContext || window.webkitAudioContext;
        if (!C) throw Error("No audio");
        const ctx2 = new C(), master2 = ctx2.createGain();
        master2.gain.value = 0;
        master2.connect(ctx2.destination);
        [130.81, 196, 261.63].forEach((f, i) => {
          const o = ctx2.createOscillator(), g = ctx2.createGain();
          o.frequency.value = f;
          g.gain.value = [0.026, 0.012, 6e-3][i];
          o.connect(g);
          g.connect(master2);
          o.start();
        });
        engine.current = { ctx: ctx2, master: master2 };
      }
      const { ctx, master } = engine.current;
      const next = !enabledRef.current;
      if (next) {
        await ctx.resume();
        if (!alive.current) return;
        master.gain.setTargetAtTime(0.45, ctx.currentTime, 0.15);
      } else {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setValueAtTime(0, ctx.currentTime);
        await ctx.suspend();
      }
      if (alive.current) {
        enabledRef.current = next;
        setEnabled(next);
        setError("");
      }
    } catch {
      if (alive.current) {
        setError("Audio is unavailable in this browser. You can still complete the lab.");
        setEnabled(false);
        enabledRef.current = false;
      }
    } finally {
      busy.current = false;
    }
  }
  function play(kind) {
    if (!enabledRef.current || !engine.current || engine.current.ctx.state !== "running") return;
    const { ctx, master } = engine.current;
    function tone(f, delay = 0, duration = 0.5, gain = 0.1) {
      const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + delay;
      o.type = "sine";
      o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(gain, t + 0.015);
      g.gain.exponentialRampToValueAtTime(1e-4, t + duration);
      o.connect(g);
      g.connect(master);
      o.start(t);
      o.stop(t + duration + 0.03);
      o.onended = () => {
        o.disconnect();
        g.disconnect();
      };
    }
    try {
      if (kind === "choice") tone(660, 0, 0.2, 0.1);
      if (kind === "warning") {
        tone(349.23, 0.13, 0.4, 0.1);
        tone(293.66, 0.32, 0.45, 0.09);
      }
      if (kind === "complete") [261.63, 329.63, 392, 523.25].forEach((f, i) => tone(f, i * 0.1, 1.1, 0.075));
      if (kind === "move") {
        const n = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 0.45), ctx.sampleRate), data = n.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), g = ctx.createGain(), t = ctx.currentTime;
        source.buffer = n;
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(700, t);
        filter.frequency.exponentialRampToValueAtTime(90, t + 0.45);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.16, t + 0.1);
        g.gain.exponentialRampToValueAtTime(1e-4, t + 0.45);
        source.connect(filter);
        filter.connect(g);
        g.connect(master);
        source.start();
        source.stop(t + 0.45);
        source.onended = () => {
          source.disconnect();
          filter.disconnect();
          g.disconnect();
        };
      }
    } catch {
    }
  }
  return { enabled, toggle, play, error };
}
function App() {
  const [step, setStep] = useState(0), [scores, setScores] = useState(initial), [chosen, setChosen] = useState(null), [open, setOpen] = useState(false), [history, setHistory] = useState([]);
  const lock = useRef(false), moving = useRef(false), heading = useRef(null);
  const reduced = useReducedMotion();
  const audio = useAudio();
  const done = step === 6;
  const s = scenarios[step];
  const item = artifacts[step];
  const pick = chosen === null ? null : s?.choices[chosen];
  function choose(i) {
    if (moving.current || lock.current || chosen !== null || done) return;
    lock.current = true;
    const c = s.choices[i];
    const next = Object.fromEntries(dimensions.map((k) => [k, Math.max(0, Math.min(100, scores[k] + c.points[k]))]));
    const danger = dimensions.some((k) => scores[k] >= 30 && next[k] < 30);
    setScores(next);
    setChosen(i);
    setHistory((h) => [...h, { id: s.id, choice: i }]);
    setOpen(true);
    audio.play("choice");
    if (danger) audio.play("warning");
  }
  function advance() {
    if (moving.current || chosen === null || done) return;
    moving.current = true;
    setOpen(false);
    setChosen(null);
    lock.current = false;
    audio.play(step === 5 ? "complete" : "move");
    setStep((v) => v + 1);
    window.scrollTo({ top: 0, behavior: "auto" });
  }
  function restart() {
    if (moving.current) return;
    moving.current = true;
    setOpen(false);
    setStep(0);
    setScores(initial());
    setHistory([]);
    setChosen(null);
    lock.current = false;
    window.scrollTo({ top: 0, behavior: "auto" });
  }
  const top = Math.max(...Object.values(scores));
  const winners = dimensions.filter((k) => scores[k] === top);
  return <div className="lab"><style>{APP_STYLES}</style>
 <header className="masthead"><a href="/" className="wordmark" aria-label="Keep the Human home"><span className="brand-mark">h.</span><span>keep the human<span className="brand-sub">THE AI DECISION LAB</span></span></a><div className="header-right"><span className="edition">EDUCATOR EDITION / 01</span><button className="audio-btn" onClick={audio.toggle} aria-pressed={audio.enabled} aria-label={audio.enabled ? "Mute music and sounds" : "Enable music and sounds"}><Icon type={audio.enabled ? "sound" : "mute"} /><span>Sound {audio.enabled ? "on" : "off"}</span></button></div></header>
 <div className="lab-top"><div><p className="eyebrow">YOUR JUDGMENT. YOUR DESK.</p><h1>{done ? "Take your practice forward." : "A little AI. A lot of human judgment."}</h1><p className="intro">{done ? "Six decisions made. Here is what you chose to protect." : "Work through six everyday decisions. Every choice carries a trade-off."}</p></div><div className="session-counter"><strong>{done ? "06" : String(step + 1).padStart(2, "0")}</strong><span>/ 06<br />{done ? "complete" : "decisions"}</span></div></div>
 <section className="meter-strip" aria-label="Your practice meters" aria-live="polite">{dimensions.map((k) => <div className={`meter ${k} ${scores[k] < 30 ? "danger" : ""}`} key={k}><div className="meter-label"><span>{names[k]}</span><strong>{scores[k]}<small> / 100</small></strong></div><Progress value={scores[k]} aria-label={`${names[k]}: ${scores[k]} out of 100`} /><span className="meter-detail">{scores[k] < 30 ? "Needs attention" : details[k]}</span></div>)}</section>
 {audio.error && <p role="status" className="audio-error">{audio.error}</p>}
 <main className="desk"><AnimatePresence mode="wait"><motion.div key={step} onAnimationComplete={() => {
    if (moving.current) {
      moving.current = false;
      heading.current?.focus({ preventScroll: true });
    }
  }} initial={{ opacity: 0, x: reduced ? 0 : 90 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduced ? 0 : -110 }} transition={{ duration: reduced ? 0.01 : 0.45, ease: [0.22, 1, 0.36, 1] }}>
 {!done ? <><div className="task-line"><span>ON YOUR DESK</span><span>0{step + 1} / {["PLANNING", "PRIVACY", "COMMUNICATION", "RESOURCES", "LEADERSHIP", "PERMISSIONS"][step]}</span><span className="task-line-right">Pause. Consider. Decide.</span></div><div className="workspace">
 <section className="artifact-zone" aria-label="Scenario artifact"><div className={`artifact ${s.artifact}`}><div className="artifact-chrome"><span>{item.label}</span><span>•••</span></div><div className="artifact-content"><span className="artifact-tag">{item.tag}</span><h2>{item.heading}</h2><p className="artifact-sub">{item.sub}</p><div className="artifact-body">{item.body.map((line, i) => <div key={i}><span className="artifact-number">{String(i + 1).padStart(2, "0")}</span><span>{line}</span></div>)}</div><p className="artifact-note">{item.note}</p>{s.artifact === "monitor" && <div className="permission-foot">Send permissions <strong>OFF</strong></div>}</div></div><p className="desk-caption">{["A draft is a starting point. You decide what comes next.", "Private information deserves a deliberate pause.", "Keep the relationship in your own hands.", "The final review belongs to a person.", "Innovation begins with a useful question.", "A smaller permission can make a meaningful difference."][step]}</p></section>
 <section className="decision"><p className="eyebrow">THE SITUATION</p><h2 tabIndex={-1} ref={heading}>{s.title.replace(/^\d+\. /, "")}</h2><p className="situation">{s.situation}</p><div className="choice-heading"><h3>What would you do?</h3><span>Choose one</span></div><div className="choices">{s.choices.map((c, i) => <button key={i} onClick={() => choose(i)} disabled={chosen !== null} className={`choice ${chosen === i ? "selected" : ""}`}><span className="choice-letter">{String.fromCharCode(65 + i)}</span><span>{c.text.slice(3)}</span><span className="choice-end">{chosen === i ? <Icon type="check" /> : <Icon />}</span></button>)}</div>{chosen !== null && <button className="primary review-btn" onClick={() => setOpen(true)}>Review your trade-off <Icon /></button>}<p className="decision-note">Your choice updates the meters. Then explore what it protects and what it costs.</p></section>
 </div></> : <section className="snapshot"><p className="eyebrow">PERSONAL AI PRACTICE SNAPSHOT</p><h2 tabIndex={-1} ref={heading}>Keep the human.<br /><em>Carry the learning.</em></h2><div className="badge-row">{winners.map((k) => <article className="archetype" key={k}><span className={`profile-seal ${k}`}><Icon type="check" /></span><p className="eyebrow">{winners.length > 1 ? "SHARED HIGHEST PRIORITY" : "YOUR HIGHEST PRIORITY"} · {names[k]}</p><h3>{profiles[k][0]}</h3><p>{profiles[k][1]}</p></article>)}</div><p className="snapshot-note">Based on your final meters{winners.length > 1 ? " with tied priorities shown together" : ""}. This is a reflection exercise, not a validated assessment or certification. Meters are bounded from 0 to 100.</p>{dimensions.some((k) => scores[k] < 30) && <p className="attention">A priority needs attention: {dimensions.filter((k) => scores[k] < 30).map((k) => names[k]).join(", ")}. Consider what you would change to protect it next time.</p>}<h3 className="commitment-heading">Four commitments to take back to work</h3><div className="commitments">{[["I will use AI for:", "one low-risk task where it can save time."], ["I will protect:", "one kind of data or information that should not be casually shared."], ["I will check:", "one quality question before using AI-generated content."], ["I will keep a human in the loop when:", "an action affects a person, record, decision, or public communication."]].map(([a, b], i) => <article className={`sticky sticky-${i}`} key={a}><span>0{i + 1}</span><h4>{a}</h4><p>{b}</p></article>)}</div><div className="snapshot-actions"><button className="primary" onClick={() => window.print()}>Print / save snapshot <Icon /></button><button className="secondary" onClick={restart}>Try the decisions again</button></div><p className="decision-note">{history.length} decisions completed. Your responses stay in this session.</p></section>}
 </motion.div></AnimatePresence></main>
 <footer className="footer"><span>KEEP THE HUMAN</span><ol aria-label="Progress through scenarios">{scenarios.map((v, i) => <li key={v.id} aria-current={!done && step === i ? "step" : void 0} className={step > i ? "complete" : step === i ? "current" : ""}><span>{step > i ? <Icon type="check" /> : String(i + 1).padStart(2, "0")}</span><span className="sr-only">{v.title}</span></li>)}</ol><span className="footer-note">The tool can assist. The judgment stays yours.</span></footer>
 <FeedbackDialog open={open} onClose={() => setOpen(false)}><p className="eyebrow">THE TRADE-OFF / DECISION 0{step + 1}</p><h2 id="feedback-title" className="consequence-title">Every choice protects something.</h2><p id="feedback-description" className="consequence-desc">You chose {chosen !== null ? String.fromCharCode(65 + chosen) : ""}. Here is the impact of that decision.</p>{pick && <><div className="impact-chips">{dimensions.map((k) => <span className={pick.points[k] < 0 ? "negative" : "positive"} key={k}>{names[k]} <strong>{pick.points[k] > 0 ? "+" : ""}{pick.points[k]}</strong></span>)}</div><div className="feedback-grid"><section><span className="feedback-label">WHAT IT GETS RIGHT</span><p>{pick.right}</p></section><section><span className="feedback-label">WHAT IT MISSES</span><p>{pick.miss}</p></section></div><div className="learning"><span className="feedback-label">KEEP THIS IN MIND</span><p>{s.feedback}</p></div><button className="primary next-btn" onClick={advance}>{step === 5 ? "See my practice snapshot" : "Move to next task"}<Icon /></button></>}</FeedbackDialog>
 </div>;
}
export {
  App as default
};
