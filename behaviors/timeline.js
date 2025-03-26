class Timeline
{
  static id = "Timeline";

  static isMatch() {
    // TODO: Investigate matching on presence of timeline.js rather than specific URL
    const url = "https://phd.aydeethegreat.com/a-timeline-of-campus-community-and-national-events-new/"
    return window.location.href == url && window === window.top;
  }

  static init() {
    return {};
  }

  async* run(ctx) {
    const { log, Lib, autofetcher } = ctx;

    log("Waiting for all page content to load");
    if (iframe && iframe.contentDocument.readyState !== "complete") {
      await Lib.sleep(5000);
    }

    // Click on previous as necessary until we're at first slide
    do {
      const previous = document.querySelector("button.tl-slidenav-previous");
      if (!previous) {
        break;
      }

      log('Moving to previous slide until first slide reached');
      previous.click();

    } while(true);

    // Click on next until we're at last slide
    do {
      const next = document.querySelector("button.tl-slidenav-next");
      if (!next) {
        break;
      }

      log('Moving to next slide');
      next.click();

    } while(true);
  }
}
