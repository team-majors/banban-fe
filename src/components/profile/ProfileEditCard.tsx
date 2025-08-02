"use client";

import Image from "next/image";
import React from "react";
import styled from "styled-components";
import { Input } from "../common/Input";

export const ProfileEditCard = () => {
  const username = "tonton";

  return (
    <Container>
      <ProfileHeader>
        <ProfileTitle>프로필</ProfileTitle>
      </ProfileHeader>

      <ProfileContent>
        <ProfileImageWrapper>
          <StyledProfileImage
            src="/love.jpg"
            width={92}
            height={92}
            alt="user_profile_img"
          />
        </ProfileImageWrapper>

        <ProfileUserName>@{username}</ProfileUserName>

        <NicknameSection>
          <Input>
            <StyledLabel>닉네임</StyledLabel>
            <Input.Field $isValidate={true} />
          </Input>
          <NicknameNotice>
            <SmallText>
              닉네임은 7일(168 시간)마다 한 번만 변경할 수 있어요.
            </SmallText>
            <MediumText>다음 변경 가능: 2025-06-22 11:22 KST</MediumText>
          </NicknameNotice>
        </NicknameSection>

        <SaveButton onClick={() => {}}>저장</SaveButton>
      </ProfileContent>
    </Container>
  );
};

const Container = styled.div`
  background-color: white;
  width: 350px;
  height: 462px;
  border-radius: 8px;
  flex-direction: column;
  border: solid 1px #e9eaeb;
  box-shadow: 0px 12px 16px -4px rgba(10, 13, 18, 0.08);
`;

const ProfileHeader = styled.div`
  padding: 20px 16px;
  border-bottom: solid 1px #e9eaeb;
`;

const ProfileTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
`;

const ProfileImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 10px;
  width: 100px;
  height: 100px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0px 12px 16px -4px rgba(10, 13, 18, 0.08);
  overflow: hidden;
`;

const StyledProfileImage = styled(Image)`
  width: 92px;
  height: 92px;
  border-radius: 50%;
  object-fit: cover;
`;

const ProfileUserName = styled.h2`
  color: #181d27;
  font-size: 24px;
  font-weight: 900;
`;

const NicknameSection = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledLabel = styled(Input.Label)`
  color: #414651;
  font-size: 14px;
  line-height: 20px;
  font-weight: 900;
`;

const NicknameNotice = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px;
`;

const SmallText = styled.h6`
  font-size: 10px;
  line-height: 20px;
  color: #8f9098;
`;

const MediumText = styled.h4`
  font-size: 14px;
  line-height: 20px;
  color: #8f9098;
`;

const SaveButton = styled.button`
  align-self: flex-end;
  padding: 8px 14px;
  color: #414651;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid #d5d7da;
  border-radius: 8px;
  box-shadow: 0px 1px 2px rgba(10, 13, 18, 0.05);
`;
