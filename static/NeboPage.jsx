import React from 'react';
import Head from 'next/head';
import Error from 'next/error';
import NeboComponent, { NeboHead, fetchSchema } from './nebo';

const NeboPage = ({ schema, errorCode, children }) => {
  if (errorCode) return <Error statusCode={errorCode} />;

  return (
    <>
      <Head>
        <NeboHead schema={schema} />
      </Head>
      <NeboComponent schema={schema}>
        {children}
      </NeboComponent>
    </>
  );
};

export const getStaticProps = (url) => async () => {
  const slug = url === '/' ? 'index' : url.substring(1);
  return {
    props: {
      schema: await fetchSchema(slug),
    },
  };
};

export const getServerSideProps = async ({ resolvedUrl: url }) => {
  const slug = url === '/' ? 'index' : url.substring(1);
  const schema = await fetchSchema(slug);
  const errorCode = !schema || schema.errors ? 404 : false;
  return {
    props: {
      schema,
      errorCode,
    },
  };
};

export default NeboPage;
