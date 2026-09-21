const Q = {
  mastodonDiv: "//div[@id='mastodon']",
  rootPath: "//div[@class='item-list' and @role='feed']",
  contentWarningButton: "//div[@class='content-warning']/button",
};

const knownMastodonHosts = [
  "digipres.club",
  "mastodon.social",
  "mstdn.social",
];

class MastodonCustomBehavior
{
  static id = "Mastodon";

  static isMatch() {
    return knownMastodonHosts.includes(window.location.host);
  }

  static init() {
    return {};
  }

  async *infScroll(ctx) {
    const { scrollIntoView, sleep, waitUnit, xpathNode } = ctx.Lib;
    const root = xpathNode(Q.rootPath);

    if (!root) {
      return;
    }

    // TODO: What about pinned/featured posts?

    let child = root.firstElementChild;

    if (!child) {
      return;
    }

    while (child) {
      if (child?.innerText) {
        scrollIntoView(child);
      }

      if (child && child?.tagName.toLowerCase() === "article") {
        await sleep(waitUnit);
        yield child;
      }

      child = (await this.waitForNext(ctx, child));
    }
  }

  async* run(ctx) {
    const { log, autofetcher } = ctx;
    const { getState, addLink, awaitLoad, sleep, waitUnit, xpathNode } = ctx.Lib;

    yield log("Waiting for page to finish loading", "debug");
    await awaitLoad();

    for await (const post of this.infScroll(ctx)) {
      await sleep(waitUnit * 2.5);

      // queue as separate URL
      if (post.hasAttribute("data-id")) {
        const dataId = post.getAttribute("data-id");
        yield getState(
          ctx,
          "Adding link to post",
          "posts",
        );
        const postUrl = `${window.location.href}/${dataId}`;
        await addLink(postUrl);
      }

      // Reveal text hidden behind content warning
      const showMoreButton = xpathNode(Q.contentWarningButton, post) as HTMLElement | null;
      if (showMoreButton) {
        yield getState(ctx, "Expanding Content Warning", "contentWarnings");
        showMoreButton.click();
        await sleep(waitUnit * 5);
      }

      await sleep(waitUnit * 5);
    }
  }
}
