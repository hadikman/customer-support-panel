import Head from 'next/head'
import CustomerPage from 'components/public/page/customer.page'

export default function Customer() {
  return (
    <>
      <Head>
        <title>پنل خدمات پشتیبانی</title>
        <meta name="description" content="پنل خدمات پشتیبانی" />
      </Head>

      <CustomerPage />
    </>
  )
}
