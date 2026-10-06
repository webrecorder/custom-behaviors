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
    const { log } = ctx;
    const { scrollIntoView, sleep, waitUnit, addLink } = ctx.Lib;

    let pageCount = 0;

    do {
      pageCount ++;
      const pageEvents = document.querySelectorAll("div.node--type-event");
      log(`Events found on page ${pageCount}: ${pageEvents.length}`, "debug");
      for (const pageEvent of pageEvents) {
        log("New event", "debug");
        scrollIntoView(pageEvent);

        // gather links
        const eventAnchors = pageEvent.querySelectorAll("a");
        for (const eventAnchor of eventAnchors) {
          const link = eventAnchor.getAttribute("href");
          log(`Adding link: ${link}`, "debug");
          if (link) {
            await addLink(link);
          }
        }
      }

      const next = document.querySelector("a[rel='next']");
      if (!next || !next.checkVisibility()) {
        log("No next button, finished iterating pages for category", "debug");
        break;
      }

      log("Moving on to next page", "debug");
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
      if (!seenCategories.has(categoryRadio.id)) {
        categoryRadio.click();
        await sleep(2000);
        seenCategories.add(categoryRadio.id);
      }

      yield getState(ctx, "Processing new category", "categories");

      await sleep(5000);

      await this.iteratePages(ctx);
    }
  }
}
