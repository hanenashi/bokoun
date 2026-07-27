import * as runtime from "./runtime.js";
import { installShell } from "./shell.js";
import { installAdapters } from "./adapters.js";
import { installReadSync } from "./read-sync.js";
import { installBoardState } from "./board-state.js";
import { installWriting } from "./writing.js";
import { installPagination } from "./pagination.js";
import { installSettings } from "./settings.js";
import { installUi } from "./ui.js";
import { installNavigation } from "./navigation.js";
import { installController } from "./controller.js";

const ctx = { ...runtime };
installShell(ctx);
installAdapters(ctx);
installReadSync(ctx);
installBoardState(ctx);
installWriting(ctx);
installPagination(ctx);
installSettings(ctx);
installUi(ctx);
installNavigation(ctx);
installController(ctx);

ctx.waitForDocumentElement().then(() => {
  ctx.startPaintGuard();
  return ctx.boot();
}).catch((error) => {
  console.warn(
    `[Bokoun ${ctx.VERSION}] Initialization failed; restored full Kapybara.`,
    error?.name || "Error",
  );
  ctx.revealNative({ stop: true });
});
