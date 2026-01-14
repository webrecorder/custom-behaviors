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

    const baseUrl = "https://profiles.unthsc.edu"

    for await (const elem of document.querySelectorAll("button[ng-reflect-router-link]")) {
      const profileData = elem.getAttribute("ng-reflect-router-link");

      if (!profileData) {
        continue;
      }

      const dataArray = profileData.split(",");
      const urlToQueue = `${baseUrl}${dataArray[0]}/${dataArray[1]}`;

      await Lib.addLink(urlToQueue);
      yield Lib.getState(ctx, `Queued new URL: ${urlToQueue}`, "buttonsClicked");
    }
  }
}
