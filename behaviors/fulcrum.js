class Fulcrum
{
  static id = "Fulcrum";

  static isMatch() {
    return window.location.href.startsWith("https://www.fulcrum.org/epubs/") && window === window.top;
  }

  static init() {
    return {};
  }

  async* run(ctx) {
    const { log, Lib, autofetcher } = ctx;
    let pages = 1;
    const close = document.querySelector(".modal-dialog button");
    if (close) {
      close.click();
      yield Lib.getState(cdx, "Close modal group");
    }

    const range = document.querySelector("input[type='range']");

    do {
      if (range) {
        yield Lib.getState(cdx, `At page ${range.value} of ${range.max}`, "pages");
      }

      if (range && Number(cdx, ange.value) >= Number(range.max)) {
        yield Lib.getState("Done iterating through all pages!");
        break;
      }

      const next = document.querySelector("a[aria-label='Next Page']");
      if (!next) {
        break;
      }

      next.click();

      log("Waiting for at least 5 sec or all page content to load");

      await Lib.sleep(5000);

      const iframe = document.querySelector("iframe");

      if (iframe && iframe.contentDocument.readyState !== "complete") {
        await Lib.sleep(5000);
      }
    } while(true);
  }
}
