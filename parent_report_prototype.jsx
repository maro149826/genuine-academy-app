import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { supabase } from "./src/lib/supabase";

const MARK_NAVY_SRC = "data:image/png;base64,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";

/* ---------- sample data (in production, resolved from the ?key= token) ---------- */
const student = {
  name: "김도윤",
  className: "초등 3-4학년 A반",
  attendanceThisMonth: 8,
  attendanceDates: ["9/1", "9/2", "9/4", "9/5", "9/8", "9/9", "9/11", "9/12"],
  vocabTests: [
    { date: "9월 8일", score: 17, total: 20, graded: true },
    { date: "9월 1일", score: 15, total: 20, graded: true },
    { date: "9월 15일", graded: false },
  ],
  homework: [
    { title: "리스닝 워크시트 2", date: "9월 10일", score: 7, total: 8 },
    { title: "문법 워크북 UNIT 5", date: "9월 5일", score: 13, total: 15 },
  ],
};

export default function ParentReport() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadReport() {
      const token = new URLSearchParams(window.location.search).get("key");
      if (!token) {
        setError(true);
        return;
      }
      const { data, error: reportError } = await supabase.rpc("get_parent_report", { p_report_token: token });
      if (reportError || !data) {
        setError(true);
        return;
      }
      setReport({
        name: data.student.name,
        className: data.student.class_name,
        attendanceThisMonth: data.attendance_this_month,
        attendanceDates: data.attendance_dates,
        vocabTests: data.vocab_tests,
        homework: data.homework,
      });
    }
    loadReport();
  }, []);

  return (
    <div className="parent-report">
      <style>{`
        .parent-report {
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
          --backdrop: #12172A;
          font-family: 'Pretendard', 'Apple SD Gothic Neo', 'Malgun Gothic', -apple-system, sans-serif;
          background: var(--backdrop);
          padding: 32px 14px;
          display: flex;
          justify-content: center;
          box-sizing: border-box;
        }
        .parent-report * { box-sizing: border-box; }
        .phone {
          width: 100%; max-width: 400px; min-height: 720px;
          background: var(--paper);
          border-radius: 26px;
          overflow: hidden;
          box-shadow: 0 24px 50px rgba(0,0,0,0.4);
          display: flex; flex-direction: column;
        }
        .top-bar { background: var(--ink); color: #fff; padding: 26px 22px 22px; }
        .top-bar .brand { display: flex; align-items: center; gap: 8px; margin-bottom: 18px; }
        .top-bar .brand img { height: 15px; }
        .top-bar .brand span { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.7); }
        .top-bar h1 { font-size: 20px; font-weight: 800; margin: 0 0 4px; }
        .top-bar .sub { font-size: 12.5px; color: rgba(255,255,255,0.6); }

        .content { flex: 1; padding: 22px 22px 26px; }
        .updated { font-size: 11px; color: var(--ink-soft); margin-bottom: 20px; }

        .stat-hero { text-align: center; padding: 6px 0 20px; border-bottom: 1px solid var(--line); margin-bottom: 6px; }
        .stat-hero .num { font-size: 32px; font-weight: 800; color: var(--ink); letter-spacing: -0.5px; }
        .stat-hero .label { font-size: 12.5px; color: var(--ink-soft); margin-top: 4px; }
        .stat-hero .chips { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; margin-top: 14px; }
        .chip { font-size: 11px; font-weight: 600; color: var(--ink-soft); background: var(--accent-soft); padding: 4px 9px; border-radius: 999px; }

        .section-label { font-size: 12px; font-weight: 700; color: var(--ink-soft); margin: 22px 0 4px; }
        .list-row { display: flex; align-items: center; gap: 10px; padding: 13px 2px; border-bottom: 1px solid var(--line); }
        .list-row .main { flex: 1; }
        .list-row .title { font-size: 13.5px; font-weight: 700; color: var(--ink); }
        .list-row .date { font-size: 11.5px; color: var(--ink-soft); margin-top: 3px; }
        .list-row .score { font-size: 15px; font-weight: 800; color: var(--ink); }
        .list-row .pending { display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; color: var(--warn); }

        .footnote { font-size: 10.5px; color: var(--ink-soft); text-align: center; margin-top: 26px; line-height: 1.6; }
      `}</style>

      <div className="phone">
        <div className="top-bar">
          <div className="brand">
            <img src={MARK_NAVY_SRC} alt="제뉴인학원" style={{ filter: "brightness(0) invert(1)" }} />
            <span>제뉴인학원</span>
          </div>
          <h1>{error ? "리포트를 찾을 수 없어요" : report ? `${report.name} 학생 리포트` : "리포트 불러오는 중"}</h1>
          <div className="sub">{error ? "링크를 확인해주세요" : report?.className || "잠시만 기다려주세요"}</div>
        </div>

        <div className="content">
          <div className="updated">방금 업데이트됨</div>

          <div className="stat-hero">
            <div className="num">{report?.attendanceThisMonth || 0}일</div>
            <div className="label">이번 달 출석</div>
            <div className="chips">
              {(report?.attendanceDates || []).map((d, i) => <span className="chip" key={i}>{d}</span>)}
            </div>
          </div>

          <div className="section-label">단어시험 결과</div>
          {(report?.vocabTests || []).map((t, i) => (
            <div className="list-row" key={i}>
              <div className="main">
                <div className="title">단어시험</div>
                <div className="date">{t.date}</div>
              </div>
              {t.graded ? <div className="score">{t.score}/{t.total}</div> : <div className="pending"><Clock size={13} /> 채점 대기</div>}
            </div>
          ))}

          <div className="section-label">숙제 결과</div>
          {(report?.homework || []).map((h, i) => (
            <div className="list-row" key={i}>
              <div className="main">
                <div className="title">{h.title}</div>
                <div className="date">{h.date}</div>
              </div>
              <div className="score">{h.score}/{h.total}</div>
            </div>
          ))}

          <div className="footnote">
            이 링크는 {report?.name || "학생"} 학생 전용입니다.<br />다른 분과 공유하지 말아주세요.
          </div>
        </div>
      </div>
    </div>
  );
}
