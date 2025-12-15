class UNTHealthBehavior
{
  seenElem = new WeakSet();

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

    const origHref = self.location.href;

    for await (const elem of document.querySelectorAll("button[ng-reflect-router-link]")) {
      if (elem.innerText && elem.innerText === "View") {
        if (this.seenElem.has(elem)) {
          continue;
        }

        this.seenElem.add(elem);

        elem.click();
        click++;

        // wait a bit
        await new Promise(r => setTimeout(r, 2000));

        // if we navigated to new page, go back
        if (self.location.href != origHref) {
          await new Promise((resolve) => {
            window.addEventListener(
              "popstate",
              () => {
                resolve(null);
              },
              { once: true },
            );

            window.history.back();
          });
        }
        yield Lib.getState(ctx, "Clicked on profile view button", "click");
      }
    }
  }
}
