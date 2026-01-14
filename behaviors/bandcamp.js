class BandcampBehavior
{
  static id = "BandcampBehavior";

  static isMatch() {
    return window.location.href.includes("bandcamp.com/album/");
  }

  static init() {
    return {};
  }

  countWritings() {
    return document.querySelectorAll("div.writings").length;
  }

  async awaitPageLoad() {
    const { Lib, log } = ctx;

    let lastWritingsCount = this.countWritings();

    while(true) {
      const moreWritingsBtn = document.querySelector("a.more-writing");
      if (!moreWritingsBtn) {
        break;
      }

      moreWritingsBtn.click();
      log({msg: "Clicked more writings button"});

      await Lib.sleep(3000);

      const newWritingsCount = this.countWritings();
      log({msg: "New writings count", count: newWritingsCount});

      if (newWritingsCount === lastWritingsCount) {
        ctx.log({msg: "No more new writings loaded, page is ready"});
        break;
      }

      lastWritingsCount = newWritingsCount;
    }
  }

  async* run(ctx) {
    const { Lib } = ctx;

    for await (const elem of document.querySelectorAll("div.play_status")) {
      elem.click();

      await Lib.sleep(2000);

      yield Lib.getState(ctx, "Played track", "tracksPlayed");
    }
  }
}
