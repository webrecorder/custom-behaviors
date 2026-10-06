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
    const { scrollIntoView, sleep, waitUnit, getState } = ctx.Lib;

    do {
      const pageEvents = document.querySelectorAll("div[data-history-node-id]");
      for (const pageEvent of pageEvents) {
        yield getState(ctx, "New event", "events");
        scrollIntoView(pageEvent);

        // gather links
        const eventAnchors = pageEvent.querySelectorAll("a");
        for (const eventAnchor of eventAnchors) {
          const link = eventAnchor.getAttribute("href");
          if (link) {
            await addLink(link);
          }
        }
      }

      const next = document.querySelector("a[rel='next']");
      if (!next || !next.checkVisibility()) {
        break;
      }

      yield getState(ctx, "Moving to next page", "pages");
      next.click();
      await sleep(3000);
    } while(true);
  }

  async* run(ctx) {
    const { log, autofetcher } = ctx;
    const { sleep, waitUnit, getState } = ctx.Lib;

    let seenCategories = new Set();

    const categoryRadios = document.querySelectorAll("input.form-radio");
    for (const categoryRadio of categoryRadios) {
      await sleep(waitUnit * 5);

      if (!categoryRadio) {
        continue;
      }

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
