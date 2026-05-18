import AdminPage from './pages/AdminPage'
import HomePage from './pages/HomePage'
import UsersPage from './pages/UsersPage'
import { Route, RouterProvider } from './lib/router'

function App() {
  return (
    <RouterProvider>
      <Route element={<HomePage />} path="/" />
      <Route element={<AdminPage />} path="/admin" />
      <Route element={<UsersPage />} path="/admin/users" />
    </RouterProvider>
  )
}

export default App
