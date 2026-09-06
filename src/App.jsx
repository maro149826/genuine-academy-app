import { useEffect, useState } from "react";
import StudentApp from "../student_app_prototype";
import AdminDashboard from "../admin_dashboard_prototype";
import ParentReport from "../parent_report_prototype";
import { ArrowLeft, ArrowRight, Clock3, LockKeyhole, LogIn, UserRound, XCircle } from "lucide-react";
import { supabase } from "./lib/supabase";

function getStoredAccount() {
  try { return JSON.parse(localStorage.getItem("genuine-session")) || null; } catch { return null; }
}

function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");

  async function submit(event) {
    event.preventDefault();
    const normalizedPhone = phone.replace(/\s/g, "");
    if (!name.trim() || !normalizedPhone) return setMessage("이름과 전화번호를 모두 입력해주세요.");
    setMessage("");
    const functionName = mode === "signup" ? "request_student_access" : "student_login";
    const { data, error } = await supabase.rpc(functionName, { p_name: name.trim(), p_phone: normalizedPhone });
    if (error) {
      setMessage("서버에 연결하지 못했어요. 잠시 후 다시 시도해주세요.");
      return;
    }
    const account = data?.[0];
    if (!account) {
      setMessage("일치하는 가입 신청이 없어요. 먼저 가입 신청을 해주세요.");
      return;
    }
    localStorage.setItem("genuine-session", JSON.stringify(account));
    onLogin(account);
  }

  return <main className="auth-shell">
    <section className="auth-panel">
      <div className="brand-mark">G</div>
      <p className="eyebrow">GENUINE ACADEMY</p>
      <h1>{mode === "login" ? "다시 만나서 반가워요" : "학습을 시작해볼까요"}</h1>
      <p className="auth-copy">이름과 전화번호로 간편하게 시작하세요.<br />관리자 승인 후 모든 학습 기능을 사용할 수 있어요.</p>
      <form onSubmit={submit} className="auth-form">
        <label>이름<input value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 김민지" autoComplete="name" /></label>
        <label>전화번호<input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" inputMode="tel" autoComplete="tel" /></label>
        {message && <p className="form-message">{message}</p>}
        <button className="auth-submit" type="submit"><LogIn size={17} />{mode === "login" ? "로그인" : "가입 신청하기"}</button>
      </form>
      <button className="mode-switch" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage(""); }}>
        {mode === "login" ? "처음 이용하시나요? 가입 신청" : "이미 계정이 있나요? 로그인"} <ArrowRight size={14} />
      </button>
      <div className="demo-hint"><UserRound size={14} /> 가입 신청 후 관리자 승인까지 잠시 기다려주세요.</div>
    </section>
  </main>;
}

function BlockedState({ account, onLogout }) {
  const pending = account.status === "pending";
  return <main className="blocked-shell">
    <section className="blocked-panel">
      <div className={`state-icon ${pending ? "pending" : "revoked"}`}>{pending ? <Clock3 size={30} /> : <XCircle size={30} />}</div>
      <p className="eyebrow">GENUINE ACADEMY</p>
      <h1>{pending ? "승인 대기 중이에요" : "이용이 종료되었어요"}</h1>
      <p>{pending ? `${account.name}님의 가입 신청을 확인하고 있어요.` : "현재 학습 기능을 사용할 수 없는 상태예요."}</p>
      <div className="notice-box">{pending ? "관리자가 재원생 여부를 확인한 뒤 승인해드려요. 승인되면 다시 로그인할 필요 없이 다음 화면에서 바로 사용할 수 있어요." : "이용 상태가 변경된 경우 학원으로 문의해주세요."}</div>
      <button className="outline-button" onClick={onLogout}><ArrowLeft size={16} /> 다른 계정으로 로그인</button>
    </section>
  </main>;
}

function AdminGate() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        if (active) setChecking(false);
        return;
      }
      const { data: admin } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", data.session.user.id)
        .maybeSingle();
      if (active) {
        setSession(admin ? data.session : null);
        setChecking(false);
      }
    }
    loadSession();
    const { data: listener } = supabase.auth.onAuthStateChange(() => loadSession());
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      setMessage("이메일 또는 비밀번호를 확인해주세요.");
      return;
    }
    const { data: admin } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", data.session.user.id)
      .maybeSingle();
    if (!admin) {
      await supabase.auth.signOut();
      setMessage("관리자 권한이 등록되지 않은 계정입니다.");
      return;
    }
    setSession(data.session);
  }

  if (checking) return <main className="auth-shell"><section className="auth-panel"><p className="eyebrow">GENUINE ACADEMY</p><h1>관리자 확인 중</h1></section></main>;
  if (session) return <AdminDashboard />;

  return <main className="auth-shell">
    <section className="auth-panel">
      <div className="brand-mark">G</div>
      <p className="eyebrow">GENUINE ACADEMY ADMIN</p>
      <h1>관리자 로그인</h1>
      <p className="auth-copy">등록된 관리자 계정으로 로그인해주세요.</p>
      <form onSubmit={submit} className="auth-form">
        <label>이메일<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" autoComplete="email" /></label>
        <label>비밀번호<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" autoComplete="current-password" /></label>
        {message && <p className="form-message">{message}</p>}
        <button className="auth-submit" type="submit"><LogIn size={17} />관리자 로그인</button>
      </form>
    </section>
  </main>;
}

function App() {
  const [account, setAccount] = useState(getStoredAccount);
  const path = window.location.pathname;
  useEffect(() => { document.title = path.startsWith("/admin") ? "제뉴인학원 관리자" : "제뉴인학원"; }, [path]);

  useEffect(() => {
    if (!account || path.startsWith("/admin") || path.startsWith("/report")) return undefined;
    let active = true;
    async function refreshStudentStatus() {
      const { data, error } = await supabase.rpc("student_login", {
        p_name: account.name,
        p_phone: account.phone,
      });
      const latestAccount = data?.[0];
      if (!active) return;
      if (error || !latestAccount) {
        localStorage.removeItem("genuine-session");
        setAccount(null);
        return;
      }
      localStorage.setItem("genuine-session", JSON.stringify(latestAccount));
      setAccount(latestAccount);
    }
    refreshStudentStatus();
    return () => { active = false; };
  }, [account?.id, path]);

  if (path.startsWith("/admin")) return <AdminGate />;
  if (path.startsWith("/report")) return <ParentReport />;
  if (!account) return <Login onLogin={setAccount} />;
  if (account.status !== "approved") return <BlockedState account={account} onLogout={() => { localStorage.removeItem("genuine-session"); setAccount(null); }} />;
  return <div className="app-frame"><StudentApp account={account} /><button className="logout-button" onClick={() => { localStorage.removeItem("genuine-session"); setAccount(null); }} aria-label="로그아웃"><LockKeyhole size={14} /> 로그아웃</button></div>;
}

export default App;
