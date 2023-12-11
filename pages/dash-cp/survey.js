import Head from 'next/head'
import PanelSurveyPage from 'components/panel/page/survey.page'

export default function Survey() {
  return (
    <>
      <Head>
        <title>نظرسنجی</title>
        <meta name="description" content="نظرسنجی خدمات پشتیبانی" />
      </Head>

      <PanelSurveyPage />
    </>
  )
}
