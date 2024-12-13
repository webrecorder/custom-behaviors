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
    let pages = 0;
    const close = document.querySelector(".modal-dialog button");
    if (close) {
      log("Close modal popup");
      close.click();
      yield {"pages": 0};
    }

    const range = document.querySelector("input[type='range']");

    do {
      if (range) {
        log(`At page ${range.value} of ${range.max}`);
      }

      if (range && Number(range.value) >= Number(range.max)) {
        log("Done iterating through all pages!");
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

      yield {"pages": pages++};
    } while(true);
  }
}
