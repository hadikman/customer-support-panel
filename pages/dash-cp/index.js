import Head from 'next/head'
import DashCPPage from 'components/panel/page/dash-cp.page'

export default function DashCP() {
  return (
    <>
      <Head>
        <title>پنل مدیریت</title>
        <meta name="description" content="پنل خدمات پشتیبانی" />
      </Head>

      <DashCPPage />
    </>
  )
}
