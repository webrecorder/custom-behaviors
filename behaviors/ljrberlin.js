class BerlinTimeline
{
  static id = "Berlin Timeline";

  static isMatch() {
    return window.location.href.startsWith("https://ljrberlin.de/termine");
  }

  static init() {
    return {};
  }

  async* iteratePages(ctx) {
    const { scrollIntoView, sleep, waitUnit, xpathNode, xpathNodes, getState } = ctx.Lib;

    do {
      for (const pageEvent of Array.from(xpathNodes("//div[@data-history-node-id]"))) {
        yield getState(ctx, "New event", "events");
        scrollIntoView(pageEvent);

        // gather links
        for (const eventAnchor of Array.from(xpathNodes("//a", pageEvent))) {
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

    let seenCategories = new Set();

    for (const categoryRadio of Array.from(xpathNodes("//input[@class='form-radio']"))) {
      await sleep(waitUnit * 5);

      // if button's not already checked, click it and wait for new content
      if (!seenCategories.has(categoryRadio)) {
        categoryRadio.click();
        await sleep(2000);
        seenCategories.add(categoryRadio);
      }

      yield getState(ctx, "Processing new category", "categories")

      await sleep(5000);

      await this.iteratePages(ctx);
    }
  }
}
