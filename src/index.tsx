import { render } from "preact";
import { inject } from "@vercel/analytics";
import { App } from "./App";

inject();

render(<App />, document.body);
