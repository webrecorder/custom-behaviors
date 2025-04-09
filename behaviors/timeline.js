class Timeline
{
  static id = "TimelineJS";

  static runInIframe = true;

  static isMatch() {
    return window.location.href.startsWith("https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html");
  }

  static init() {
    return {};
  }

  async* run(ctx) {
    const { log, Lib, autofetcher } = ctx;

    yield log("Waiting for page to finish loading", "debug");
    await Lib.awaitLoad();

    // Click on previous as necessary until we're at first slide
    do {
      const previous = document.querySelector("button.tl-slidenav-previous");
      if (!previous || !previous.checkVisibility()) {
        break;
      }

      log("Moving to previous slide until first slide is reached");
      previous.click();
      await Lib.sleep(1000);
    } while(true);

    // Click on next until we're at last slide
    do {
      const next = document.querySelector("button.tl-slidenav-next");
      if (!next || !next.checkVisibility()) {
        break;
      }

      log("Waiting 2 seconds on new slide", "debug");
      await Lib.sleep(2000);

      const mediaIframe = document.querySelector("iframe.tl-media-item");
      if (mediaIframe) {
        log("Waiting for embedded media content to load", "debug");
        try {
          await Lib.awaitLoad(mediaIframe);
        } catch (e) {}
        await Lib.sleep(2000);
      }

      yield Lib.getState(ctx, "Moving to next slide", "slides");
      next.click();
      await Lib.sleep(1000);
      //await Lib.waitForNetworkIdle();
    } while(true);
  }
}
