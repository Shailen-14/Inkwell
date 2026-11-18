import { useEffect, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { MyPostsPage } from './pages/MyPostsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PostFormPage } from './pages/PostFormPage';
import { PostPage } from './pages/PostPage';
import { RegisterPage } from './pages/RegisterPage';
import { useAuthStore } from './store/authStore';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const verify = useAuthStore((state) => state.verify);

  useEffect(() => {
    void verify();
  }, [verify]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="posts/:id" element={<PostPage />} />
          <Route
            path="new"
            element={
              <ProtectedRoute>
                <PostFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="edit/:id"
            element={
              <ProtectedRoute>
                <PostFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-posts"
            element={
              <ProtectedRoute>
                <MyPostsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
