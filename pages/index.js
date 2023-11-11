import Head from 'next/head'
import IndexPage from 'components/index.page'

export default function Home() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <IndexPage />
    </>
  )
}
