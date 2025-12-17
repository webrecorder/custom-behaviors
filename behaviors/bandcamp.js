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

      await Lib.getState(ctx, "Clicked play track button", "click");
    }

    // click "more" to load more comments, wait until they load,
    // then repeat
    const initialWritingsCount = this.countWritings();

    while(true) {
      const moreWritingsBtn = document.querySelector("a.more-writing");
      moreWritingsBtn.click();

      await Lib.sleep(2000);

      await Lib.getState(ctx, "Click more writings button", "click");

      const newWritingsCount = this.countWritings();
      if (initialWritingsCount === newWritingsCount) {
        break;
      }
    }
  }
}
