// This behavior demonstrates simple, but custom pagination + link extraction
// It is used for: 'https://olympic.org.nz/athletes' pages which provide pagination.
//
// Ordinarily, no behavior would be needed for standard pagination, but this site:
// 1) Does not properly support direct https://olympic.org.nz/athletes?page=N URLs -- (these redirect and drop the page)
// 2) Uses buttons instead of links to get to each page, so no link is provided to go directly to page N, so the Next button
//    must be clicked to get to the Nth page.

// Functionality: A selector is used to match the next button, which is then clicked repeatedly
// Additionally, links are extracted after every pagination, obeying scoping rules.


class CustomPaginate
{
  static id = "CustomPaginate";

  static isMatch() {
    return !!window.location.href.match(/olympic\.org\.nz\/athletes([?]page=[\d]+)?$/);
  }

  static init() {
    return {};
  }

  async* run(ctx) {
    const { sleep, getState, addLink } = ctx.Lib;

    while (true) {
      const elem = document.querySelector("button.button.button--sm:last-of-type");

      // ensure this is the 'next' button (don't click previous)
      if (!elem || elem.textContent !== "next") {
        break;
      }

      elem.click();

      await sleep(500);

      const allLinks = document.querySelectorAll("a[href]");

      for (const link of allLinks) {
        // add true to obey scoping rules
        addLink(link.href, true);
      }

      yield getState(ctx, `Clicking from: ${window.location.href}`);
    }
  }
}
