import Head from 'next/head'
import HomePage from 'components/page/home.page'

export default function Home() {
  return (
    <>
      <Head>
        <title>پنل خدمات مشتری</title>
        <meta name="description" content="پنل خدمات مشتری" />
      </Head>

      <HomePage />
    </>
  )
}
