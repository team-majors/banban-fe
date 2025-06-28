import React from "react";
import styled from "styled-components";
import Title from "@/components/svg/Title";
import Image from "next/image";
import { LoginButton } from "./LoginButton";
import { BanBanLogo } from "@/components/svg";
import { SocialLoginButtonConfig } from "@/types/socialLogin";

export default function LoginPage() {
  const loginButtons: SocialLoginButtonConfig[] = [
    {
      id: "naver",
      text: "네이버로 로그인",
      backgroundColor: "#03C75A",
      fontColor: "#FFF",
      iconSrc: "/naver.png",
      onClick: () => {
        console.log("TODO: implement Social login");
      },
    },
  ];

  return (
    <LoginContainer>
      <LogoContainer>
        <BanBanLogo />
      </LogoContainer>
      <Divider />
      <MainContentsContainer>
        <MessageContainer>
          <TitleWrapper>
            <Title />
          </TitleWrapper>
          <SubTitle>둘 중에 하나만 골라!</SubTitle>
        </MessageContainer>
        <Image
          src={"/main_image.png"}
          alt="main_img"
          width={200}
          height={200}
        />
      </MainContentsContainer>
      <LoginButtonContainer>
        <QuickStartText>회원가입 없이 바로 3초만에 시작하기 🚀</QuickStartText>
        <LoginButtonWrapper>
          <KakaoButtonWrapper>
            <Image
              src={"/kakao_login_large_wide.png"}
              width={300}
              height={44}
              alt="kakao_login_btn"
            />
          </KakaoButtonWrapper>
          {loginButtons.map((button) => (
            <LoginButton
              key={button.id}
              onClick={button.onClick}
              fontcolor={button.fontColor}
              color={button.backgroundColor}
              icon={
                <Image
                  src={button.iconSrc}
                  width={24}
                  height={24}
                  alt={`login_btn_img ${button.text}`}
                  style={{
                    height: "24px",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
              }
            >
              <span>{button.text}</span>
            </LoginButton>
          ))}
        </LoginButtonWrapper>
      </LoginButtonContainer>
      <Ask as="a" href="/contact">
        문의하기
      </Ask>
    </LoginContainer>
  );
}

const LoginContainer = styled.div`
  height: 100%;
  width: 542px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  padding: 32px 0px;
  background-color: white;
  border-radius: 24px;
  border: 1px solid #e9eaeb;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.15);
`;

const LogoContainer = styled.div`
  height: 62px;
  padding: 10px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e9eaeb;
`;

const MainContentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
  width: 100%;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 15px;
`;
const TitleWrapper = styled.div`
  height: 52px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SubTitle = styled.span`
  font-size: 20px;
  text-align: center;
  font-weight: 500;
`;

const LoginButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const LoginButtonWrapper = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Ask = styled.span`
  color: #535862;
  font-size: 14px;
  font-weight: 500;
`;

const KakaoButtonWrapper = styled.div`
  cursor: pointer;
`;

const QuickStartText = styled.span`
  color: #535862;
  font-size: 14px;
`;
