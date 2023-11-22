import Head from 'next/head'
import Request from 'components/panel/page/request.page'

export default function RequestPage() {
  return (
    <>
      <Head>
        <meta name="description" content="پنل خدمات پشتیبانی" />
      </Head>

      <Request />
    </>
  )
}

export async function getStaticPaths() {
  return {paths: [], fallback: 'blocking'}
}

export async function getStaticProps() {
  return {props: {}}
}
