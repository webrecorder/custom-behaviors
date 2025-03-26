class Timeline
{
  static id = "Timeline";

  static isMatch() {
    // TODO: Investigate matching on presence of timeline.js rather than specific URL
    const url = "https://phd.aydeethegreat.com/a-timeline-of-campus-community-and-national-events-new"
    return window.location.href.startsWith(url) && window === window.top;
  }

  static init() {
    return {};
  }

  async* run(ctx) {
    const { log, Lib, autofetcher } = ctx;

    log("Waiting for all page content to load");
    const iframe = document.querySelector("iframe");
    if (iframe && iframe.contentDocument.readyState !== "complete") {
      await Lib.sleep(5000);
    }

    const iframeDoc = iframe.contentWindow.document;

    // Click on previous as necessary until we're at first slide
    do {
      const previous = iframeDoc.querySelector("button.tl-slidenav-previous");
      if (!previous) {
        break;
      }

      const mediaIframe = iframeDoc.querySelector("iframe.tl-media-item");
      if (mediaIframe && mediaIframe.contentDocument.readyState !== "complete") {
        log("Waiting for embedded media content to load");
        await Lib.sleep(5000);
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

      const mediaIframe = iframeDoc.querySelector("iframe.tl-media-item");
      if (mediaIframe && mediaIframe.contentDocument.readyState !== "complete") {
        log("Waiting for embedded media content to load");
        await Lib.sleep(5000);
      }

      log('Moving to next slide');
      next.click();

    } while(true);
  }
}
