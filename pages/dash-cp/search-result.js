import Head from 'next/head'
import SearchResultPage from 'components/panel/page/search-result.page'

export default function Search() {
  return (
    <>
      <Head>
        <title>جستجو</title>
        <meta name="description" content="پنل خدمات پشتیبانی" />
      </Head>

      <SearchResultPage />
    </>
  )
}
