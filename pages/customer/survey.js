import Head from 'next/head'
import PublicSurveyPage from 'components/public/page/survey.page'

export default function Survey() {
  return (
    <>
      <Head>
        <title>نظرسنجی پشتیبانی</title>
        <meta name="description" content="نظرسنجی پشتیبانی" />
      </Head>

      <PublicSurveyPage />
    </>
  )
}
