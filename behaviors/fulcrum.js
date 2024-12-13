class Fulcrum
{
  static id = "Fulcrum";

  static isMatch() {
    return window.location.href.startsWith("https://www.fulcrum.org/epubs/");
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
    }

    const range = document.querySelector("input[type='range']");

    log("Iterate through all pages");

    do {
      if (range && Number(range.value) >= Number(range.max)) {
        log("Done iterating through all pages!");
        break;
      }

      const next = document.querySelector("a[aria-label='Next Page']");
      if (!next) {
        break;
      }
      next.click();
      log("Waiting for at least 1 sec or all page content to load");
      // if autofetcher available, when for at least 1 sec or all fetches to finish
      if (autofetcher) {
        await Promise.allSettled([autofetcher.done(), Lib.sleep(1000)]);
      } else {
        await Lib.sleep(1000);
      }

      yield {"pages": pages++};
    } while(true);
  }
}
