"use client";
import styled from "styled-components";
import Image from "next/image";
import { LoginButton } from "./LoginButton";
import { BanBanLogo } from "@/components/svg";
import { Title } from "@/components/svg/Title";
import { LoginButtons } from "@/constants/loginButtons";


export default function LoginPage() {
  const handleLogin = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/${id}`,
      );
      if (!res.ok) throw new Error("Login API Error");

      const { data: url } = await res.json();
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <Container>
      <LogoBox>
        <BanBanLogo />
      </LogoBox>

      <Divider />

      <MainBox>
        <MessageBox>
          <TitleWrapper>
            <Title />
          </TitleWrapper>
          <SubTitle>둘 중에 하나만 골라!</SubTitle>
        </MessageBox>

        <Image src="/main_image.png" alt="main_img" width={200} height={200} />
      </MainBox>

      <LoginSection>
        <QuickStartText>회원가입 없이 바로 3초만에 시작하기 🚀</QuickStartText>
        <ButtonGroup>
          {LoginButtons.map(
            ({ id, fontColor, backgroundColor, iconSrc, text }) => (
              <LoginButton
                key={id}
                onClick={() => handleLogin(id)}
                fontcolor={fontColor}
                color={backgroundColor}
                icon={
                  <Image
                    src={iconSrc}
                    width={36}
                    height={36}
                    alt={`login_btn_img ${id}`}
                    style={{
                      height: "24px",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                }
              >
                {text}
              </LoginButton>
            ),
          )}
        </ButtonGroup>
      </LoginSection>

      <ContactLink href="/contact">문의하기</ContactLink>
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
  width: 542px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  padding: 32px 0;
  background-color: white;
  border-radius: 24px;
  border: 1px solid #e9eaeb;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
`;

const LogoBox = styled.div`
  height: 62px;
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e9eaeb;
`;

const MainBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
`;

const MessageBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: center;
`;

const TitleWrapper = styled.div`
  height: 52px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SubTitle = styled.span`
  font-size: 20px;
  font-weight: 500;
`;

const LoginSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  width: 100%;
`;

const ButtonGroup = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ContactLink = styled.a`
  color: #535862;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
`;

const QuickStartText = styled.span`
  color: #535862;
  font-size: 14px;
`;
