class UNTFacultyProfileBehavior
{
  static id = "UNTFacultyProfileBehavior";

  static isMatch() {
    return window.location.href === "https://profiles.unthsc.edu/home";
  }

  static init() {
    return {};
  }

  async* run(ctx) {
    const { Lib } = ctx;

    for await (const elem of document.querySelectorAll("button[ng-reflect-router-link]")) {
      const profileData = elem.getAttribute("ng-reflect-router-link");
      yield Lib.getState(ctx, `Button profile data: ${profileData}`, "buttonsClicked");
    }
  }
}
