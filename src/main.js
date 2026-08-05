import * as runtime from "./runtime.js";
import { installShell } from "./shell.js";
import { installScrollState } from "./scroll-state.js";
import { installAdapters } from "./adapters.js";
import { installReadSync } from "./read-sync.js";
import { installBoardState } from "./board-state.js";
import { installWriting } from "./writing.js";
import { installPagination } from "./pagination.js";
import { installFirstUnread } from "./first-unread.js";
import { installSettings } from "./settings.js";
import { installUiPanels } from "./ui-panels.js";
import { installUi } from "./ui.js";
import { installUiEvents } from "./ui-events.js";
import { installNavigation } from "./navigation.js";
import { installController } from "./controller.js";

const ctx = { ...runtime };
installShell(ctx);
installScrollState(ctx);
installAdapters(ctx);
installReadSync(ctx);
installBoardState(ctx);
installWriting(ctx);
installPagination(ctx);
installFirstUnread(ctx);
installSettings(ctx);
installUiPanels(ctx);
installUi(ctx);
installNavigation(ctx);
installUiEvents(ctx);
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
