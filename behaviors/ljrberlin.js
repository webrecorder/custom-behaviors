class BerlinTimeline
{
  static id = "Berlin Timeline";

  static isMatch() {
    return window.location.href.startsWith("https://ljrberlin.de/termine");
  }

  static init() {
    return {};
  }

  async iteratePages(ctx) {
    const { scrollIntoView, sleep, waitUnit, xpathNode, xpathNodes, getState } = ctx.Lib;

    do {
      const pageEvents = xpathNodes("//div[contains(@class, 'node--type-event')");

      for (const pageEvent of pageEvents) {
        yield getState(ctx, "New event", "events");
        scrollIntoView(pageEvent);

        // gather links
        const eventAnchors = xpathNodes("//a", pageEvent);
        for (const eventAnchor of eventAnchors) {
          const link = eventAnchor.getAttribute("href");
          if (link) {
            await addLink(link);
          }
        }
      }

      const next = xpathNode("//a[rel='next']");
      if (!next || !next.checkVisibility()) {
        break;
      }

      yield getState(ctx, "Moving to next page", "pages");
      next.click();
      await sleep(3000);
    } while(true);
  }

  async* run(ctx) {
    const { log, Lib, autofetcher } = ctx;

    const { sleep, waitUnit, getState, xpathNodes } = Lib;

    const categoryRadios = xpathNodes("//input[contains(@class, 'form-radio')");

    for (const categoryRadio of categoryRadios) {
      await sleep(waitUnit * 5);

      // if button's not already checked, click it and wait for new content
      if (!categoryRadio.hasAttribute("checked")) {
        categoryRadio.click();
        await sleep(waitUnit * 10);
      }

      yield getState(ctx, "Processing new cateogry", "categories")

      await sleep(5000);

      await iteratePages(ctx);
    }
  }
}
