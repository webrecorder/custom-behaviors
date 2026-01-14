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

  async awaitPageLoad(ctx) {
    const { Lib } = ctx;

    let lastWritingsCount = this.countWritings();

    while(true) {
      const moreWritingsBtn = document.querySelector("a.more-writing");
      if (!moreWritingsBtn) {
        break;
      }

      moreWritingsBtn.click();
      ctx.log({msg: "Clicked more writings button"});

      await Lib.sleep(3000);

      const newWritingsCount = this.countWritings();
      ctx.log({msg: "New writings count", count: newWritingsCount});

      if (newWritingsCount === lastWritingsCount) {
        ctx.log({msg: "No new writings loaded, page ready"});
        break;
      }

      lastWritingsCount = newWritingsCount;
    }
  }

  async* run(ctx) {
    const { Lib } = ctx;

    for await (const elem of document.querySelectorAll("div.play_status")) {
      elem.click();

      // await Lib.sleep(2000);

      const maxAttempts = 10;
      let attempts = 0;
      while(true) {
        if (attempts >= maxAttempts) {
          break;
        }
        attempts++;

        const trackProgressBar = document.querySelector("div.progbar_empty div.thumb");
        try {
          const left = trackProgressBar.style.left;
          if (left && left > "0px") {
            ctx.log({msg: "Track started!"});
            break;
          }
        } catch(e) {}

        await Lib.sleep(500);
      }

      await Lib.sleep(1000);

      yield Lib.getState(ctx, "Played track", "tracksPlayed");
    }
  }
}
