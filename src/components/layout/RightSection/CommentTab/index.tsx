import styled from "styled-components";
import { ChevronLeftIcon } from "@/components/svg/ChevronLeftIcon";
import { useRouter } from "next/navigation";

const CommentTab = () => {
  const router = useRouter();

  return (
    <StyledContainer>
      <StyledCommentsTab>
        <StyledBackButton onClick={() => {
          router.push("/");
        }}>
          <ChevronLeftIcon size={24} />
        </StyledBackButton>
      </StyledCommentsTab>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 16px;

  gap: 10px;

  align-items: start;
`;

const StyledCommentsTab = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StyledBackButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
`;

export { CommentTab };