import styled from "styled-components";

export const CommunityInfoCard = ({ onClose }: { onClose: () => void }) => {
  return (
    <Container onClick={onClose}>
      <TitleContainer>
        <Title>커뮤니티 정보</Title>
      </TitleContainer>

      <Divider />

      <ContentContainer>
        <Content>
          아래 가이드라인을 함께 지켜주세요
          <AlphabetList>
            <AlphabetItem>
              서로를 존중해요
              <DashList>
                <DashItem>
                  인신공격, 혐오 표현, 차별 발언은 금지됩니다.
                </DashItem>
              </DashList>
            </AlphabetItem>
            <AlphabetItem>
              스팸·광고 금지
              <DashList>
                <DashItem>
                  무단 링크 공유, 상업적 홍보는 허용되지 않아요.
                </DashItem>
              </DashList>
            </AlphabetItem>
            <AlphabetItem>
              개인정보 보호
              <DashList>
                <DashItem>
                  타인의 개인정보(실명, 연락처 등)를 노출하거나 요구하지 마세요.
                </DashItem>
              </DashList>
            </AlphabetItem>
            <AlphabetItem>
              주제에 맞는 게시
              <DashList>
                <DashItem>
                  해당 피드의 주제와 무관한 글은 자제해주세요.
                </DashItem>
              </DashList>
            </AlphabetItem>
            <AlphabetItem>
              신고와 대응
              <DashList>
                <DashItem>
                  규칙 위반 콘텐츠를 발견하면 ‘신고’ 버튼을 눌러 알려주세요.
                  운영진이 빠르게 확인합니다.
                </DashItem>
              </DashList>
            </AlphabetItem>
          </AlphabetList>
        </Content>
      </ContentContainer>

      <Divider />
      <VersionContainer>version 25.2.1</VersionContainer>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  top: 56px;
  right: 0;
  width: 350px;
  /* height: 400px; */
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 12px 16px -4px rgba(10, 13, 18, 0.08),
    0px 4px 6px -2px rgba(10, 13, 18, 0.03), 0px 0px 0px 1.5px #e9eaeb inset;

  display: flex;
  flex-direction: column;
  font-family: "Pretendard", sans-serif;
  z-index: 950;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e9eaeb;
`;

const TitleContainer = styled.div`
  width: 100%;
  padding: 8px 16px;
  margin: 10px 0;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 800;
`;

const ContentContainer = styled.div`
  width: 100%;
  padding: 0 16px;
  margin: 10px 0;
`;

const Content = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #000;
  line-height: 20px;
`;

const AlphabetList = styled.ol`
  list-style-type: lower-alpha;
  padding-left: 30px;
  margin-top: 13px;
`;

const AlphabetItem = styled.li`
  margin-bottom: 2px;
`;

const DashList = styled.ul`
  padding-left: 8px;
  margin: 2px 0 0 0;
  list-style: none;

  & > li::before {
    content: "• ";
    margin-right: 6px;
    color: #000;
  }
`;

const DashItem = styled.li``;

const VersionContainer = styled.div`
  width: 100%;
  padding: 10px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #535862;
  line-height: 20px;
`;
