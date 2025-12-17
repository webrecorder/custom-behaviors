class BandcampReleaseBehavior
{
  static id = "Bandcamp Release";

  static isMatch() {
    return window.location.href.includes("bandcamp.com/album/");
  }

  static init() {
    return {};
  }

  static countWritings() {
    const writings = document.querySelectorAll("div.writing");
  }

  async* run(ctx) {
    const { Lib } = ctx;

    // click all "play track" buttons to ensure we get audio
    for await (const elem of document.querySelectorAll("div.play_status")) {
      elem.click();

      // wait two seconds to give audio time to start
      await Lib.sleep(2000);

      yield Lib.getState(ctx, "Clicked play track button");
    }

    // click "more" to load more comments, wait until they load,
    // then repeat
    const initialWritingsCount = this.countWritings();
    ctx.log({msg: "Initial writings count", count: initialWritingsCount});

    while(true) {
      const moreWritingsBtn = document.querySelector("a.more-writing");
      if (!moreWritingsBtn) {
        break;
      }

      moreWritingsBtn.click();

      await Lib.sleep(2000);

      yield Lib.getState(ctx, "Click more writings button");

      const newWritingsCount = this.countWritings();
      ctx.log({msg: "New writings count", count: initialWritingsCount});

      if (initialWritingsCount === newWritingsCount) {
        ctx.log({msg: "No new writings loaded", count: initialWritingsCount});
        break;
      }
    }
  }
}
