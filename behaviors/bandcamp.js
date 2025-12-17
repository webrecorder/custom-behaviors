class BandcampReleaseBehavior
{
  static id = "Bandcamp Release";

  static isMatch() {
    return window.location.href.includes("bandcamp.com/album/");
  }

  static init() {
    return {};
  }

  async* run(ctx) {
    const { Lib } = ctx;

    for await (const elem of document.querySelectorAll("div.play_status")) {
      elem.click();

      // wait two seconds to give audio time to start
      await Lib.sleep(2000);

      await Lib.getState(ctx, "Clicked play track button", "clicks");
    }
  }
}
