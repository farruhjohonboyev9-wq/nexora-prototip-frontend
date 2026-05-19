import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Sidebar, BottomNav } from "@/components/Sidebar";

import Login from "@/pages/Login";
import Register from "@/pages/Register";

import { Feed } from "@/pages/Feed";
import { Explore } from "@/pages/Explore";
import { Create } from "@/pages/Create";
import { Notifications } from "@/pages/Notifications";
import { Profile } from "@/pages/Profile";
import { UserProfile } from "@/pages/UserProfile";
import { PostDetail } from "@/pages/PostDetail";

import { Loader2 } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Redirect to="/login" />;

  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) return <Redirect to="/feed" />;

  return <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [location] = useLocation();

  const isAuthPage = location === "/login" || location === "/register";

  if (isAuthPage || !user) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 ml-[72px] xl:ml-60 mb-16 md:mb-0">
        <div className="max-w-[630px] mx-auto min-h-screen border-x border-border">
          {children}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={() => <Redirect to="/feed" />} />

        <Route path="/login">
          <AuthRoute>
            <Login />
          </AuthRoute>
        </Route>

        <Route path="/register">
          <AuthRoute>
            <Register />
          </AuthRoute>
        </Route>

        <Route path="/feed">
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        </Route>

        <Route path="/explore">
          <ProtectedRoute>
            <Explore />
          </ProtectedRoute>
        </Route>

        <Route path="/create">
          <ProtectedRoute>
            <Create />
          </ProtectedRoute>
        </Route>

        <Route path="/notifications">
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        </Route>

        <Route path="/profile">
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        </Route>

        <Route path="/profile/:id">
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        </Route>

        <Route path="/post/:id">
          <ProtectedRoute>
            <PostDetail />
          </ProtectedRoute>
        </Route>

        <Route>
          <div className="flex flex-col items-center justify-center min-h-screen gap-3">
            <p className="text-4xl font-bold gradient-text">404</p>
            <p className="text-muted-foreground">Page not found</p>
          </div>
        </Route>
      </Switch>
    </AppLayout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
