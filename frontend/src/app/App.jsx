import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { ProjectSwitcher } from '@/components/layout/ProjectSwitcher'
import { PageLoader } from '@/components/layout/PageLoader'
import { Launcher } from '@/app/Launcher'
import { NotFound } from '@/app/NotFound'

const HubflowPage = lazy(() => import('@/projects/hubflow/HubflowPage'))
const EcommercePage = lazy(() => import('@/projects/ecommerce/EcommercePage'))
const PwPage = lazy(() => import('@/projects/pw/PwPage'))
const StripePage = lazy(() => import('@/projects/stripe/StripePage'))

export function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Launcher />} />
          <Route path="/hubflow" element={<HubflowPage />} />
          <Route path="/ecommerce" element={<EcommercePage />} />
          <Route path="/pw" element={<PwPage />} />
          <Route path="/stripe" element={<StripePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <ProjectSwitcher />
    </ErrorBoundary>
  )
}
