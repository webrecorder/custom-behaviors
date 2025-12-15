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

  nextViewButton() {
    try {
      const allViewButtons = document.querySelectorAll("button[ng-reflect-router-link]");
      for (const elem of allViewButtons) {
        if (!elem.innerText || elem.innerText !== "View") {
          continue;
        }
        if (this.seenElem.has(elem)) {
          continue;
        }
        this.seedElem.add(elem)
        return elem;
      }
    } catch (e) {}
  }

  async processElem(elem) {
    const origHref = self.location.href;
    const origHistoryLen = self.history.length;

    elem.click();

    // wait a bit
    await new Promise(r => setTimeout(r, 2000));

    // if we navigated to new page, go back
    if (
      self.history.length === origHistoryLen + 1 &&
      self.location.href != origHref
    ) {
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
  }

  async* run(ctx) {
    const { log, Lib, autofetcher } = ctx;
    let click = 0;

    try {
      while (true) {
        const elem = this.nextViewButton():

        if (!elem) {
          break;
        }

        await this.processElem(elem);
        click++;
        yield Lib.getState(ctx, "Clicked on profile view button", "click");
      }
    } catch (e) {
      ctx.log({msg: "Error cycling through View buttons", err: e.toString()})
    }
  }
}
