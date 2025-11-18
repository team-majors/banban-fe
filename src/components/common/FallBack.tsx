const Fallback = () => (
  <div className="flex min-h-dvh items-center justify-center bg-[#ffffff] px-6">
    <div className="w-full max-w-xs rounded-2xl bg-white/10 px-4 py-5 text-center text-white shadow-[0_18px_40px_rgba(26, 7, 111, 0.25)] backdrop-blur-lg">
      <h1 className="mb-3 text-lg font-semibold">로그인 처리 중이에요</h1>
      <p className="text-sm leading-6 text-white/85">
        잠시만 기다려 주세요. 곧 홈으로 이동합니다.
      </p>
      <div className="mt-5 flex items-center justify-center gap-3">
        <PulseDot />
        <PulseDot delay={150} />
        <PulseDot delay={300} />
      </div>
    </div>
  </div>
);

const PulseDot = ({ delay = 0 }: { delay?: number }) => (
  <span
    className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-[#ff05ce] to-[#3f13ff] animate-pulse"
    style={{ animationDelay: `${delay}ms` }}
    aria-hidden="true"
  />
);

export default Fallback;
