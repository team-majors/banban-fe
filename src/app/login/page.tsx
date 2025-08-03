"use client";
import LoginPage from "@/components/auth/LoginPage/LoginPage";

import styled from "styled-components";

export default function page() {
  return (
    <Container>
      <LoginPage />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  height: 100dvh;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding: 20px 0;
`;
