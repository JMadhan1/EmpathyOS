import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import ConversationPage from "@/pages/conversation";
import Methodology from "@/pages/methodology";
import Manifesto from "@/pages/manifesto";
import Dashboard from "@/pages/dashboard";
import Auth from "@/pages/auth";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const isAuth = localStorage.getItem("empathy_os_auth") === "true";
  if (!isAuth) {
    window.location.href = "/auth";
    return null;
  }
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chat" component={ConversationPage} />
      <Route path="/methodology" component={Methodology} />
      <Route path="/manifesto" component={Manifesto} />
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/auth" component={Auth} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
