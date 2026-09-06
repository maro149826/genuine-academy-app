import { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  ClipboardCheck,
  CalendarCheck,
  Bell,
  Check,
  X,
  FileUp,
  Link2,
  QrCode,
  Download,
  ExternalLink,
} from "lucide-react";
import QRCode from "qrcode";
import Papa from "papaparse";
import { supabase } from "./src/lib/supabase";

const PUBLIC_APP_URL = "https://genuine-academy-app.vercel.app";

const MARK_NAVY_SRC = "data:image/png;base64,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";

/* ---------- seed data ---------- */
const initialClasses = [
  ...["초", "중", "고"].flatMap((school, schoolIndex) => {
    const grades = school === "초" ? 6 : 3;
    return Array.from({ length: grades }, (_, gradeIndex) => ["A", "B"].map((section) => ({
      id: `c${schoolIndex}-${gradeIndex + 1}-${section}`,
      name: `${school}${gradeIndex + 1}${section}`,
    }))).flat();
  }),
];

const initialStudents = [
  { id: "s1", name: "김도윤", phone: "010-1234-5601", classId: "c0-1-A", status: "approved" },
  { id: "s2", name: "이서연", phone: "010-1234-5602", classId: "c0-1-B", status: "approved" },
  { id: "s3", name: "박준서", phone: "010-1234-5603", classId: null, status: "pending" },
  { id: "s4", name: "최유나", phone: "010-1234-5604", classId: "c1-1-A", status: "approved" },
  { id: "s5", name: "정민준", phone: "010-1234-5605", classId: null, status: "pending" },
  { id: "s6", name: "강하은", phone: "010-1234-5606", classId: "c2-1-A", status: "approved" },
  { id: "s7", name: "오지훈", phone: "010-1234-5607", classId: "c2-1-B", status: "revoked" },
  { id: "s8", name: "한소율", phone: "010-1234-5608", classId: null, status: "pending" },
];

const initialAttendance = {
  s2: ["2025-08-25", "2025-08-26", "2025-08-27", "2025-08-28"],
  s4: ["2025-08-26", "2025-08-28"],
  s6: ["2025-08-25", "2025-08-27", "2025-08-28"],
};

function todayStr() {
  return new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
}
function todayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function displayDate(date) {
  return date.slice(5).replace("-", "/");
}
function isCurrentMonth(dateValue) {
  const date = new Date(dateValue);
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}
function pruneAttendanceMap(attendanceMap) {
  return Object.fromEntries(
    Object.entries(attendanceMap || {}).map(([id, list]) => [id, (list || []).filter((date) => isCurrentMonth(date))])
  );
}

const homeworkAssignments = [
  { id: "hw1", title: "문법 워크북 UNIT 5", totalQuestions: 15, answerKey: [1, 0, 2, 3, 0, 1, 1, 2, 3, 0, 2, 1, 0, 3, 2] },
  { id: "hw2", title: "리스닝 워크시트 2", totalQuestions: 8, answerKey: [2, 0, 1, 3, 0, 2, 1, 3] },
];

const statusMeta = {
  pending: { label: "승인 대기", color: "var(--warn)" },
  approved: { label: "승인됨", color: "var(--good)" },
  revoked: { label: "박탈됨", color: "var(--bad)" },
};

/* ---------- shared student picker for bulk assign ---------- */
function StudentPicker({ students, classes, selected, onToggle, onToggleClass }) {
  const approvedStudents = students.filter((s) => String(s.status || "").trim().toLowerCase() === "approved");
  return (
    <div>
      {classes.map((cls) => {
        const inClass = approvedStudents.filter((s) => s.classId === cls.id);
        if (inClass.length === 0) return null;
        const allSelected = inClass.every((s) => selected.has(s.id));
        return (
          <div key={cls.id} style={{ marginBottom: 14 }}>
            <label className="picker-class-head">
              <input type="checkbox" checked={allSelected} onChange={() => onToggleClass(inClass.map((s) => s.id), !allSelected)} />
              {cls.name} <span>· {inClass.length}명</span>
            </label>
            {inClass.map((s) => (
              <label className="picker-row" key={s.id}>
                <input type="checkbox" checked={selected.has(s.id)} onChange={() => onToggle(s.id)} />
                <span className="picker-name">{s.name}</span>
                <span className="picker-meta">{s.phone}</span>
              </label>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [tab, setTab] = useState("members");
  const [memberFilter, setMemberFilter] = useState("pending");
  const [toast, setToast] = useState("");
  const [attendance, setAttendance] = useState(initialAttendance);

  const [vocabSets, setVocabSets] = useState([]);
  const [vocabFileName, setVocabFileName] = useState("");
  const [vocabSetName, setVocabSetName] = useState("");
  const [vocabWords, setVocabWords] = useState([]);
  const [vocabSelected, setVocabSelected] = useState(new Set());
  const [expandedVocabSetId, setExpandedVocabSetId] = useState(null);

  const [homeworkDefs, setHomeworkDefs] = useState([{ id: "h1", title: "문법 워크북 UNIT 4", totalQuestions: 12, createdAt: "8월 20일", assignedCount: 3 }]);
  const [hwTitle, setHwTitle] = useState("");
  const [hwTotal, setHwTotal] = useState(10);
  const [hwKey, setHwKey] = useState(Array(10).fill(null));
  const [hwSelected, setHwSelected] = useState(new Set());

  const [notices, setNotices] = useState([]);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeBody, setNoticeBody] = useState("");
  const [qrOpenId, setQrOpenId] = useState(null);
  const [qrDataUrls, setQrDataUrls] = useState({});
  const [vocabTests, setVocabTests] = useState([]);
  const [vocabPhotoUrls, setVocabPhotoUrls] = useState({});
  const [gradeInputs, setGradeInputs] = useState({});
  const [homeworkResults, setHomeworkResults] = useState([]);

  useEffect(() => {
    async function loadMembers() {
      const [{ data: studentRows, error: studentsError }, { data: classRows, error: classesError }, { data: homeworkRows, error: homeworkError }, { data: attendanceRows, error: attendanceError }] = await Promise.all([
        supabase.from("students").select("id, name, phone, class_id, status, report_token").order("created_at", { ascending: false }),
        supabase.from("classes").select("id, name").order("name"),
        supabase.from("homework_assignments").select("id, title, total_questions, created_at, homework_student_assignments(count)").order("created_at", { ascending: false }),
        supabase.from("attendance_records").select("student_id, attendance_date").order("attendance_date", { ascending: true }),
      ]);
      if (studentsError) {
        showToast("학생 목록을 불러오지 못했어요");
      } else {
        setStudents((studentRows || []).map((student) => ({ ...student, classId: student.class_id })));
      }
      if (classesError) {
        showToast("반 목록을 불러오지 못했어요");
      } else {
        setClasses(classRows || []);
      }
      if (attendanceError) {
        setAttendance({});
        showToast("출석 기록을 불러오지 못했어요. 오늘 체크는 계속 사용할 수 있어요.");
      } else {
        setAttendance(pruneAttendanceMap((attendanceRows || []).reduce((result, row) => {
          if (!isCurrentMonth(row.attendance_date)) return result;
          return {
            ...result,
            [row.student_id]: [...(result[row.student_id] || []), row.attendance_date],
          };
        }, {})));
      }
      if (homeworkError) {
        showToast("숙제 목록을 불러오지 못했어요");
      } else {
        setHomeworkDefs((homeworkRows || []).map((homework) => ({
          id: homework.id,
          title: homework.title,
          totalQuestions: homework.total_questions,
          createdAt: new Date(homework.created_at).toLocaleDateString("ko-KR", { month: "long", day: "numeric" }),
          assignedCount: homework.homework_student_assignments?.[0]?.count || 0,
        })));
      }
    }
    loadMembers();
  }, []);

  useEffect(() => {
    async function loadVocabSets() {
      const { data, error } = await supabase
        .from("vocab_sets")
        .select("id, name, created_at, vocab_assignments(student_id, students(name))")
        .order("created_at", { ascending: false });
      if (error) {
        showToast("단어 업로드 내역을 불러오지 못했어요");
        return;
      }
      setVocabSets((data || []).map((item) => ({
        id: item.id,
        name: item.name,
        createdAt: new Date(item.created_at).toLocaleDateString("ko-KR", { month: "long", day: "numeric" }),
        assignedNames: (item.vocab_assignments || []).map((assignment) => assignment.students?.name).filter(Boolean),
        assignedCount: item.vocab_assignments?.length || 0,
      })));
    }
    loadVocabSets();
  }, []);

  useEffect(() => {
    async function loadVocabTests() {
      const { data, error } = await supabase
        .from("vocab_test_submissions")
        .select("id, photo_path, status, score, total, submitted_at, students(name)")
        .order("submitted_at", { ascending: false });
      if (error) {
        showToast("단어시험 제출 목록을 불러오지 못했어요");
        return;
      }
      setVocabTests(data || []);
    }
    loadVocabTests();
  }, []);

  useEffect(() => {
    async function loadHomeworkResults() {
      const { data, error } = await supabase
        .from("homework_submissions")
        .select(`
          id,
          student_id,
          homework_id,
          score,
          submitted_at,
          students(name, phone),
          homework_assignments(title, total_questions)
        `)
        .order("submitted_at", { ascending: false });

      if (error) {
        showToast("숙제 결과를 불러오지 못했어요");
        return;
      }

      setHomeworkResults(data || []);
    }

    loadHomeworkResults();
  }, []);

  useEffect(() => {
    async function loadNotices() {
      const { data, error } = await supabase.from("notices").select("id, title, content, created_at").order("created_at", { ascending: false });
      if (error) {
        showToast("공지를 불러오지 못했어요");
        return;
      }
      setNotices((data || []).map((notice) => ({ ...notice, date: new Date(notice.created_at).toLocaleDateString("ko-KR", { month: "long", day: "numeric" }) })));
    }
    loadNotices();
  }, []);

  function homeworkUrl(id) {
    return `https://academy.app/hw/${id}`;
  }

  async function openQr(id) {
    if (qrOpenId === id) {
      setQrOpenId(null);
      return;
    }
    if (!qrDataUrls[id]) {
      const dataUrl = await QRCode.toDataURL(homeworkUrl(id), { margin: 2, width: 160 });
      setQrDataUrls((prev) => ({ ...prev, [id]: dataUrl }));
    }
    setQrOpenId(id);
  }

  async function openVocabPhoto(test) {
    if (vocabPhotoUrls[test.id]) return;
    const { data, error } = await supabase.storage.from("vocab-tests").createSignedUrl(test.photo_path, 3600);
    if (error) return showToast("사진을 열지 못했어요");
    setVocabPhotoUrls((prev) => ({ ...prev, [test.id]: data.signedUrl }));
  }

  async function downloadVocabPhoto(test) {
    let photoUrl = vocabPhotoUrls[test.id];
    if (!photoUrl) {
      const { data, error } = await supabase.storage.from("vocab-tests").createSignedUrl(test.photo_path, 3600);
      if (error) return showToast("사진을 다운로드하지 못했어요");
      photoUrl = data.signedUrl;
      setVocabPhotoUrls((prev) => ({ ...prev, [test.id]: photoUrl }));
    }
    const response = await fetch(photoUrl);
    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `단어시험-${test.students?.name || "학생"}-${test.id}.jpg`;
    link.click();
    URL.revokeObjectURL(downloadUrl);
  }

  async function gradeVocabTest(test) {
    const score = Number(gradeInputs[test.id]?.score);
    const total = Number(gradeInputs[test.id]?.total);
    const { error } = await supabase.functions.invoke("grade-vocab-test", { body: { submissionId: test.id, score, total } });
    if (error) return showToast("채점하지 못했어요");
    setVocabTests((prev) => prev.map((item) => item.id === test.id ? { ...item, status: "graded", score, total } : item));
    showToast("채점 결과를 저장했어요");
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  const pendingCount = students.filter((s) => s.status === "pending").length;

  async function approveStudent(id) {
    const { error } = await supabase.from("students").update({ status: "approved", approved_at: new Date().toISOString() }).eq("id", id);
    if (error) return showToast("승인 처리에 실패했어요");
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status: "approved" } : s)));
    showToast("승인 처리했어요");
  }
  async function rejectStudent(id) {
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) return showToast("반려 처리에 실패했어요");
    setStudents((prev) => prev.filter((s) => s.id !== id));
    showToast("가입 신청을 반려했어요");
  }
  async function revokeStudent(id) {
    const { error } = await supabase.from("students").update({ status: "revoked" }).eq("id", id);
    if (error) return showToast("권한 박탈에 실패했어요");
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status: "revoked" } : s)));
    showToast("사용 권한을 박탈했어요");
  }
  async function restoreStudent(id) {
    const { error } = await supabase.from("students").update({ status: "approved", approved_at: new Date().toISOString() }).eq("id", id);
    if (error) return showToast("승인 복구에 실패했어요");
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status: "approved" } : s)));
    showToast("다시 승인 상태로 되돌렸어요");
  }
  async function assignClass(id, classId) {
    const { error } = await supabase.from("students").update({ class_id: classId || null }).eq("id", id);
    if (error) return showToast("반 배정에 실패했어요");
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, classId: classId || null } : s)));
  }
  function copyReportLink(student) {
    const url = `${PUBLIC_APP_URL}/report?key=${student.report_token}`;
    try { navigator.clipboard.writeText(url); } catch (e) {}
    showToast("리포트 링크를 복사했어요");
  }

  async function checkAttendance(studentId) {
    const key = todayKey();
    const alreadyChecked = (attendance[studentId] || []).includes(key);
    let error;
    if (alreadyChecked) {
      ({ error } = await supabase
        .from("attendance_records")
        .delete()
        .eq("student_id", studentId)
        .eq("attendance_date", key));
    } else {
      ({ error } = await supabase.rpc("admin_check_attendance", { p_student_id: studentId, p_attendance_date: key }));
      if (error) {
        const fallback = await supabase
          .from("attendance_records")
          .upsert({ student_id: studentId, attendance_date: key }, { onConflict: "student_id,attendance_date" });
        error = fallback.error;
      }
    }
    if (error) {
      showToast(alreadyChecked ? "출석을 취소하지 못했어요" : "출석을 저장하지 못했어요");
      return;
    }
    setAttendance((prev) => {
      const next = pruneAttendanceMap(prev);
      const list = next[studentId] || [];
      if (alreadyChecked) {
        return { ...next, [studentId]: list.filter((date) => date !== key) };
      }
      return { ...next, [studentId]: [...list, key] };
    });
    showToast(alreadyChecked ? "오늘 출석을 취소했어요" : "출석을 체크했어요");
  }

  function toggleSel(setFn) {
    return (id) => setFn((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }
  function toggleGroupSel(setFn) {
    return (ids, shouldSelect) => setFn((prev) => { const next = new Set(prev); ids.forEach((id) => (shouldSelect ? next.add(id) : next.delete(id))); return next; });
  }

  function handleVocabFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setVocabFileName(file.name);
    Papa.parse(file, {
      skipEmptyLines: true,
      complete: ({ data }) => {
        const rows = data.filter((row) => Array.isArray(row) && row.length >= 2);
        const firstRow = rows[0]?.map((value) => String(value).toLowerCase().trim()) || [];
        const hasHeader = firstRow.some((value) => value.includes("english") || value.includes("word") || value.includes("뜻") || value.includes("meaning"));
        const words = rows.slice(hasHeader ? 1 : 0).map((row) => ({ en: String(row[0]).trim(), kr: String(row[1]).trim() })).filter((word) => word.en && word.kr).slice(0, 300);
        setVocabWords(words);
      },
    });
  }

  async function submitVocab() {
    if (!vocabFileName || !vocabSetName || vocabWords.length === 0 || vocabSelected.size === 0) return;
    const { data: vocabSetId, error } = await supabase.rpc("admin_create_vocab_set", {
      p_name: vocabSetName,
      p_words: vocabWords,
      p_student_ids: Array.from(vocabSelected),
    });
    if (error) {
      showToast(error.message.includes("no_approved_students") ? "승인된 학생을 선택해주세요" : "단어를 저장하지 못했어요");
      return;
    }
    setVocabSets((prev) => [{
      id: vocabSetId,
      name: vocabSetName,
      createdAt: todayStr(),
      assignedCount: vocabSelected.size,
      assignedNames: students.filter((student) => vocabSelected.has(student.id)).map((student) => student.name),
    }, ...prev]);
    showToast(`${vocabSelected.size}명에게 배정했어요`);
    setVocabFileName(""); setVocabSetName(""); setVocabWords([]); setVocabSelected(new Set());
  }

  function handleHwTotalChange(n) {
    const num = Math.max(1, Math.min(30, Number(n) || 1));
    setHwTotal(num);
    setHwKey((prev) => { const next = prev.slice(0, num); while (next.length < num) next.push(null); return next; });
  }
  async function submitHomework() {
    if (!hwTitle || hwKey.some((k) => k === null) || hwSelected.size === 0) return;
    const { data: homeworkId, error } = await supabase.rpc("admin_create_homework", {
      p_title: hwTitle,
      p_total_questions: hwTotal,
      p_answer_key: hwKey,
      p_student_ids: Array.from(hwSelected),
    });
    if (error) {
      showToast(error.message.includes("no_approved_students") ? "승인된 학생을 선택해주세요" : "숙제를 저장하지 못했어요");
      return;
    }
    setHomeworkDefs((prev) => [{ id: homeworkId, title: hwTitle, totalQuestions: hwTotal, createdAt: todayStr(), assignedCount: hwSelected.size }, ...prev]);
    showToast(`${hwSelected.size}명에게 배정했어요`);
    setHwTitle(""); setHwKey(Array(hwTotal).fill(null)); setHwSelected(new Set());
  }

  async function postNotice() {
    if (!noticeTitle || !noticeBody) return;
    const { data, error } = await supabase.from("notices").insert({ title: noticeTitle.trim(), content: noticeBody.trim() }).select("id, title, content, created_at").single();
    if (error) {
      showToast("공지를 게시하지 못했어요");
      return;
    }
    setNotices((prev) => [{ ...data, date: todayStr() }, ...prev]);
    showToast("공지를 게시했어요");
    setNoticeTitle(""); setNoticeBody("");
  }
  async function deleteNotice(id) {
    const { error } = await supabase.from("notices").delete().eq("id", id);
    if (error) {
      showToast("공지를 삭제하지 못했어요");
      return;
    }
    setNotices((prev) => prev.filter((n) => n.id !== id));
  }

  async function deleteVocabSet(id) {
    if (!window.confirm("이 단어 업로드 내역을 삭제할까요?")) return;
    const { error } = await supabase.from("vocab_sets").delete().eq("id", id);
    if (error) {
      showToast("업로드 내역을 삭제하지 못했어요");
      return;
    }
    setVocabSets((prev) => prev.filter((item) => item.id !== id));
    showToast("업로드 내역을 삭제했어요");
  }

  async function deleteHomeworkDef(id) {
    if (!window.confirm("이 숙제 업로드 내역을 삭제할까요?")) return;
    const { error } = await supabase.from("homework_assignments").delete().eq("id", id);
    if (error) {
      showToast("숙제 업로드 내역을 삭제하지 못했어요");
      return;
    }
    setHomeworkDefs((prev) => prev.filter((item) => item.id !== id));
    showToast("숙제 업로드 내역을 삭제했어요");
  }

  async function deleteHomeworkResult(id) {
    if (!window.confirm("이 제출 결과를 삭제할까요?")) return;
    const { error } = await supabase.from("homework_submissions").delete().eq("id", id);
    if (error) {
      showToast("제출 결과를 삭제하지 못했어요");
      return;
    }
    setHomeworkResults((prev) => prev.filter((item) => item.id !== id));
    showToast("제출 결과를 삭제했어요");
  }

  async function deleteVocabSubmission(id) {
    if (!window.confirm("이 시험 제출 기록을 삭제할까요?")) return;
    const test = vocabTests.find((item) => item.id === id);
    if (test?.photo_path) {
      const { error: photoError } = await supabase.storage.from("vocab-tests").remove([test.photo_path]);
      if (photoError) {
        showToast("시험 사진을 삭제하지 못했어요");
        return;
      }
    }
    const { error } = await supabase.from("vocab_test_submissions").delete().eq("id", id);
    if (error) {
      showToast("시험 제출 기록을 삭제하지 못했어요");
      return;
    }
    setVocabTests((prev) => prev.filter((item) => item.id !== id));
    showToast("시험 제출 기록을 삭제했어요");
  }

  const filteredMembers = students.filter((s) => memberFilter === "all" || s.status === memberFilter);
  const approvedStudents = students.filter((s) => s.status === "approved");

  return (
    <div className="admin-app">
      <style>{`
        .admin-app {
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
          padding: 40px 20px;
          box-sizing: border-box;
        }
        .admin-app * { box-sizing: border-box; }
        .sheet {
          max-width: 960px; margin: 0 auto; background: var(--paper);
          border-radius: 16px; overflow: hidden; box-shadow: 0 26px 55px rgba(0,0,0,0.35); position: relative;
        }
        .header { padding: 22px 30px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); }
        .header-brand { display: flex; align-items: center; gap: 9px; }
        .header-brand img { height: 19px; width: auto; }
        .header-brand span { font-weight: 800; font-size: 14.5px; color: var(--ink); }
        .header-date { font-size: 12px; color: var(--ink-soft); }
        .tabs { display: flex; padding: 0 30px; border-bottom: 1px solid var(--line); overflow-x: auto; }
        .tab-item {
          padding: 15px 2px; margin-right: 26px; font-size: 13.5px; font-weight: 700; color: var(--ink-soft);
          cursor: pointer; border-bottom: 2px solid transparent; white-space: nowrap; display: flex; align-items: center; gap: 7px;
        }
        .tab-item.active { color: var(--ink); border-bottom-color: var(--ink); }
        .tab-count { background: var(--bad); color: #fff; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 999px; }

        .body { padding: 26px 30px 34px; }
        .page-title { font-size: 16px; font-weight: 800; color: var(--ink); margin: 0 0 4px; }
        .page-sub { font-size: 12.5px; color: var(--ink-soft); margin: 0 0 20px; }

        .filter-tabs { display: flex; gap: 18px; margin-bottom: 16px; border-bottom: 1px solid var(--line); }
        .filter-tab { padding: 0 0 10px; font-size: 12.5px; font-weight: 700; color: var(--ink-soft); cursor: pointer; border-bottom: 2px solid transparent; }
        .filter-tab.active { color: var(--ink); border-bottom-color: var(--accent); }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; font-size: 12px; font-weight: 700; color: var(--ink-soft); padding: 10px 10px; border-bottom: 1px solid var(--line); }
        td { padding: 12px 10px; font-size: 13.5px; color: var(--ink); border-bottom: 1px solid var(--line); }
        .empty-row td { text-align: center; color: var(--ink-soft); padding: 30px; }
        .status-dot { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 700; }
        .status-dot .dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .class-select { border: 1.5px solid var(--line); border-radius: 8px; padding: 5px 8px; font-size: 12.5px; color: var(--ink); background: var(--surface); font-family: inherit; cursor: pointer; }
        .actions { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; }
        .btn-primary { background: var(--ink); color: #fff; border: none; border-radius: 8px; padding: 6px 12px; font-weight: 700; font-size: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; }
        .btn-primary:disabled { background: #C9C6BB; cursor: not-allowed; }
        .btn-link { background: none; border: none; color: var(--ink-soft); font-size: 12px; font-weight: 700; cursor: pointer; padding: 0; text-decoration: underline; }
        .btn-link.warn-link { color: var(--bad); }
        .hint-text { font-size: 10.5px; color: var(--bad); margin-top: 4px; }
        .attend-row { display: flex; align-items: center; gap: 14px; padding: 14px 2px; border-bottom: 1px solid var(--line); }
        .attend-name { width: 90px; font-size: 13.5px; font-weight: 700; color: var(--ink); flex-shrink: 0; }
        .attend-class { width: 150px; font-size: 12px; color: var(--ink-soft); flex-shrink: 0; }
        .attend-dates { flex: 1; display: flex; gap: 6px; flex-wrap: wrap; }
        .attend-chip { font-size: 11px; font-weight: 600; color: var(--ink-soft); background: var(--accent-soft); padding: 3px 8px; border-radius: 999px; }
        .attend-btn { background: var(--surface); border: 1.5px solid var(--line); color: var(--ink); border-radius: 8px; padding: 7px 12px; font-weight: 700; font-size: 12px; cursor: pointer; flex-shrink: 0; }
        .attend-btn.done { border-color: var(--good); color: var(--good); background: var(--good-soft); cursor: default; }

        .field-label { font-size: 12.5px; font-weight: 700; color: var(--ink); margin-bottom: 6px; display: block; }
        .text-input { width: 100%; padding: 10px 12px; border: 1.5px solid var(--line); border-radius: 10px; font-size: 13.5px; margin-bottom: 18px; color: var(--ink); font-family: inherit; background: var(--surface); }
        textarea.text-input { resize: vertical; min-height: 80px; }
        .file-drop { display: flex; align-items: center; justify-content: center; gap: 8px; border: 1.5px dashed var(--ink-soft); border-radius: 12px; padding: 16px; margin-bottom: 18px; color: var(--ink-soft); font-size: 13px; font-weight: 600; cursor: pointer; }
        .file-drop.has-file { border-style: solid; border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }
        .picker-class-head { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: var(--ink); padding-bottom: 7px; border-bottom: 1px dashed var(--line); margin-bottom: 2px; cursor: pointer; }
        .picker-class-head span { font-weight: 500; color: var(--ink-soft); }
        .picker-row { display: flex; align-items: center; gap: 10px; padding: 8px 4px 8px 22px; cursor: pointer; }
        .picker-name { flex: 1; font-size: 13.5px; color: var(--ink); }
        .picker-meta { font-size: 11.5px; color: var(--ink-soft); }

        .assign-btn { background: var(--ink); color: #fff; border: none; border-radius: 10px; padding: 11px 22px; font-weight: 700; font-size: 13.5px; cursor: pointer; margin-top: 4px; }
        .assign-btn:disabled { background: #C9C6BB; cursor: not-allowed; }

        .section-label { font-size: 12px; font-weight: 700; color: var(--ink-soft); margin: 26px 0 4px; }
        .history-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 2px; border-bottom: 1px solid var(--line); }
        .history-row .h-name { font-size: 13.5px; font-weight: 700; color: var(--ink); }
        .history-row .h-meta { font-size: 11.5px; color: var(--ink-soft); margin-top: 2px; }
        .history-row .h-count { font-size: 12.5px; font-weight: 700; color: var(--accent); }
        .history-row .h-count-button { background: none; border: none; padding: 0; cursor: pointer; font-family: inherit; }
        .assigned-students { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
        .assigned-students span { font-size: 11.5px; color: var(--ink); background: var(--accent-soft); border-radius: 999px; padding: 4px 8px; }
        .qr-panel { display: flex; gap: 16px; align-items: flex-start; padding: 14px 2px 20px; border-bottom: 1px solid var(--line); }
        .qr-panel img { border: 1px solid var(--line); border-radius: 8px; flex-shrink: 0; background: #fff; padding: 6px; }
        .qr-info { flex: 1; }
        .qr-hint { font-size: 12px; color: var(--ink-soft); line-height: 1.6; margin-bottom: 8px; }
        .qr-url { font-size: 11px; color: var(--ink-soft); background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 6px 8px; word-break: break-all; }

        .notice-item { padding: 13px 2px; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; gap: 10px; }
        .notice-item .n-title { font-size: 13.5px; font-weight: 700; color: var(--ink); }
        .notice-item .n-date { font-size: 11px; color: var(--ink-soft); margin-left: 8px; }
        .notice-item .n-body { font-size: 12.5px; color: var(--ink-soft); margin-top: 5px; line-height: 1.6; }
        .notice-item .n-del { background: none; border: none; color: var(--ink-soft); cursor: pointer; flex-shrink: 0; }

        .toast { position: absolute; bottom: 22px; left: 50%; transform: translateX(-50%); background: var(--ink); color: #fff; font-size: 12.5px; font-weight: 600; padding: 10px 18px; border-radius: 999px; box-shadow: 0 8px 20px rgba(0,0,0,0.25); white-space: nowrap; }
      `}</style>

      <div className="sheet">
        <div className="header">
          <div className="header-brand">
            <img src={MARK_NAVY_SRC} alt="제뉴인학원" />
            <span>제뉴인학원 관리자</span>
          </div>
          <div className="header-date">{new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}</div>
        </div>

        <div className="tabs">
          <div className={`tab-item ${tab === "members" ? "active" : ""}`} onClick={() => setTab("members")}>
            <Users size={15} /> 회원 관리
            {pendingCount > 0 && <span className="tab-count">{pendingCount}</span>}
          </div>
          <div className={`tab-item ${tab === "attendance" ? "active" : ""}`} onClick={() => setTab("attendance")}>
            <CalendarCheck size={15} /> 출석 체크
          </div>
          <div className={`tab-item ${tab === "vocab" ? "active" : ""}`} onClick={() => setTab("vocab")}>
            <BookOpen size={15} /> 단어 업로드
          </div>
          <div className={`tab-item ${tab === "homework" ? "active" : ""}`} onClick={() => setTab("homework")}>
            <ClipboardCheck size={15} /> 숙제 업로드
          </div>
          <div className={`tab-item ${tab === "notices" ? "active" : ""}`} onClick={() => setTab("notices")}>
            <Bell size={15} /> 공지사항
          </div>
          <div className={`tab-item ${tab === "vocab-tests" ? "active" : ""}`} onClick={() => setTab("vocab-tests")}>
            <ClipboardCheck size={15} /> 단어시험 채점
          </div>
        </div>

        <div className="body">
          {tab === "members" && (
            <>
              <div className="page-title">회원 관리</div>
              <div className="page-sub">가입 신청을 승인하거나, 학원을 그만둔 학생의 사용 권한을 박탈할 수 있어요</div>
              <div className="filter-tabs">
                {[["pending", "승인 대기"], ["approved", "승인됨"], ["revoked", "박탈됨"], ["all", "전체"]].map(([key, label]) => (
                  <div key={key} className={`filter-tab ${memberFilter === key ? "active" : ""}`} onClick={() => setMemberFilter(key)}>{label}</div>
                ))}
              </div>
              <table>
                <thead><tr><th>이름</th><th>전화번호</th><th>반</th><th>상태</th><th>액션</th></tr></thead>
                <tbody>
                  {filteredMembers.length === 0 && <tr className="empty-row"><td colSpan={5}>해당하는 학생이 없어요</td></tr>}
                  {filteredMembers.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.phone}</td>
                      <td>
                        <select className="class-select" value={s.classId || ""} onChange={(e) => assignClass(s.id, e.target.value)}>
                          <option value="">반 미배정</option>
                          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </td>
                      <td>
                        <span className="status-dot"><span className="dot" style={{ background: statusMeta[s.status].color }} />{statusMeta[s.status].label}</span>
                      </td>
                      <td>
                        <div className="actions">
                          {s.status === "pending" && (
                            <>
                              <button className="btn-primary" disabled={!s.classId} onClick={() => approveStudent(s.id)}><Check size={12} />승인</button>
                              <button className="btn-link" onClick={() => rejectStudent(s.id)}>반려</button>
                              {!s.classId && <div className="hint-text">반 배정 필요</div>}
                            </>
                          )}
                          {s.status === "approved" && (
                            <>
                              <button className="btn-link" onClick={() => copyReportLink(s)}><Link2 size={11} style={{ verticalAlign: "middle", marginRight: 3 }} />리포트 링크 복사</button>
                              <button className="btn-link warn-link" onClick={() => revokeStudent(s.id)}>권한 박탈</button>
                            </>
                          )}
                          {s.status === "revoked" && <button className="btn-link" onClick={() => restoreStudent(s.id)}>다시 승인</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {tab === "attendance" && (
            <>
              <div className="page-title">출석 체크</div>
              <div className="page-sub">체크하면 오늘 날짜가 자동으로 기록돼요</div>
              {approvedStudents.length === 0 && (
                <div className="empty-row" style={{ padding: "30px 0" }}>
                  승인된 학생이 없어요. 회원 관리에서 학생을 승인한 뒤 출석을 체크해주세요.
                </div>
              )}
              {approvedStudents.map((s) => {
                const cls = classes.find((c) => c.id === s.classId);
                const dates = (attendance[s.id] || []).filter(isCurrentMonth);
                const checkedToday = dates.includes(todayKey());
                return (
                  <div className="attend-row" key={s.id}>
                    <div className="attend-name">{s.name}</div>
                    <div className="attend-class">{cls?.name}</div>
                    <div className="attend-dates">
                      {dates.slice(-5).map((d, i) => <span className="attend-chip" key={i}>{displayDate(d)}</span>)}
                      {dates.length === 0 && <span className="attend-chip">출석 기록 없음</span>}
                    </div>
                    <button className={`attend-btn ${checkedToday ? "done" : ""}`} onClick={() => checkAttendance(s.id)}>
                      {checkedToday ? "출석 취소" : "오늘 출석 체크"}
                    </button>
                  </div>
                );
              })}
            </>
          )}
          {tab === "vocab" && (
            <>
              <div className="page-title">단어 업로드</div>
              <div className="page-sub">같은 단어를 받을 학생만 선택하세요. 학생별·반별 단어 수가 다르면 CSV를 따로 올려 각각 배정하면 돼요.</div>
              <label className="field-label">주차 이름</label>
              <input className="text-input" placeholder="예: 1주차 초1A 단어" value={vocabSetName} onChange={(e) => setVocabSetName(e.target.value)} />
              <label className="field-label">단어 파일</label>
              <label className={`file-drop ${vocabFileName ? "has-file" : ""}`} htmlFor="vocabFileInput">
                <FileUp size={16} />{vocabFileName ? `${vocabFileName} · ${vocabWords.length}개` : "CSV 파일 선택"}
              </label>
              <input id="vocabFileInput" type="file" accept=".csv" style={{ display: "none" }} onChange={handleVocabFileChange} />
              <label className="field-label">배정할 학생</label>
              <StudentPicker students={students} classes={classes} selected={vocabSelected} onToggle={toggleSel(setVocabSelected)} onToggleClass={toggleGroupSel(setVocabSelected)} />
              <button className="assign-btn" disabled={!vocabFileName || !vocabSetName || vocabWords.length === 0 || vocabSelected.size === 0} onClick={submitVocab}>
                {vocabSelected.size > 0 ? `${vocabSelected.size}명에게 배정하기` : "배정하기"}
              </button>
              <div className="section-label">업로드 내역</div>
              {vocabSets.map((v) => (
                <div className="history-row" key={v.id}>
                  <div style={{ flex: 1 }}>
                    <div className="h-name">{v.name}</div>
                    <div className="h-meta">{v.createdAt} 업로드</div>
                    {expandedVocabSetId === v.id && v.assignedNames?.length > 0 && (
                      <div className="assigned-students">
                        {v.assignedNames.map((name) => <span key={name}>{name}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="actions">
                    <button
                      className="h-count h-count-button"
                      type="button"
                      onClick={() => setExpandedVocabSetId((prev) => (prev === v.id ? null : v.id))}
                    >
                      {v.assignedCount}명에게 배정됨
                    </button>
                    <button className="n-del" onClick={() => deleteVocabSet(v.id)} aria-label="삭제"><X size={15} /></button>
                  </div>
                </div>
              ))}
            </>
          )}
          {tab === "homework" && (
            <>
              <div className="page-title">숙제 업로드</div>
              <div className="page-sub">문제 수와 정답을 입력하고 학생을 체크해 배정하면 자동채점 기준으로 쓰여요</div>
              <label className="field-label">숙제 제목</label>
              <input className="text-input" placeholder="예: 문법 워크북 UNIT 6" value={hwTitle} onChange={(e) => setHwTitle(e.target.value)} />
              <label className="field-label">문제 수</label>
              <input className="text-input" type="number" min={1} max={30} value={hwTotal} onChange={(e) => handleHwTotalChange(e.target.value)} />
              <label className="field-label">정답 입력</label>
              <div style={{ marginBottom: 4 }}>
                {hwKey.map((val, i) => (
                  <div className="attend-row" key={i} style={{ padding: "8px 2px" }}>
                    <div style={{ width: 44, fontSize: 12.5, fontWeight: 700, color: "var(--ink-soft)" }}>{i + 1}번</div>
                    <div style={{ display: "flex", gap: 6, flex: 1 }}>
                      {["①", "②", "③", "④"].map((label, oi) => (
                        <div key={oi}
                          style={{ flex: 1, border: `1.5px solid ${val === oi ? "var(--accent)" : "var(--line)"}`, background: val === oi ? "var(--accent-soft)" : "var(--paper)", color: val === oi ? "var(--accent)" : "var(--ink-soft)", borderRadius: 8, padding: "7px 0", textAlign: "center", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                          onClick={() => setHwKey((prev) => prev.map((v, vi) => (vi === i ? oi : v)))}>
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <label className="field-label" style={{ marginTop: 18 }}>배정할 학생</label>
              <StudentPicker students={students} classes={classes} selected={hwSelected} onToggle={toggleSel(setHwSelected)} onToggleClass={toggleGroupSel(setHwSelected)} />
              <button className="assign-btn" disabled={!hwTitle || hwKey.some((k) => k === null) || hwSelected.size === 0} onClick={submitHomework}>
                {hwSelected.size > 0 ? `${hwSelected.size}명에게 배정하기` : "배정하기"}
              </button>
              <div className="section-label">업로드 내역</div>
              {homeworkDefs.map((h) => (
                <div key={h.id}>
                  <div className="history-row">
                    <div><div className="h-name">{h.title}</div><div className="h-meta">{h.createdAt} 업로드 · {h.totalQuestions}문제</div></div>
                    <div className="actions">
                      <div className="h-count">{h.assignedCount}명에게 배정됨</div>
                      <button className="btn-link" onClick={() => openQr(h.id)}>
                        <QrCode size={12} style={{ verticalAlign: "middle", marginRight: 3 }} />QR 코드
                      </button>
                      <button className="n-del" onClick={() => deleteHomeworkDef(h.id)} aria-label="삭제"><X size={15} /></button>
                    </div>
                  </div>
                  {qrOpenId === h.id && (
                    <div className="qr-panel">
                      <img
                        src={qrDataUrls[h.id]}
                        alt={`${h.title} QR 코드`}
                        width={140} height={140}
                      />
                      <div className="qr-info">
                        <div className="qr-hint">이 QR을 워크시트에 인쇄하면, 학생이 스캔했을 때 이 숙제의 답안 체크 화면이 바로 열려요.</div>
                        <div className="qr-url">{homeworkUrl(h.id)}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="section-label">제출 결과</div>
              {homeworkResults.length === 0 && <div className="empty-row">아직 제출된 숙제 결과가 없어요</div>}
              {homeworkResults.map((result) => (
                <div className="notice-item" key={result.id}>
                  <div style={{ flex: 1 }}>
                    <div className="n-title">
                      {result.students?.name || "학생"}
                      <span className="n-date">{new Date(result.submitted_at).toLocaleDateString("ko-KR")}</span>
                    </div>
                    <div className="n-body">
                      {result.homework_assignments?.title || "숙제"} · {result.score ?? 0} / {result.homework_assignments?.total_questions ?? 0}
                    </div>
                  </div>
                  <div className="actions" style={{ alignSelf: "center" }}>
                    <div className="h-count">{result.score ?? 0}점</div>
                    <button className="n-del" onClick={() => deleteHomeworkResult(result.id)} aria-label="삭제"><X size={15} /></button>
                  </div>
                </div>
              ))}
            </>
          )}
          {tab === "notices" && (
            <>
              <div className="page-title">공지사항</div>
              <div className="page-sub">게시하면 모든 학생 앱에 바로 노출돼요</div>
              <label className="field-label">제목</label>
              <input className="text-input" placeholder="예: 이번 주 시험 일정 안내" value={noticeTitle} onChange={(e) => setNoticeTitle(e.target.value)} />
              <label className="field-label">내용</label>
              <textarea className="text-input" placeholder="공지 내용을 입력하세요" value={noticeBody} onChange={(e) => setNoticeBody(e.target.value)} />
              <button className="assign-btn" disabled={!noticeTitle || !noticeBody} onClick={postNotice}>게시하기</button>
              <div className="section-label">게시된 공지</div>
              {notices.map((n) => (
                <div className="notice-item" key={n.id}>
                  <div style={{ flex: 1 }}>
                    <span className="n-title">{n.title}</span><span className="n-date">{n.date}</span>
                    <div className="n-body">{n.content}</div>
                  </div>
                  <button className="n-del" onClick={() => deleteNotice(n.id)}><X size={15} /></button>
                </div>
              ))}
            </>
          )}
          {tab === "vocab-tests" && (
            <>
              <div className="page-title">단어시험 채점</div>
              <div className="page-sub">제출된 사진은 채점 후 7일 뒤 자동 삭제됩니다.</div>
              {vocabTests.length === 0 && <div className="empty-row">제출된 단어시험이 없어요</div>}
              {vocabTests.map((test) => (
                <div className="notice-item" key={test.id}>
                  <div style={{ flex: 1 }}>
                    <div className="n-title">{test.students?.name || "학생"}<span className="n-date">{new Date(test.submitted_at).toLocaleDateString("ko-KR")}</span></div>
                    {vocabPhotoUrls[test.id] && <><img src={vocabPhotoUrls[test.id]} alt="제출한 단어시험" style={{ display: "block", maxWidth: "min(100%, 640px)", maxHeight: 640, objectFit: "contain", margin: "12px 0", borderRadius: 8 }} /><div className="actions"><button className="btn-link" onClick={() => window.open(vocabPhotoUrls[test.id], "_blank", "noopener,noreferrer")}><ExternalLink size={12} style={{ verticalAlign: "middle", marginRight: 3 }} /> 크게 보기</button><button className="btn-link" onClick={() => downloadVocabPhoto(test)}><Download size={12} style={{ verticalAlign: "middle", marginRight: 3 }} /> 다운로드</button></div></>}
                    {test.status === "graded" ? <div className="n-body">채점 완료 · {test.score}/{test.total}</div> : <div className="actions" style={{ marginTop: 10 }}><button className="btn-link" onClick={() => openVocabPhoto(test)}>사진 보기</button><input className="class-select" type="number" min="0" placeholder="점수" value={gradeInputs[test.id]?.score || ""} onChange={(e) => setGradeInputs((prev) => ({ ...prev, [test.id]: { ...prev[test.id], score: e.target.value } }))} /><input className="class-select" type="number" min="1" placeholder="총점" value={gradeInputs[test.id]?.total || ""} onChange={(e) => setGradeInputs((prev) => ({ ...prev, [test.id]: { ...prev[test.id], total: e.target.value } }))} /><button className="btn-primary" onClick={() => gradeVocabTest(test)}>채점 저장</button></div>}
                  </div>
                  <button className="n-del" onClick={() => deleteVocabSubmission(test.id)} aria-label="삭제"><X size={15} /></button>
                </div>
              ))}
            </>
          )}
        </div>
        {toast && <div className="toast">{toast}</div>}
      </div>
    </div>
  );
}
