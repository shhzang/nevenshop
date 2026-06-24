import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import NvLayout from "./components/layout/NvLayout";
import NvHomePage from "./pages/NvHomePage";
import NvProductsPage from "./pages/NvProductsPage";
import NvProductDetailPage from "./pages/NvProductDetailPage";
import NvStaticPage from "./pages/NvStaticPage";
import NvNotFoundPage from "./pages/NvNotFoundPage";
import AdminInquiriesPage from "./pages/AdminInquiriesPage";
import AdminGuard from "./components/AdminGuard";

function NvRouter() {
  return (
    <Switch>
      {/* Root redirect to /en */}
      <Route path="/">
        <Redirect to="/en" />
      </Route>

      {/* Lang-prefixed routes */}
      <Route path="/:lang">
        {(params) => (
          <NvLayout>
            <NvHomePage />
          </NvLayout>
        )}
      </Route>

      <Route path="/:lang/products">
        {(params) => (
          <NvLayout>
            <NvProductsPage />
          </NvLayout>
        )}
      </Route>

      <Route path="/:lang/products/:slug">
        {(params) => (
          <NvLayout>
            <NvProductDetailPage />
          </NvLayout>
        )}
      </Route>

      <Route path="/:lang/page/:slug">
        {(params) => (
          <NvLayout>
            <NvStaticPage />
          </NvLayout>
        )}
      </Route>

      {/* Admin routes */}
      <Route path="/admin/inquiries">
        <AdminGuard>
          <AdminInquiriesPage />
        </AdminGuard>
      </Route>

      {/* 404 */}
      <Route>
        <NvLayout>
          <NvNotFoundPage />
        </NvLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <NvRouter />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
