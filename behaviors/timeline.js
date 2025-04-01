class Timeline
{
  static id = "Timeline";

  static runInIframe = true;

  static isMatch() {
    return window.location.href.startsWith("https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html");
  }

  static init() {
    return {};
  }

  async* run(ctx) {
    const { log, Lib, autofetcher } = ctx;

    yield Lib.getState(ctx, "Waiting for page to finish loading");
    await Lib.awaitLoad();

    // Click on previous as necessary until we're at first slide
    do {
      const previous = document.querySelector("button.tl-slidenav-previous");
      if (!previous || !previous.checkVisibility()) {
        break;
      }

      yield Lib.getState(ctx, "Moving to previous slide until first slide is reached");
      previous.click();
    } while(true);

    // Click on next until we're at last slide
    do {
      const next = document.querySelector("button.tl-slidenav-next");
      if (!next || !next.checkVisibility()) {
        break;
      }

      const mediaIframe = document.querySelector("iframe.tl-media-item");
      if (mediaIframe) {
        yield Lib.getState(ctx, "Waiting for embedded media content to load");
        await Lib.awaitLoad(mediaIframe);
      }

      yield Lib.getState(ctx, "Moving to next slide", "slides");
      next.click();
      await Lib.sleep(1000);
      //await Lib.waitForNetworkIdle();

    } while(true);
  }
}
