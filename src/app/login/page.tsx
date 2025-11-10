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
  height: 100%;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  padding: 6px 8px;
`;
