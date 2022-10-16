import styled from "@emotion/styled";
import { useS3Upload } from "next-s3-upload";
import { useState } from "react";
import Image from "next/image";
import { postArticle } from "src/api/article";
import { Button, Modal } from "src/components/commons";
import { deletefiles } from "src/api/file";

interface Props {
  content: string;
  tag: string;
  title: string;
  handleModalOpen: () => void;
}

const UploadModal = ({ content, tag, title, handleModalOpen }: Props) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [imageKey, setImageKey] = useState<string>("");
  const { FileInput, openFileDialog, uploadToS3 } = useS3Upload();

  const handleFileChange = async (file: File) => {
    try {
      const { url, key } = await uploadToS3(file);
      setImageKey(key);
      setThumbnailUrl(url);
    } catch {
      alert("upload failed.");
    }
  };

  // TODO error handling
  const handleFileRemove = async () => {
    try {
      await deletefiles(imageKey);
      setThumbnailUrl("");
    } catch (e) {
      alert("Deletion failed.");
    }
  };

  const handleFileUpload = async () => {
    try {
      await postArticle({ content, tag, title, thumbnailUrl });
    } catch (e) {
      alert("upload failed.");
    }
  };

  return (
    <Modal>
      <ModalContainer>
        <ModalLayout>
          <H2>썸네일 미리보기</H2>
          <UploadContainer>
            <FileInput onChange={handleFileChange} />
            <ButtonContainer>
              {thumbnailUrl ? (
                <Button width="100px" height="40px" onClick={handleFileRemove}>
                  사진 제거
                </Button>
              ) : (
                <Button
                  width="120px"
                  height="40px"
                  fontColor="white"
                  buttonColor="#252525"
                  onClick={openFileDialog}
                >
                  사진 업로드
                </Button>
              )}
            </ButtonContainer>
            <ThumbnailContainer>
              {thumbnailUrl && (
                <Image src={thumbnailUrl} height={250} width={400} />
              )}
            </ThumbnailContainer>
            <ButtonContainer>
              <Button
                width="140px"
                height="40px"
                buttonColor="#252525"
                fontColor="white"
                onClick={handleFileUpload}
              >
                완료
              </Button>
              <Button
                width="140px"
                height="40px"
                buttonColor="#252525"
                fontColor="white"
                onClick={handleModalOpen}
              >
                취소
              </Button>
            </ButtonContainer>
          </UploadContainer>
        </ModalLayout>
      </ModalContainer>
    </Modal>
  );
};

const ModalContainer = styled.div`
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  background: #1e1e1e;
  z-index: 15;
`;
const ModalLayout = styled.div`
  width: 768px;
  display: flex;
  flex-direction: column;
`;
const H2 = styled.h2`
  color: white;
  text-align: center;
`;
const UploadContainer = styled.div`
  place-self: center;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;
const ThumbnailContainer = styled.div`
  height: 250px;
  width: 400px;
  background-color: #252525;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: end;
  gap: 10px;
`;
const Thumbnail = styled.img`
  height: 250px;
  width: 400px;
`;
export default UploadModal;
