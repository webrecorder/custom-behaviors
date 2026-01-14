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
    for await (const elem of document.querySelectorAll("button")) {
      elem.click();
    }
  }
}
