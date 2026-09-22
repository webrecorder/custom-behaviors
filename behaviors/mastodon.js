class MastodonProfileBehavior
{
  static id = "MastodonProfile";

  static isMatch() {
    // Run on known Mastodon hosts, only on profile page
    // e.g. https://digipres.club/@dpc_chat
    const knownMastodonHosts = [
      "digipres.club",
      "mastodon.social",
      "mstdn.social",
    ];
    const profilePageRegex = /^\/@[a-zA-Z0-9_@\.]+\/?$/;
    return (
      knownMastodonHosts.includes(window.location.host)
      && window.location.pathname.match(profilePageRegex)
    );
  }

  static init() {
    return {};
  }

  async waitForNext(ctx, child) {
    const { sleep, waitUnit } = ctx.Lib;
    if (!child) {
      return null;
    }

    await sleep(waitUnit * 2);

    if (!child.nextElementSibling) {
      return null;
    }

    return child.nextElementSibling;
  }

  async *infScroll(ctx) {
    const { scrollIntoView, sleep, waitUnit, xpathNode } = ctx.Lib;
    const root = xpathNode("//div[@class='item-list' and @role='feed']");

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

      // If child is load more button, click it and wait
      if (child && child?.tagName.toLowerCase() === "button") {
        child.click();
        await sleep(waitUnit * 5);
      }

      // Otherwise if it's a post, yield it
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

      // Queue post to capture separately
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
      const showMoreButton = xpathNode("//div[@class='content-warning']/button", post);
      if (showMoreButton) {
        yield getState(ctx, "Expanding Content Warning", "contentWarnings");
        showMoreButton.click();
        await sleep(waitUnit * 5);
      }

      await sleep(waitUnit * 5);
    }
  }
}
