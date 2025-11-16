import { useState } from "react";
import { Title, Detail, Button, TextInput, Badge, Spinner } from "@krds-ui/core";
import { Shield, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

/** ----안전한 타입 선언(옵셔널 체이닝 기반) 기본 url 주소 설정  ---- */
type ViteEnv = { VITE_API_BASE_URL?: string };
type ImportMetaLike = { env?: ViteEnv };
const viteEnv: ViteEnv | undefined = (import.meta as unknown as ImportMetaLike).env;
const API_BASE = viteEnv?.VITE_API_BASE_URL ?? "http://3.39.207.166:8080";

/** ---- 카드 래퍼 (SignUpForm과 동일한 컴포넌트) 추후 컴포넌트로 빼서 사용할 예정 ---- */
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
        ].join(" ")}
      >
        {children}
      </div>
    </main>
  );
}

/** ---- api메시지 타입가드 ---- */

// 서버에서 내려주는 응답 중 자주 쓰이는 필드들을 정리한 타입
// (message, error  중 하나라도 포함하면 ApiMessage로 봄)
type LoginResponseData = {
  "userId": number,
  "nickname": "string",
  "email": "string",
  "role": "string",
  "grantType": "string",
  "accessToken": "string",
  "refreshToken": "string"
}

type ApiMessage = {
  message?: string;
  error?: string;
  data?: LoginResponseData;
};

// 값이 객체 형태인지 확인하는 유틸 (null 제외)
// typeof null === "object" 이기 때문에 null 체크까지 같이 해야 함
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

// 받은 데이터가 우리가 기대하는 ApiMessage 형태인지 확인하는 타입가드
// 런타임에 실제 구조를 검사해서 안전하게 타입 좁히기 가능
function isApiMessage(v: unknown): v is ApiMessage {
  return (
    isRecord(v) && // 우선 객체인지 확인
    ("message" in v || "error" in v) // 주요 키 중 하나라도 있으면 통과
  );
}

// fetch 응답을 JSON으로 안전하게 파싱하는 함수
// - JSON이 아니거나 파싱 중 오류가 나도 throw하지 않음
// - 항상 null 또는 파싱된 결과를 반환
async function parseJsonSafe(res: Response): Promise<unknown | null> {
  // 응답 본문을 텍스트로 읽음 (실패 시 빈 문자열)
  const text = await res.text().catch(() => "");
  try {
    // 내용이 있으면 JSON 파싱, 없으면 null 반환
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}


/** ---- 로그인 관련 api ---- */
interface SignInFormProps {
  onLoginSuccess?: () => void; // 로그인 성공 후 실행할 선택적 콜백 (예: 페이지 이동, 상태 갱신 등)
}

export default function SignInForm({ onLoginSuccess }: SignInFormProps) {
  const navigate = useNavigate(); // 로그인 성공 시 홈으로 이동하기 위해 사용

  // 입력 폼 상태들
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 보기/숨기기 토글용
  const [form, setForm] = useState({ loginId: "", password: "", rememberMe: false }); // 아이디/비번/자동로그인 여부
  const [loading, setLoading] = useState(false); // 요청 중 로딩 상태 표시용
  const [msg, setMsg] = useState<string | null>(null); // 에러나 안내 메시지 표시용

  // 폼 입력 값 변경 핸들러 (필드명과 값만 넣으면 알아서 반영)
  const onChange = (field: keyof typeof form, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  // 로그인 버튼 클릭 시 실행되는 함수
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼 기본 제출 막기
    setMsg(null); // 메시지 초기화

    // 아이디/비번 공백 체크
    if (!form.loginId.trim() || !form.password.trim()) {
      setMsg("아이디와 비밀번호를 입력해 주세요.");
      return;
    }

    setLoading(true); // 로딩 시작
    try {
      // 로그인 요청 전송
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId: form.loginId.trim(), password: form.password }),
      });

      // 응답을 안전하게 JSON으로 파싱
      const parsed = await parseJsonSafe(res);
      // 우리가 정의한 ApiMessage 형태인지 확인
      const resJSON: ApiMessage | null = isApiMessage(parsed) ? (parsed as ApiMessage) : null;



      // HTTP 상태 코드가 200이 아닐 때
      if (!res.ok) {
        setMsg(resJSON?.message || resJSON?.error || `로그인 실패 (${res.status})`);
        return;
      }

      // 성공 메시지 띄우고 콜백/페이지 이동
      setMsg("로그인 성공!");

      // ----------추후 리팩토링 필요----------
      if (resJSON?.data == null) {
        setMsg("로그인 응답 데이터가 올바르지 않습니다.");
        return;
      }

      sessionStorage.setItem("accessToken", resJSON.data.accessToken);
      sessionStorage.setItem("refreshToken", resJSON.data.refreshToken);
      // ----------------

      onLoginSuccess?.(); // 콜백이 있으면 실행
      navigate("/", { replace: true }); // 메인 페이지로 이동
    } catch {
      // 네트워크 오류 (서버가 안 열려있거나 끊긴 경우 등)
      setMsg("네트워크 오류가 발생했습니다.");
    } finally {
      // 항상 로딩 해제
      setLoading(false);
    }
  };



  return (
    <KRDSCard>
      {/* 헤더 */}
      <header className="text-center pb-4">
        <div
          className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--krds-green-60, #16a34a)" }}
          aria-hidden="true"
        >
          <Shield size={22} color="#fff" strokeWidth={2} />
        </div>
        <Title size="l">경기 파트너스 로그인</Title>
        <Detail size="s">시민과 지역이 함께하는 협력적 거버넌스 플랫폼</Detail>
      </header>

      {/* 폼 */}
      <form onSubmit={onSubmit} className="grid gap-y-4">
        {/* 아이디 */}
        <TextInput
          id="loginId"
          title="아이디"
          placeholder="아이디를 입력하세요"
          autoComplete="username"
          value={form.loginId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange("loginId", e.target.value)}
          required
          length="full"
        />

        {/* 비밀번호 + 보기 토글 */}
        <div className="grid gap-y-1">
            <div className="relative krds-input-with-end">
            <TextInput
                id="password"
                title="비밀번호"
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
                value={form.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange("password", e.target.value)
                }
                required
                length="full"
            />

            <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
                style={{ zIndex: 1 }} 
            >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
            </div>
          <Detail size="s">공용 PC에서는 비밀번호 노출에 주의해 주세요.</Detail>
        </div>

        {/* 로그인 상태 유지 추후 수정 예정 */}
        <div className="flex items-center justify-between">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={form.rememberMe}
              onChange={(e) => onChange("rememberMe", e.target.checked)}
            />
            <Detail size="s">로그인 상태 유지</Detail>
          </label>

          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
            비밀번호 찾기
          </Link>
        </div>

        {/* 제출 버튼 */}
        <Button
          type="submit"
          variant="primary"
          size="medium"
          disabled={loading}
          className="mt-1"
        >
          {loading ? (
            <span className="inline-flex items-center gap-1.5">
              <Spinner size="small" /> 로그인 중...
            </span>
          ) : (
            "로그인"
          )}
        </Button>

        {/* 메시지 배지 */}
        {msg && (
          <div className="mt-2">
            <Badge
              label={msg}
              variant={
                msg.includes("성공")
                  ? "success"
                  : msg.includes("오류") || msg.includes("실패")
                  ? "danger"
                  : "default"
              }
              size="small"
              appearance="fill"
            />
          </div>
        )}

        <div className="relative my-2">
          <hr
            role="separator"
            className="border-0 h-px"
            style={{ background: "var(--krds-gray-20, #e5e7eb)" }}
          />
          <span
            className="absolute left-1/2 top-1/2 px-2 text-sm text-gray-500 bg-white"
            style={{ transform: "translate(-50%, -50%)" }}
          >
            또는
          </span>
        </div>

        {/* 회원가입 링크 버튼 */}
        <Button
        type="button"
        variant="secondary"
        size="medium"
        onClick={() => navigate("/signup")}
        >
        회원가입
        </Button>

        {/* 보안 안내 박스 */}
        <div className="mt-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
          <Title size="xs">보안 안내</Title>
          <Detail size="s">
            공공장소에서는 로그인 후 반드시 로그아웃하고, 비밀번호는 정기적으로 변경해 주세요.
          </Detail>
        </div>
      </form>
    </KRDSCard>
  );
}
