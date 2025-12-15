class UNTHealthProfileLinksBehavior
{
  static id = "UNT Health Queue Profile Links";

  static isMatch() {
    return window.location.href === "https://profiles.unthsc.edu/home";
  }

  static init() {
    return {};
  }

  async* run(ctx) {
    const { log, Lib, autofetcher } = ctx;

    const baseUrl = "https://profiles.unthsc.edu";

    for await (const elem of document.querySelectorAll("button[ng-reflect-router-link]")) {
      if (elem.innerText && elem.innerText === "View") {
        
        // Grab data from attribute
        const profileData = elem.getAttribute("ng-reflect-router-link");
        if (!profileData) {
          continue;
        }

        // Construct URL from that data
        const dataArray = profileData.split(",");
        if (dataArray.length !== 2) {
          continue;
        }
        const urlToQueue = `${baseUrl}${dataArray[0]}/${dataArray[1]}`;

        // Queue URL
        await Lib.addLink(urlToQueue);
        yield Lib.getState(ctx, `Queued new URL: ${urlToQueue}`);
      }
    }
  }
}
