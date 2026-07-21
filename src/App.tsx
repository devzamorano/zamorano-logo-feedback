import { Toaster } from 'sonner'
import { SurveyPage } from '@/pages/SurveyPage'
import { ResultsPage } from '@/pages/ResultsPage'
import { WordsPage } from '@/pages/WordsPage'
import { AdminPage } from '@/pages/AdminPage'

function App() {
  const { pathname } = window.location

  const page =
    pathname === '/resultados' ? (
      <ResultsPage />
    ) : pathname === '/words' ? (
      <WordsPage />
    ) : pathname === '/admin' ? (
      <AdminPage />
    ) : (
      <SurveyPage />
    )

  return (
    <>
      {page}
      <Toaster />
    </>
  )
}

export default App
