import Head from 'next/head'
import PrintPage from 'components/panel/page/print.page'

export default function Print() {
  return (
    <>
      <Head>
        <title>چاپ</title>
        <meta name="description" content="چاپ" />
      </Head>

      <PrintPage />
    </>
  )
}
