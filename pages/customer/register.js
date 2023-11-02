import Head from 'next/head'
import RegisterPage from 'components/public/page/register.page'

export default function Customer() {
  return (
    <>
      <Head>
        <title>فرم ثبت درخواست</title>
        <meta name="description" content="ثبت درخواست پشتیبانی" />
      </Head>

      <RegisterPage />
    </>
  )
}
