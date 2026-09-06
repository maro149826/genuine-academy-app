import { useState, useEffect } from "react";
import {
  Home as HomeIcon,
  BookOpen,
  ClipboardCheck,
  Bell,
  Lock,
  Sparkles,
  Check,
  X,
  Camera,
  Clock,
} from "lucide-react";
import { supabase } from "./src/lib/supabase";

const MARK_NAVY_SRC = "data:image/png;base64,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";
const MARK_WHITE_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALAAAACeCAYAAACSEYAYAAAE3UlEQVR4nO3c23IaSwxAUZHy//8yeYihCMVlelp37fV86sR0b2R5SHy5Xq8CVPUn+gsAdhAwSiNglEbAKI2AUdpP9BeQWMXHM5eF/7bF6yPgmheJXxMDJthGJgRMsI11DphwB+gWMNEO0yVgwh2qesCEO1zVgAkXIlIvYMLFf6oETLh4qULAUfGufCxryer1W7++V1/3qz9z6/VlDtgz3CyxYlHWgK3jJdgmsgVsGS7RNpQp4Kq7HgJlCVg7XqIdIkPAmvES7jCRARMutkX9mzjihYqICawVL+HCPWCNeAkXd54rBPFCnVfAxAsTGR6jfUO4eMtjAu9MX+LFR9YBEy9MWQZMvDBnFTDxwoVFwMQLN5l+vSrxYpl2wGenL/HiFM2AiRfuolcI4sUWrU/izkxf4j2Gc/pAYwLzS0cQJmqFYKpAxW7ArA4I5T2BiReqdgJm90U4zwnM9IW6swEzfZGC1wRm+sLEmYBXpy/xwkz0R8nAltWPkrtN30y7fPazSmnyBM4Ur0i+r6cEy4CZKOuIeNFKwByuD855weQVAg1YBcz6sIcpfNDRgDlQf5z5ARYTmOkLN+zAuTGFvzgSMIcYi/P/gAlcAxG/of37gbvuv9qviyCVMIFjnHlDEP0LBFwLET/5FvDKgXVdH6xwXgqYwLFYJTYRcE1E/IuA451dJYhYCDgL9uGTCDgP9uETtAJmgsQZHfGngEcfTBAGwSJWiHxYJRYQcB8jIybgnHi0dhAB58U+fAAB58Y+/IX23wfuqloUVxkywZnAKI2A+6r2XeMUAu6tfcQE3F/riAkYpRHwDG2nMAHP0TLiTwGPeI6I2rQmcMt3d0Pt7okVYp5WEfNR8jGR65RFcG0+amYCozQCnqvFKqEZcIsDGab8nX0LuMWehL5YIXoZ9xfgCRgihSPWDrjsQTQy6h+EHgmYPbieMXfGCtHXiH3YIuByh4D/lLo/JnBv7VeJowG3P4jGWq8SVhO4zAHgrRJ3yAoxQ9tHaysBrx5C+hc/TMs1kAk8S7t9eDVgpvBMae+RCTxPq1XCI+C0797B2qwSZwJu9Q7GknQRe60Q6V44ejxaOxswU7iH8vfo+UNcqncu7krvwzsBl37h2JbiLnmMBpHCq8RuwEzhPkrepcYELvnCoSb0Llkh8KjcozWtgJnCfZTah6MnMBHnVGYgaQZc7tsP1LnfpfYEJuI+SqwSFisEEfeRfpWI3oGfEXEPbvdoFfDOtx8iziX1KmE5gYm4j7QRW68QRNxHyog9dmAihhmvH+J2IybkHNJNYc+nELsvnohzSBWx92M0jYgJGXcRz4E13sFEHCvNh1VRH2RoRUzIcVKsEpGfxGkdACHHCf+oOfqjZM13MSHXoXZP0QGL6H8rImRfoftwhoBFbPYpQvYTtg//RP3BL9wOQTu6x/9fih88cLd911km8CPLyK7CZLYSMhwyBizCpKzK/d6yBizy7zAIuR7XO8u0A79jtRuvYOVIKvMEfsY0rsPtrioFLMJaUYnLPVUL+IaQISJ1A74h5NzM76Z6wDcXIeasTO+kS8CPCDkfs/uo8BjtrMdD4zFYU50DfvQ8AQja30UMzn1KwM8IOoZ6xFMDfvZpRyNuXaoRE/B3/ECoT+1MOz6FwCAEjNIIGKURMEojYJT2F1gHpnQpQfrmAAAAAElFTkSuQmCC";

/* ---------- vocab data ---------- */
const rawWords = [
  ["abandon", "버리다"], ["ability", "능력"], ["absent", "결석한"], ["accept", "받아들이다"],
  ["accurate", "정확한"], ["achieve", "성취하다"], ["admire", "존경하다"], ["adventure", "모험"],
  ["advice", "조언"], ["afford", "여유가 되다"], ["agree", "동의하다"], ["ancient", "고대의"],
  ["announce", "발표하다"], ["anxious", "불안한"], ["apologize", "사과하다"], ["appear", "나타나다"],
  ["approve", "승인하다"], ["argue", "논쟁하다"], ["arrange", "배열하다"], ["arrive", "도착하다"],
  ["ashamed", "부끄러운"], ["assist", "돕다"], ["attempt", "시도하다"], ["attract", "끌어당기다"],
  ["avoid", "피하다"], ["aware", "알고 있는"], ["awkward", "어색한"], ["balance", "균형"],
  ["basic", "기본적인"], ["behave", "행동하다"], ["belong", "속하다"], ["benefit", "이익"],
  ["blame", "비난하다"], ["boast", "자랑하다"], ["border", "경계"], ["brave", "용감한"],
  ["breathe", "숨쉬다"], ["brief", "간단한"], ["bright", "밝은"], ["calm", "차분한"],
  ["capable", "할 수 있는"], ["careless", "부주의한"], ["cause", "원인"], ["celebrate", "축하하다"],
  ["challenge", "도전"], ["charity", "자선"], ["cheerful", "명랑한"], ["clever", "영리한"],
  ["collect", "수집하다"],
];
const vocabPool = rawWords.map(([en, kr], i) => ({ id: i + 1, en, kr }));

function chunkIntoDays(pool, perDay = 5) {
  const days = [];
  for (let d = 0; d < 7; d++) days.push({ day: d + 1, words: pool.slice(d * perDay, d * perDay + perDay) });
  return days;
}
const vocabDays = chunkIntoDays(vocabPool, 5);
const initialMemorized = [
  ...vocabDays[0].words.map((w) => w.id),
  ...vocabDays[1].words.map((w) => w.id),
  ...vocabDays[2].words.slice(0, 3).map((w) => w.id),
];

/* ---------- homework (multiple assignments, counted by piece) ---------- */
const demoHomeworkAssignments = [
  { id: "hw1", title: "문법 워크북 UNIT 5", totalQuestions: 15, answerKey: [1, 0, 2, 3, 0, 1, 1, 2, 3, 0, 2, 1, 0, 3, 2] },
  { id: "hw2", title: "리스닝 워크시트 2", totalQuestions: 8, answerKey: [2, 0, 1, 3, 0, 2, 1, 3] },
];
function makeInitialHwState() {
  const state = {};
  demoHomeworkAssignments.forEach((a) => {
    state[a.id] = { answers: Array(a.totalQuestions).fill(null), submitted: false };
  });
  return state;
}

function daysSinceUpload(createdAt) {
  const uploadDate = new Date(createdAt);
  const today = new Date();
  const uploadDay = new Date(uploadDate.getFullYear(), uploadDate.getMonth(), uploadDate.getDate());
  const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.max(0, Math.floor((todayDay - uploadDay) / (24 * 60 * 60 * 1000)));
}

/* ---------- notices (posted by admin) ---------- */
const initialNotices = [
  { id: "n1", title: "이번 주 단어시험 일정 안내", date: "8월 28일", content: "이번 주 단어시험은 금요일 수업 시간에 진행돼요. 못 본 친구는 다음 주 월요일에 볼 수 있어요." },
  { id: "n2", title: "추석 연휴 휴원 안내", date: "8월 25일", content: "추석 연휴 기간에는 학원이 쉽니다. 정확한 날짜는 곧 다시 안내드릴게요." },
  { id: "n3", title: "지필고사 대비 특강 신청", date: "8월 20일", content: "다음 달 지필고사 대비 특강을 신청받고 있어요. 관심 있으면 선생님께 말씀해주세요." },
];

/* ---------- achievement ring ---------- */
function ProgressRing({ value, max, size = 168, stroke = 10 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(1, max === 0 ? 0 : value / max);
  const offset = circumference * (1 - pct);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--accent)" strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset .5s ease" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 30, fontWeight: 800, color: "var(--ink)", letterSpacing: "-0.5px" }}>{value}/{max}</div>
        <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 3, fontWeight: 600 }}>이번 주 성취도</div>
      </div>
    </div>
  );
}

export default function StudentApp({ account }) {
  const givenName = account.name.trim().length > 1 ? account.name.trim().slice(1) : account.name.trim();
  const [tab, setTab] = useState("home");
  const [splashPhase, setSplashPhase] = useState("show");

  const [vocabSub, setVocabSub] = useState("memorize");
  const [assignedWords, setAssignedWords] = useState([]);
  const [assignedDays, setAssignedDays] = useState([]);
  const [memorizedIds, setMemorizedIds] = useState([]);
  const [unlockedDays, setUnlockedDays] = useState(new Set());
  const [reviewDay, setReviewDay] = useState(null);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const [testPhotoUrl, setTestPhotoUrl] = useState(null);
  const [testPhotoFile, setTestPhotoFile] = useState(null);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testMessage, setTestMessage] = useState("");
  const [vocabTestResult, setVocabTestResult] = useState(null);

  const [homeworkAssignments, setHomeworkAssignments] = useState([]);
  const [hwState, setHwState] = useState({});
  const [hwView, setHwView] = useState(null);
  const [hwMessage, setHwMessage] = useState("");

  const [notices, setNotices] = useState([]);
  const [readNoticeIds, setReadNoticeIds] = useState(new Set());
  const [openNoticeId, setOpenNoticeId] = useState(null);

  useEffect(() => {
    const t1 = setTimeout(() => setSplashPhase("hide"), 1000);
    const t2 = setTimeout(() => setSplashPhase("done"), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    let active = true;
    async function loadVocabTestResult() {
      const { data } = await supabase.rpc("get_student_vocab_test_result", {
        p_student_id: account.id,
        p_name: account.name,
        p_phone: account.phone,
      });
      if (!active) return;
      const result = data?.[0] || null;
      setVocabTestResult(result);
      setTestSubmitted(Boolean(result));
    }
    loadVocabTestResult();
    return () => { active = false; };
  }, [account.id, account.name, account.phone]);

  useEffect(() => {
    let active = true;
    async function loadHomework() {
      const { data } = await supabase.rpc("get_student_homework", {
        p_student_id: account.id,
        p_name: account.name,
        p_phone: account.phone,
      });
      if (!active) return;
      const assignments = (data || []).map((item) => ({
        id: item.id,
        title: item.title,
        totalQuestions: item.total_questions,
        answerKey: item.answer_key,
      }));
      setHomeworkAssignments(assignments);
      setHwState(Object.fromEntries((data || []).map((item) => [item.id, {
        answers: Array.isArray(item.answers) && item.answers.length ? item.answers : Array(item.total_questions).fill(null),
        submitted: item.submitted,
      }])));
    }
    loadHomework();
    return () => { active = false; };
  }, [account.id, account.name, account.phone]);

  useEffect(() => {
    let active = true;
    async function loadVocab() {
      const { data } = await supabase.rpc("get_student_vocab", {
        p_student_id: account.id,
        p_name: account.name,
        p_phone: account.phone,
      });
      if (!active) return;
      const words = (data || []).map((word) => ({
        id: word.id,
        en: word.english,
        kr: word.meaning,
        day: word.day_number,
        availableDay: daysSinceUpload(word.vocab_set_created_at),
        memorized: word.memorized,
      }));
      setAssignedWords(words);
      setAssignedDays(Array.from(new Set(words.map((word) => word.day))).sort((a, b) => a - b).map((day) => ({
        day,
        words: words.filter((word) => word.day === day),
      })));
      setMemorizedIds(words.filter((word) => word.memorized).map((word) => word.id));
    }
    loadVocab();
    return () => { active = false; };
  }, [account.id, account.name, account.phone]);

  useEffect(() => {
    let active = true;
    async function loadNotices() {
      const { data } = await supabase.rpc("get_student_notices", {
        p_student_id: account.id,
        p_name: account.name,
        p_phone: account.phone,
      });
      if (!active) return;
      setNotices((data || []).map((notice) => ({
        ...notice,
        date: new Date(notice.created_at).toLocaleDateString("ko-KR", { month: "long", day: "numeric" }),
      })));
    }
    loadNotices();
    return () => { active = false; };
  }, [account.id, account.name, account.phone]);

  const totalWords = assignedWords.length;
  const memorizedCount = memorizedIds.length;
  const learningQueue = assignedDays
    .filter((d) => d.words.some((word) => word.availableDay >= word.day || unlockedDays.has(d.day)))
    .flatMap((d) => d.words)
    .filter((word) => word.availableDay >= word.day || unlockedDays.has(word.day))
    .filter((w) => !memorizedIds.includes(w.id));
  const reviewQueue = reviewDay === null ? [] : (assignedDays.find((day) => day.day === reviewDay)?.words || []);
  const queue = reviewDay === null ? learningQueue : reviewQueue;
  const availableVocabDay = assignedWords.length > 0 ? Math.max(...assignedWords.map((word) => word.availableDay)) : 0;
  const currentWord = reviewDay === null ? queue[0] : queue[reviewIndex];

  const hwTotalCount = homeworkAssignments.length;
  const hwCompletedCount = Object.values(hwState).filter((s) => s.submitted).length;
  const ringValue = memorizedCount + hwCompletedCount;
  const ringMax = totalWords + hwTotalCount;
  const unreadNoticeCount = notices.filter((n) => !readNoticeIds.has(n.id)).length;

  async function handleNextWord() {
    if (reviewDay !== null) {
      if (reviewIndex >= reviewQueue.length - 1) {
        setReviewDay(null);
        setReviewIndex(0);
        setShowSuccess(true);
      } else {
        setReviewIndex((prev) => prev + 1);
      }
      return;
    }
    const wasLast = queue.length === 1;
    const { error } = await supabase.rpc("mark_vocab_word", {
      p_student_id: account.id,
      p_name: account.name,
      p_phone: account.phone,
      p_word_id: currentWord.id,
    });
    if (error) return;
    setMemorizedIds((prev) => [...prev, currentWord.id]);
    if (wasLast) setShowSuccess(true);
  }
  function handleTestPhotoChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setTestPhotoFile(file);
    setTestPhotoUrl(URL.createObjectURL(file));
  }
  async function submitTestPhoto() {
    if (!testPhotoFile) return;
    setTestMessage("");
    const formData = new FormData();
    formData.append("studentId", account.id);
    formData.append("name", account.name);
    formData.append("phone", account.phone);
    formData.append("file", testPhotoFile);
    const { error } = await supabase.functions.invoke("submit-vocab-test", { body: formData });
    if (error) {
      setTestMessage("사진을 제출하지 못했어요. 잠시 후 다시 시도해주세요.");
      return;
    }
    setTestSubmitted(true);
    setVocabTestResult(null);
  }
  function retakeTestPhoto() {
    setTestPhotoUrl(null);
    setTestPhotoFile(null);
    setTestSubmitted(false);
    setVocabTestResult(null);
    setTestMessage("");
  }
  function selectHwAnswer(assignmentId, qIdx, optIdx) {
    setHwState((prev) => {
      if (!prev[assignmentId]) return prev;
      if (prev[assignmentId].submitted) return prev;
      const answers = prev[assignmentId].answers.map((a, i) => (i === qIdx ? optIdx : a));
      return { ...prev, [assignmentId]: { ...prev[assignmentId], answers } };
    });
  }
  async function submitHwAssignment(assignmentId) {
    const st = hwState[assignmentId];
    if (!st || st.answers.some((a) => a === null)) return;
    setHwMessage("");
    const { data, error } = await supabase.rpc("submit_homework", {
      p_student_id: account.id,
      p_name: account.name,
      p_phone: account.phone,
      p_homework_id: assignmentId,
      p_answers: st.answers,
    });
    if (error) {
      setHwMessage(error.message.includes("already_submitted") ? "이미 제출한 숙제예요." : "제출하지 못했어요. 잠시 후 다시 시도해주세요.");
      return;
    }
    setHwState((prev) => ({
      ...prev,
      [assignmentId]: { ...st, submitted: true, answerKey: data?.[0]?.answer_key },
    }));
  }
  function hwScoreFor(assignment) {
    const st = hwState[assignment.id];
    const answerKey = st?.answerKey || assignment.answerKey || [];
    return st.answers.reduce((acc, ans, i) => acc + (ans === answerKey[i] ? 1 : 0), 0);
  }
  function toggleNotice(id) {
    setOpenNoticeId((prev) => (prev === id ? null : id));
    setReadNoticeIds((prev) => new Set(prev).add(id));
  }

  let homeSubtext;
  if (queue.length > 0) homeSubtext = `오늘 ${queue.length}개만 더 외우면 끝이에요`;
  else if (hwCompletedCount < hwTotalCount) homeSubtext = `숙제 ${hwTotalCount - hwCompletedCount}개가 남았어요`;
  else homeSubtext = "이번 주 목표를 모두 달성했어요";

  const activeAssignment = hwView ? homeworkAssignments.find((a) => a.id === hwView) : null;

  return (
    <div className="student-app">
      <style>{`
        .student-app {
          --ink: #1C2440;
          --ink-soft: #6B7280;
          --paper: #F2EFE6;
          --surface: #FFFFFF;
          --line: #DEDACB;
          --accent: #2E6F8E;
          --accent-soft: #E4EEF2;
          --good: #3F7D5C;
          --good-soft: #E7F1EB;
          --warn: #B8862E;
          --warn-soft: #F5EBD8;
          --bad: #B23A3A;
          --bad-soft: #F5E4E2;
          --backdrop: #12172A;
          font-family: 'Pretendard', 'Apple SD Gothic Neo', 'Malgun Gothic', -apple-system, sans-serif;
          background: var(--backdrop);
          padding: 32px 14px;
          display: flex;
          justify-content: center;
          box-sizing: border-box;
        }
        .student-app * { box-sizing: border-box; }
        .phone {
          width: 100%; max-width: 400px; height: 792px;
          background: var(--paper);
          border-radius: 26px;
          overflow: hidden;
          box-shadow: 0 24px 50px rgba(0,0,0,0.4);
          display: flex; flex-direction: column;
          position: relative;
        }
        .splash-overlay {
          position: absolute; inset: 0; z-index: 50; background: var(--paper);
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;
          transition: opacity 0.4s ease; opacity: 1;
        }
        .splash-overlay.hide { opacity: 0; pointer-events: none; }
        .splash-mark { width: 72px; height: auto; }
        .splash-kr { font-size: 17px; font-weight: 800; color: var(--ink); }
        .splash-en { font-size: 10px; font-weight: 600; color: var(--ink-soft); letter-spacing: 2.5px; }
        .top-bar { background: var(--ink); color: #fff; padding: 20px 20px 15px; flex-shrink: 0; position: relative; }
        .top-bar .eyebrow { font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 3px; font-weight: 600; }
        .top-bar h1 { font-size: 18px; margin: 0; font-weight: 700; letter-spacing: -0.2px; }
        .header-logo { position: absolute; top: 21px; right: 20px; height: 15px; width: auto; }

        .content { flex: 1; overflow-y: auto; padding: 4px 20px 20px; }

        .ring-wrap { display: flex; flex-direction: column; align-items: center; padding: 22px 0 4px; }
        .ring-sub { font-size: 12.5px; color: var(--ink-soft); margin-top: 12px; text-align: center; }
        .stat-row { display: flex; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); margin: 22px 0 4px; }
        .stat-col { flex: 1; padding: 14px 6px; text-align: center; cursor: pointer; }
        .stat-col + .stat-col { border-left: 1px solid var(--line); }
        .stat-col:active { background: rgba(0,0,0,0.02); }
        .stat-label { font-size: 11px; color: var(--ink-soft); margin-bottom: 5px; font-weight: 600; }
        .stat-value { font-size: 14px; font-weight: 700; color: var(--ink); }
        .notice-teaser { display: flex; align-items: center; gap: 10px; padding: 15px 2px; cursor: pointer; }
        .notice-teaser:active { opacity: 0.7; }
        .notice-teaser .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--warn); flex-shrink: 0; }
        .notice-teaser .txt { flex: 1; font-size: 13px; color: var(--ink); font-weight: 600; }
        .segmented { display: flex; background: #E7E2D2; border-radius: 10px; padding: 3px; margin: 14px 0 18px; }
        .segmented button { flex: 1; border: none; background: transparent; padding: 9px; border-radius: 8px; font-size: 13px; font-weight: 700; color: var(--ink-soft); cursor: pointer; }
        .segmented button.active { background: var(--surface); color: var(--ink); }

        .day-dots { display: flex; gap: 7px; margin: 20px 0 4px; justify-content: center; }
        .day-dot { width: 27px; height: 27px; border: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font: inherit; font-size: 10px; font-weight: 700; color: #fff; cursor: pointer; padding: 0; }
        .dd-done { background: var(--good); }
        .dd-active { background: var(--accent); }
        .dd-locked { background: var(--line); color: var(--ink-soft); }

        .word-card { background: var(--surface); border: 1.5px solid var(--ink); border-radius: 16px; padding: 38px 20px; text-align: center; }
        .word-card .progress { font-size: 11px; color: var(--ink-soft); margin-bottom: 16px; font-weight: 600; }
        .word-card .en { font-size: 27px; font-weight: 800; color: var(--ink); margin-bottom: 8px; }
        .word-card .kr { font-size: 15.5px; color: var(--accent); font-weight: 700; }
        .next-btn { width: 100%; background: var(--ink); color: #fff; border: none; border-radius: 11px; padding: 13px; font-weight: 700; font-size: 14px; margin-top: 20px; cursor: pointer; }
        .next-btn:active { opacity: 0.85; }
        .next-btn:disabled { opacity: 0.35; }

        .status-block { text-align: center; padding: 40px 10px 8px; }
        .status-block .icon { color: var(--good); margin-bottom: 10px; }
        .status-block h3 { font-size: 15.5px; color: var(--ink); margin: 0 0 5px; font-weight: 700; }
        .status-block p { font-size: 12.5px; color: var(--ink-soft); margin: 0; }
        .photo-drop { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; border: 1.5px dashed var(--ink-soft); border-radius: 14px; padding: 34px 10px; color: var(--ink-soft); font-size: 12.5px; font-weight: 600; cursor: pointer; }
        .photo-drop:active { background: rgba(0,0,0,0.02); }
        .photo-preview { width: 100%; border-radius: 12px; border: 1px solid var(--line); display: block; }
        .secondary-btn { display: inline-block; background: var(--surface); border: 1.5px solid var(--line); color: var(--ink); border-radius: 11px; padding: 12px; font-weight: 700; font-size: 13px; cursor: pointer; text-align: center; }
        .text-link { background: none; border: none; color: var(--ink-soft); font-size: 12px; text-decoration: underline; cursor: pointer; padding: 0; display: block; margin: 14px auto 0; }
        .status-line { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 12.5px; color: var(--warn); font-weight: 700; margin-bottom: 8px; }

        .section-label { font-size: 12px; font-weight: 700; color: var(--ink-soft); margin: 16px 0 6px; }
        .list-row { display: flex; align-items: center; gap: 10px; padding: 14px 2px; border-bottom: 1px solid var(--line); cursor: pointer; }
        .list-row:active { background: rgba(0,0,0,0.02); }
        .list-row .main { flex: 1; }
        .list-row .title { font-size: 13.5px; font-weight: 700; color: var(--ink); }
        .list-row .sub { font-size: 11.5px; color: var(--ink-soft); margin-top: 3px; }
        .q-row { display: flex; align-items: center; gap: 10px; padding: 10px 2px; border-bottom: 1px solid var(--line); }
        .q-num { width: 34px; font-size: 12px; font-weight: 700; color: var(--ink-soft); flex-shrink: 0; }
        .q-opts { display: flex; gap: 6px; flex: 1; }
        .q-opt { flex: 1; border: 1.5px solid var(--line); background: var(--paper); border-radius: 8px; padding: 8px 0; text-align: center; font-size: 13px; font-weight: 700; color: var(--ink-soft); cursor: pointer; }
        .q-opt.picked { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
        .q-opt.correct { border-color: var(--good); background: var(--good-soft); color: var(--good); }
        .q-opt.incorrect { border-color: var(--bad); background: var(--bad-soft); color: var(--bad); }
        .q-status { width: 18px; flex-shrink: 0; display: flex; justify-content: center; }
        .submit-bar { position: sticky; bottom: 0; background: var(--paper); padding-top: 10px; margin-top: 4px; }
        .submit-bar .progress-text { text-align: center; font-size: 11.5px; color: var(--ink-soft); margin-bottom: 8px; }

        .score-head { text-align: center; padding: 18px 0 14px; border-bottom: 1px solid var(--line); margin-bottom: 4px; }
        .score-head .big { font-size: 24px; font-weight: 800; color: var(--ink); }
        .score-head .small { font-size: 12px; color: var(--ink-soft); margin-top: 5px; }
        .notice-row { padding: 15px 2px; border-bottom: 1px solid var(--line); cursor: pointer; }
        .notice-row:active { background: rgba(0,0,0,0.02); }
        .notice-row .title-line { display: flex; align-items: center; gap: 8px; }
        .notice-row .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--warn); flex-shrink: 0; }
        .notice-row .title { font-size: 13.5px; font-weight: 700; color: var(--ink); flex: 1; }
        .notice-row .date { font-size: 11px; color: var(--ink-soft); }
        .notice-row .body { font-size: 12.5px; color: var(--ink-soft); margin-top: 9px; line-height: 1.65; }

        .tab-bar { display: flex; border-top: 1px solid var(--line); background: var(--surface); flex-shrink: 0; }
        .tab-btn { flex: 1; border: none; background: transparent; padding: 9px 0 11px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 3px; color: var(--ink-soft); font-size: 10.5px; font-weight: 600; position: relative; }
        .tab-btn.active { color: var(--ink); }
        .tab-dot { position: absolute; top: 3px; right: 30%; width: 6px; height: 6px; border-radius: 50%; background: var(--bad); }
      `}</style>

      <div className="phone">
        {splashPhase !== "done" && (
          <div className={`splash-overlay ${splashPhase === "hide" ? "hide" : ""}`}>
            <img src={MARK_NAVY_SRC} alt="제뉴인학원" className="splash-mark" />
            <div className="splash-kr">제뉴인학원</div>
            <div className="splash-en">GENUINE ACADEMY</div>
          </div>
        )}

        <div className="top-bar">
          <img src={MARK_WHITE_SRC} alt="제뉴인학원" className="header-logo" />
          <div className="eyebrow">
            {new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" })}
          </div>
          <h1>
            {tab === "home" && `안녕, ${givenName}야`}
            {tab === "vocab" && "단어"}
            {tab === "homework" && "숙제"}
            {tab === "notices" && "공지사항"}
          </h1>
        </div>

        <div className="content">
          {tab === "home" && (
            <>
              <div className="ring-wrap">
                <ProgressRing value={ringValue} max={ringMax} />
                <div className="ring-sub">{homeSubtext}</div>
              </div>
              <div className="stat-row">
                <div className="stat-col" onClick={() => { setTab("vocab"); setVocabSub("test"); }}>
                  <div className="stat-label">단어시험</div>
                  <div className="stat-value">
                    {vocabTestResult?.status === "graded"
                      ? `${vocabTestResult.score}/${vocabTestResult.total}점`
                      : testSubmitted ? "채점 대기" : "미제출"}
                  </div>
                </div>
                <div className="stat-col" onClick={() => { setTab("homework"); setHwView(null); }}>
                  <div className="stat-label">숙제</div>
                  <div className="stat-value">{hwCompletedCount}/{hwTotalCount} 제출</div>
                </div>
              </div>
              {unreadNoticeCount > 0 && (
                <div className="notice-teaser" onClick={() => setTab("notices")}>
                  <div className="dot" />
                  <div className="txt">새로운 공지 {unreadNoticeCount}개</div>
                  <Bell size={15} color="var(--ink-soft)" />
                </div>
              )}
            </>
          )}

          {tab === "vocab" && (
            <>
              <div className="segmented">
                <button className={vocabSub === "memorize" ? "active" : ""} onClick={() => setVocabSub("memorize")}>외우기</button>
                <button className={vocabSub === "test" ? "active" : ""} onClick={() => setVocabSub("test")}>단어 시험 제출</button>
              </div>

              {vocabSub === "memorize" && (
                <>
                  {showSuccess ? (
                    <div className="status-block">
                      <Sparkles size={40} className="icon" />
                      <h3>잘했어요</h3>
                      <p>오늘 외워야 할 단어를 모두 마쳤어요</p>
                      <div style={{ margin: "18px 0" }}>
                        <ProgressRing value={ringValue} max={ringMax} size={128} stroke={8} />
                      </div>
                      <button className="next-btn" onClick={() => { setShowSuccess(false); setTab("home"); }}>홈에서 확인하기</button>
                    </div>
                  ) : currentWord ? (
                    <div className="word-card">
                      <div className="progress">오늘 {queue.length}개 남음</div>
                      <div className="en">{currentWord.en}</div>
                      <div className="kr">{currentWord.kr}</div>
                      <button className="next-btn" onClick={handleNextWord}>외웠어요, 다음</button>
                    </div>
                  ) : (
                    <div className="status-block">
                      <Check size={30} className="icon" />
                      <h3>오늘 단어를 모두 외웠어요</h3>
                      <p>내일 새로운 단어가 열려요</p>
                    </div>
                  )}
                  <div className="day-dots">
                    {assignedDays.map((d) => {
                      const doneCount = d.words.filter((w) => memorizedIds.includes(w.id)).length;
                      const isUnlocked = d.day <= availableVocabDay || unlockedDays.has(d.day);
                      const status = !isUnlocked ? "locked" : doneCount === d.words.length ? "done" : "active";
                      return (
                        <button
                          key={d.day}
                          type="button"
                          className={`day-dot dd-${status}`}
                          title={status === "locked" ? `${d.day}일차 선행학습 열기` : `${d.day}일차`}
                          onClick={() => {
                            if (status === "locked") setUnlockedDays((prev) => new Set([...prev, d.day]));
                            setReviewDay(d.day);
                            setReviewIndex(0);
                            setShowSuccess(false);
                          }}
                        >
                          {status === "locked" ? <Lock size={11} /> : `D${d.day}`}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {vocabSub === "test" && (
                <div>
                  {!testSubmitted ? (
                    <>
                      <p style={{ fontSize: 12.5, color: "var(--ink-soft)", textAlign: "center", margin: "0 0 18px" }}>
                        시험지를 사진으로 찍어 올리면 조교 선생님이 채점해요
                      </p>
                      {testPhotoUrl ? (
                        <>
                          <img src={testPhotoUrl} alt="제출할 시험지" className="photo-preview" />
                          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                            <label htmlFor="testPhotoInput" className="secondary-btn" style={{ flex: 1 }}>다시 찍기</label>
                            <button className="next-btn" style={{ flex: 1, margin: 0 }} onClick={submitTestPhoto}>제출하기</button>
                          </div>
                          {testMessage && <p className="form-message" style={{ textAlign: "center", marginTop: 10 }}>{testMessage}</p>}
                        </>
                      ) : (
                        <label htmlFor="testPhotoInput" className="photo-drop">
                          <Camera size={24} />
                          <span>사진 선택하기</span>
                        </label>
                      )}
                      <input id="testPhotoInput" type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleTestPhotoChange} />
                    </>
                  ) : vocabTestResult?.status === "graded" ? (
                    <div style={{ textAlign: "center" }}>
                      <div className="status-block" style={{ padding: "22px 0 16px" }}>
                        <Check size={30} className="icon" />
                        <h3>채점 결과가 나왔어요</h3>
                        <div style={{ fontSize: 30, fontWeight: 800, color: "var(--ink)", margin: "10px 0 4px" }}>
                          {vocabTestResult.score}/{vocabTestResult.total}
                        </div>
                        <p style={{ fontSize: 12.5, color: "var(--ink-soft)", margin: 0 }}>
                          {Math.round((vocabTestResult.score / vocabTestResult.total) * 100)}점
                        </p>
                      </div>
                      <button className="text-link" onClick={retakeTestPhoto}>다시 제출하기</button>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      {testPhotoUrl && <img src={testPhotoUrl} alt="제출한 시험지" className="photo-preview" style={{ maxWidth: 200, margin: "0 auto 16px" }} />}
                      <div className="status-line"><Clock size={13} /> 채점 대기 중</div>
                      <p style={{ fontSize: 12.5, color: "var(--ink-soft)", margin: 0 }}>조교 선생님이 확인 후 점수를 알려드려요</p>
                      <button className="text-link" onClick={retakeTestPhoto}>다시 제출하기</button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {tab === "homework" && !activeAssignment && (
            <>
              <div className="section-label">이번 주 숙제</div>
              {homeworkAssignments.map((a) => {
                const st = hwState[a.id];
                if (!st) return null;
                const answered = st.answers.filter((x) => x !== null).length;
                return (
                  <div key={a.id} className="list-row" onClick={() => setHwView(a.id)}>
                    <div className="main">
                      <div className="title">{a.title}</div>
                      <div className="sub">{st.submitted ? `제출 완료 · ${hwScoreFor(a)}/${a.totalQuestions} 정답` : `${answered}/${a.totalQuestions}문제 체크됨`}</div>
                    </div>
                    {st.submitted ? <Check size={16} color="var(--good)" /> : null}
                  </div>
                );
              })}
            </>
          )}

          {tab === "homework" && activeAssignment && (
            <>
              <button className="text-link" style={{ margin: "0 0 12px", textAlign: "left" }} onClick={() => setHwView(null)}>← 숙제 목록</button>
                  {!hwState[activeAssignment.id].submitted ? (
                <>
                  <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: "0 0 12px" }}>{activeAssignment.title} · 종이 시험지 번호에 맞춰 답을 골라주세요</p>
                  {Array.from({ length: activeAssignment.totalQuestions }).map((_, i) => (
                    <div className="q-row" key={i}>
                      <div className="q-num">{i + 1}번</div>
                      <div className="q-opts">
                        {["①", "②", "③", "④"].map((label, oi) => (
                          <div key={oi} className={`q-opt ${hwState[activeAssignment.id].answers[i] === oi ? "picked" : ""}`} onClick={() => selectHwAnswer(activeAssignment.id, i, oi)}>
                            {label}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="submit-bar">
                    <div className="progress-text">{hwState[activeAssignment.id].answers.filter((a) => a !== null).length}/{activeAssignment.totalQuestions}문제 선택됨</div>
                    {hwMessage && <div className="progress-text" style={{ color: "var(--bad)" }}>{hwMessage}</div>}
                    <button className="next-btn" style={{ margin: 0 }} disabled={hwState[activeAssignment.id].answers.some((a) => a === null)} onClick={() => submitHwAssignment(activeAssignment.id)}>제출하기</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="score-head">
                    <div className="big">{hwScoreFor(activeAssignment)}/{activeAssignment.totalQuestions}</div>
                    <div className="small">{Math.round((hwScoreFor(activeAssignment) / activeAssignment.totalQuestions) * 100)}점 · 선생님도 이 결과를 확인할 수 있어요</div>
                  </div>
                  {Array.from({ length: activeAssignment.totalQuestions }).map((_, i) => {
                    const st = hwState[activeAssignment.id];
                    const answerKey = st.answerKey || activeAssignment.answerKey || [];
                    const correct = st.answers[i] === answerKey[i];
                    return (
                      <div className="q-row" key={i}>
                        <div className="q-status">{correct ? <Check size={15} color="var(--good)" /> : <X size={15} color="var(--bad)" />}</div>
                        <div className="q-num">{i + 1}번</div>
                        <div className="q-opts">
                          {["①", "②", "③", "④"].map((label, oi) => {
                            let cls = "";
                            if (oi === answerKey[i]) cls = "correct";
                            else if (oi === st.answers[i]) cls = "incorrect";
                            return <div key={oi} className={`q-opt ${cls}`}>{label}</div>;
                          })}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </>
          )}

          {tab === "notices" && (
            <>
              {notices.map((n) => (
                <div className="notice-row" key={n.id} onClick={() => toggleNotice(n.id)}>
                  <div className="title-line">
                    {!readNoticeIds.has(n.id) && <div className="dot" />}
                    <div className="title">{n.title}</div>
                    <div className="date">{n.date}</div>
                  </div>
                  {openNoticeId === n.id && <div className="body">{n.content}</div>}
                </div>
              ))}
            </>
          )}
        </div>

        <div className="tab-bar">
          <button className={`tab-btn ${tab === "home" ? "active" : ""}`} onClick={() => setTab("home")}><HomeIcon size={19} /> 홈</button>
          <button className={`tab-btn ${tab === "vocab" ? "active" : ""}`} onClick={() => setTab("vocab")}><BookOpen size={19} /> 단어</button>
          <button className={`tab-btn ${tab === "homework" ? "active" : ""}`} onClick={() => { setTab("homework"); setHwView(null); }}><ClipboardCheck size={19} /> 숙제</button>
          <button className={`tab-btn ${tab === "notices" ? "active" : ""}`} onClick={() => setTab("notices")}>
            <Bell size={19} /> 공지
            {unreadNoticeCount > 0 && tab !== "notices" && <span className="tab-dot" />}
          </button>
        </div>
      </div>
    </div>
  );
}
