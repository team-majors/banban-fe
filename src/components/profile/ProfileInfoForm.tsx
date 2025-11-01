"use client";
import styled from "styled-components";
import { Input } from "../common/Input";

interface ProfileInfoFormProps {
  username?: string;
  newUsername?: string;
  onUsernameChange: (username: string) => void;
}

export const ProfileInfoForm = ({
  username,
  newUsername,
  onUsernameChange,
}: ProfileInfoFormProps) => {
  return (
    <Container>
      <FormSection>
        <Label>닉네임</Label>
        <Input>
          <Input.Field
            $isValidate={true}
            value={newUsername}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="닉네임을 입력하세요"
          />
        </Input>
      </FormSection>

      <NoticeSection>
        <NoticeIcon>ⓘ</NoticeIcon>
        <NoticeText>
          닉네임은 7일마다 한 번만 변경할 수 있어요.
          <br />
          다음 변경 가능: 2025-06-22 11:22 KST
        </NoticeText>
      </NoticeSection>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
`;



const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #414651;
`;

const NoticeSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 14px;
  background-color: #f9fafb;
  border-radius: 8px;
`;

const NoticeIcon = styled.div`
  font-size: 16px;
  color: #8f9098;
  flex-shrink: 0;
  line-height: 1.5;
`;

const NoticeText = styled.p`
  font-size: 13px;
  color: #8f9098;
  margin: 0;
  line-height: 1.5;
`;
