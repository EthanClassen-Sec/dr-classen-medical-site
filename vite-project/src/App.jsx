import AdminPage from './pages/AdminPage'
import HomePage from './pages/HomePage'
import { Route, RouterProvider } from './lib/router'

function App() {
  return (
    <RouterProvider>
      <Route element={<HomePage />} path="/" />
      <Route element={<AdminPage />} path="/admin" />
    </RouterProvider>
  )
}

export default App
