import { Toaster } from 'sonner'
import { SurveyPage } from '@/pages/SurveyPage'
import { ResultsPage } from '@/pages/ResultsPage'

function App() {
  const isResults = window.location.pathname === '/resultados'

  return (
    <>
      {isResults ? <ResultsPage /> : <SurveyPage />}
      <Toaster />
    </>
  )
}

export default App
