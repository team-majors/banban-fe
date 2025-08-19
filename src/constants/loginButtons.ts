import { SocialLoginButtonConfig } from "@/types/socialLogin";

export const LoginButtons: SocialLoginButtonConfig[] = [
  {
    id: "kakao",
    text: "카카오로 시작하기",
    backgroundColor: "#FEE500",
    fontColor: "#000000",
    iconSrc: "/kakao_symbol.png",
  },
  {
    id: "naver",
    text: "네이버로 로그인",
    backgroundColor: "#03C75A",
    fontColor: "#FFF",
    iconSrc: "/naver_symbol.png",
  },
];
