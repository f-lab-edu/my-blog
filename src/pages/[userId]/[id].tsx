import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import styled from "@emotion/styled";
import { ArticleDetail, ArticleHead } from "src/components/article";
import { HeadMeta } from "src/components/commons";
import { findArticle } from "src/api/article";
import { mdxToHtml } from "src/libs/mdx";

const ArticleDetailPage = (
  article: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const articleHead = {
    _id: article._id,
    tags: article.tags,
    content: article.content,
    syncTime: article.syncTime,
    name: article.name,
    email: article.email,
    thumbnailUrl: article.thumbnailUrl,
    title: article.title,
    introduction: article.introduction,
  };

  return (
    <Container>
      <HeadMeta
        title={article.title}
        image={article.thumbnailUrl}
        introduction={article.introduction}
      />
      <ArticleHead article={articleHead}></ArticleHead>
      <ArticleDetail content={article.MDXdata} />
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  const { userId, id } = query;
  try {
    const data = await findArticle({
      userId,
      id,
    });
    const { html } = await mdxToHtml(data.content);
    const article = {
      ...data,
      thumbnailUrl: data.thumbnailUrl,
      MDXdata: html,
    };
    return { props: article };
  } catch (err) {
    alert("get article failed.");
    return {
      props: {},
    };
  }
};
export default ArticleDetailPage;

const Container = styled.article`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 100px;
  width: 768px;
  flex-grow: 10;
  margin-left: auto;
  margin-right: auto;
  margin-top: 60px;
`;
