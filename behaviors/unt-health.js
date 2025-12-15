class UNTHealthBehavior
{
  static id = "UNT Health";

  static isMatch() {
    return window.location.href === "https://profiles.unthsc.edu/home";
  }

  static init() {
    return {};
  }

  async* run(ctx) {
    const { log, Lib, autofetcher } = ctx;
    let click = 0;

    for await (const elem of document.evaluate("//button[contains(., 'View)]", document, null, XPathResult.ANY_TYPE, null)) {
    // for await (const elem of document.querySelectorAll("button[ng-reflect-router-link]")) {
      elem.click();
      click++;
      yield Lib.getState(ctx, "Clicked on profile view button", "click");
    }
  }
}
