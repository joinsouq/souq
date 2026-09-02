import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import Umbrella from "@/pages/Umbrella";
import Capital from "@/pages/Home";
import Apply from "@/pages/Apply";
import Accelerator from "@/pages/Accelerator";
import Summit from "@/pages/Summit";
import Team from "@/pages/Team";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  const normalizedLocation =
    location === "/" ? location : location.replace(/\/+$/, "");

  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <Switch location={normalizedLocation}>
      <Route path="/" component={Umbrella} />
      <Route path="/capital" component={Capital} />
      <Route path="/accelerator" component={Accelerator} />
      <Route path="/summit" component={Summit} />
      <Route path="/apply" component={Apply} />
      <Route path="/team" component={Team} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}

export default App;
