import { useEffect, useState } from "react";
import { Title, Detail, Button, TextInput, Badge, Spinner } from "@krds-ui/core";
import { UserPlus } from "lucide-react"

/** 추후에 컴포넌트로 뺄 예정 */
function KRDSCard({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <main className="mx-auto max-w-[640px] px-4 py-8" role="main">
      <div
        className={[
          "bg-gray-0 border border-gray-20 rounded-xl shadow-sm",
          "p-6 tablet:p-8",
          className,
        ].join(" ")} // 배열 - 공백 문자열로 합치기
      >
        {children}
      </div>
    </main>
  );
}

/** ---- Base Url 타입가드 안전 접근 ---- */
type ViteEnv = { VITE_API_BASE_URL?: string };
type ImportMetaLike = { env?: ViteEnv };
const viteEnv: ViteEnv | undefined = (import.meta as unknown as ImportMetaLike).env;

const API_BASE = viteEnv?.VITE_API_BASE_URL ?? "http://3.39.207.166:8080";

/** ---- API 타입 가드---- */
type ApiMessage = { message?: string; error?: string };

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null;
}

function isApiMessage(val: unknown): val is ApiMessage {
  // 서버가 message/error를 문자열로 주는지 우선 체크
  return (
    isRecord(val) &&
    (typeof (val).message === "string" ||
      typeof (val ).error === "string" ||
      "message" in val ||
      "error" in val)
  );
}

/** JSON 파싱 실패 시 null 반환 */
async function parseJsonSafe(res: Response): Promise<unknown | null> {
  // res.json()은 예외를 던질 수 있고, 본문이 JSON이 아닐 수도 있음
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

/** 이메일 인증번호 발송 */
async function sendEmailCode(email: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/api/users/email/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify({ email }),
  });

  const parsed = await parseJsonSafe(res);
  const json: ApiMessage | null = isApiMessage(parsed) ? parsed : null;

  if (!res.ok) {
    const msg =
      json?.message || json?.error || `이메일 인증번호 발송 실패 (${res.status})`;
    throw new Error(msg); 
  }
  return { message: json?.message ?? "인증번호를 발송했습니다. (유효시간 5분)" };
}

/** 이메일 인증번호 검증 */
async function verifyEmailCode(
  email: string,
  code: string
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/api/users/email/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });

  const parsed = await parseJsonSafe(res);
  const json: ApiMessage | null = isApiMessage(parsed) ? parsed : null;

  if (!res.ok) {
    const msg = json?.message || json?.error || `인증번호 검증 실패 (${res.status})`;
    throw new Error(msg);
  }
  return { message: json?.message ?? "이메일 인증이 완료되었습니다." };
}

type SignupFormState = {
  loginId: string;
  password: string;
  name: string;
  nickname: string;
  email: string;
  phoneNumber: string;
};

export default function SignupForm() {
  const [form, setForm] = useState<SignupFormState>({
    loginId: "",
    password: "",
    name: "",
    nickname: "",
    email: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [msg, setMsg] = useState<string | null>(null);

  // 이메일 인증 관련 상태
  const [emailMsg, setEmailMsg] = useState<string | null>(null);
  const [emailLoading, setEmailLoading] = useState<boolean>(false);
  const [verifyCode, setVerifyCode] = useState<string>("");
  const [verified, setVerified] = useState<boolean>(false);
  const [leftSec, setLeftSec] = useState<number>(0);

  // 타이머
  useEffect(() => {
    // leftSec이 0이면 타이머 생성 안 함
    if (leftSec <= 0) return;
    const t = setInterval(() => setLeftSec((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [leftSec]);

  // 인풋 변경
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((f) => ({ ...f, [id]: value }));
  };

  // 인증번호 발송
  const handleSendCode = async () => {
    setEmailMsg(null);
    setVerified(false); // 새로 발송하면 기존 인증은 무효화

    if (!form.email.trim()) {
      setEmailMsg("이메일을 입력해 주세요.");
      return;
    }

    setEmailLoading(true);
    try {
      const { message } = await sendEmailCode(form.email.trim());
      setEmailMsg(message);
      setLeftSec(300); // 유효시간 5분(초 단위) - 타이머 시작
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "인증번호 발송 중 오류가 발생했습니다.";
      setEmailMsg(msg);
    } finally {
      setEmailLoading(false);
    }
  };

  // 인증번호 검증
  const handleVerifyCode = async () => {
    setEmailMsg(null);

    if (!verifyCode.trim()) {
      setEmailMsg("인증번호 6자리를 입력해 주세요.");
      return;
    }

    setEmailLoading(true);
    try {
      const { message } = await verifyEmailCode(
        form.email.trim(),
        verifyCode.trim()
      );
      setEmailMsg(message);
      setVerified(true); 
      setLeftSec(0); 
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "인증번호가 올바르지 않습니다.";
      setVerified(false);
      setEmailMsg(msg);
    } finally {
      setEmailLoading(false);
    }
  };

  // 회원가입
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    // 필수값 최소 검증: 서버 단 검증 전, UX 차원에서 빠른 피드백
    const required: Array<keyof SignupFormState> = [
      "loginId",
      "password",
      "name",
      "nickname",
      "email",
      "phoneNumber",
    ];
    for (const key of required) {
      if (!form[key].trim()) {
        setMsg("모든 항목을 입력해 주세요.");
        return;
      }
    }

    // 이메일 인증 완료 여부를 한 번 더 가드
    if (!verified) {
      setMsg("이메일 인증을 완료해 주세요.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const parsed = await parseJsonSafe(res);
      const data: ApiMessage | null = isApiMessage(parsed) ? parsed : null;

      if (!res.ok) {
        setMsg(
          (data && (data.message || data.error)) ||
            `회원가입 실패 (${res.status})`
        );
        return;
      }

      setMsg(data?.message ?? "회원가입에 성공했습니다.");

      setForm({
        loginId: "",
        password: "",
        name: "",
        nickname: "",
        email: "",
        phoneNumber: "",
      });
      setVerifyCode("");
      setVerified(false);
      setLeftSec(0);
      setEmailMsg(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setMsg(`네트워크/파싱 오류: ${message}`);
    } finally {
      setLoading(false);
    }
  }



    return (
    <KRDSCard>
      {/* 상단 헤더 */}
      <header className="text-center py-6">
        <div
          className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--krds-green-60, #16a34a)" }}
          aria-hidden="true"
        >
          <UserPlus size={22} color="#fff" strokeWidth={2} />
        </div>

        <Title size="l">경기 파트너스 회원가입</Title>
        <Detail size="s">지역 문제 해결의 파트너가 되어주세요</Detail>
      </header>


      <form onSubmit={onSubmit} className="grid gap-y-4">
        {/* 기본 정보 섹션 */}
        <section className="grid gap-y-4">
          <Title size="l">기본 정보</Title>
          <hr
            role="separator"
            className="my-2 border-0 h-px"
            style={{ background: "var(--krds-gray-20, #e5e7eb)" }}
          />

          <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
            <TextInput
              id="loginId"
              title="아이디"
              placeholder="new_user"
              required
              autoComplete="username"
              value={form.loginId}
              onChange={onChange}
              length="full"
            />
            <TextInput
              id="name"
              title="이름"
              placeholder="홍길동"
              required
              autoComplete="name"
              value={form.name}
              onChange={onChange}
              length="full"
            />
          </div>

          <TextInput
            id="password"
            title="비밀번호"
            type="password"
            placeholder="8자 이상, 특수문자 포함 권장"
            required
            autoComplete="new-password"
            value={form.password}
            onChange={onChange}
            length="full"
          />

          <TextInput
            id="nickname"
            title="닉네임"
            placeholder="길동이"
            required
            value={form.nickname}
            onChange={onChange}
            length="full"
          />
        </section>

        {/* 연락처 섹션 */}
        <section className="grid gap-y-4">
          <Title size="l">연락처 정보</Title>
          <hr
            role="separator"
            className="my-2 border-0 h-px"
            style={{ background: "var(--krds-gray-20, #e5e7eb)" }}
          />

          {/* 이메일 입력 */}
          <div className="grid gap-y-2">
            <TextInput
              id="email"
              title="이메일"
              type="email"
              placeholder="hong@example.com"
              required
              autoComplete="email"
              length="full"
              style={{ width: "100%" }}
              value={form.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setForm((f) => ({ ...f, email: e.target.value }));
                setVerified(false);
                setVerifyCode("");
                setLeftSec(0);
                setEmailMsg(null);
              }}
              helpText={!verified ? "인증 메일을 수신할 주소를 입력하세요." : " "}
              error={!verified && emailMsg ? emailMsg : undefined}
            />

            <div className="grid grid-cols-[2fr_1fr_1fr] gap-2 items-center">
              <TextInput
                id="emailCode"
                aria-label="인증번호"
                placeholder="6자리"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={verifyCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setVerifyCode(e.target.value)
                }
              />

              <Button
                type="button"
                onClick={handleSendCode}
                disabled={emailLoading || !form.email}
                variant="secondary"
                size="small"
              >
                {emailLoading ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Spinner size="small" /> 전송 중...
                  </span>
                ) : leftSec > 0 ? (
                  `재전송 (${Math.floor(leftSec / 60)}:${String(leftSec % 60).padStart(
                    2,
                    "0"
                  )})`
                ) : (
                  "인증번호 발송"
                )}
              </Button>

              <Button
                type="button"
                onClick={handleVerifyCode}
                disabled={emailLoading || !verifyCode}
                size="small"
              >
                {verified ? "인증 완료" : "인증 확인"}
              </Button>
            </div>

            {verified && <Detail className="mt-1">✔ 이메일 인증 완료</Detail>}
          </div>

          <TextInput
            id="phoneNumber"
            title="휴대폰 번호"
            placeholder="010-1234-5678"
            required
            inputMode="tel"
            autoComplete="tel"
            value={form.phoneNumber}
            onChange={onChange}
            length="full"
          />
        </section>

        {/* 제출 버튼 */}
        <Button
          type="submit"
          disabled={loading || !verified}
          variant="primary"
          size="medium"
          className="mt-1"
        >
          {loading ? (
            <span className="inline-flex items-center gap-1.5">
              <Spinner size="small" /> 처리 중...
            </span>
          ) : (
            "회원가입"
          )}
        </Button>
      </form>

      {msg && (
        <div className="mt-4">
          <Badge
            label={msg}
            variant={
              msg.includes("성공")
                ? "success"
                : msg.includes("실패")
                ? "danger"
                : "default"
            }
            size="small"
            appearance="fill"
          />
        </div>
      )}
    </KRDSCard>
  );
}
