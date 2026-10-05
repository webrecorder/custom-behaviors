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
      const events = xpathNodes("//div[contains(@class, 'node--type-event')");

      for (const event of events) {
        yield getState(ctx, "New event", "events");
        scrollIntoView(event);

        // gather links
        const eventAnchors = xpathNodes("//a", event);
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

      yield Lib.getState(ctx, "Moving to next page", "pages");
      next.click();
      await Lib.sleep(3000);
    } while(true);
  }

  async* run(ctx) {
    const { log, Lib, autofetcher } = ctx;

    const { sleep, waitUnit, xpathNodes } = Lib;

    const categoryRadios = xpathNodes("//input[contains(@class, 'form-radio')");

    for (const categoryRadio of categoryRadios) {
      await sleep(waitUnit * 5);

      // if button's not already checked, click it and wait for new content
      if (!categoryRadio.hasAttribute("checked")) {
        categoryRadio.click();
        await sleep(waitUnit * 10);
      }

      yield Lib.getState(ctx, "Processing new cateogry", "categories")

      await Lib.sleep(5000);

      await iteratePages(ctx);
    }
  }
}
