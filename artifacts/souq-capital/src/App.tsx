import { Switch, Route, Router as WouterRouter } from "wouter";
import Umbrella from "@/pages/Umbrella";
import Capital from "@/pages/Home";
import Apply from "@/pages/Apply";
import Accelerator from "@/pages/Accelerator";
import Summit from "@/pages/Summit";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Umbrella} />
      <Route path="/capital" component={Capital} />
      <Route path="/accelerator" component={Accelerator} />
      <Route path="/summit" component={Summit} />
      <Route path="/apply" component={Apply} />
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
