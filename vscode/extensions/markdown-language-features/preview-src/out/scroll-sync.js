"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLineElementForFragment = exports.getEditorLineNumberForPageOffset = exports.scrollToRevealSourceLine = exports.getLineElementsAtPageOffset = exports.getElementsForSourceLine = exports.CodeLineElement = void 0;
const codeLineClass = 'code-line';
class CodeLineElement {
    constructor(element, line, codeElement) {
        this.element = element;
        this.line = line;
        this.codeElement = codeElement;
        this._detailParentElements = Array.from(getParentsWithTagName(element, 'DETAILS'));
    }
    get isVisible() {
        return !this._detailParentElements.some(x => !x.open);
    }
}
exports.CodeLineElement = CodeLineElement;
const getCodeLineElements = (() => {
    let cachedElements;
    let cachedVersion = -1;
    return (documentVersion) => {
        if (!cachedElements || documentVersion !== cachedVersion) {
            cachedVersion = documentVersion;
            cachedElements = [new CodeLineElement(document.body, -1)];
            for (const element of document.getElementsByClassName(codeLineClass)) {
                if (!(element instanceof HTMLElement)) {
                    continue;
                }
                const line = +element.getAttribute('data-line');
                if (isNaN(line)) {
                    continue;
                }
                if (element.tagName === 'CODE' && element.parentElement && element.parentElement.tagName === 'PRE') {
                    // Fenced code blocks are a special case since the `code-line` can only be marked on
                    // the `<code>` element and not the parent `<pre>` element.
                    cachedElements.push(new CodeLineElement(element.parentElement, line, element));
                }
                else if (element.tagName === 'UL' || element.tagName === 'OL') {
                    // Skip adding list elements since the first child has the same code line (and should be preferred)
                }
                else {
                    cachedElements.push(new CodeLineElement(element, line));
                }
            }
        }
        return cachedElements;
    };
})();
/**
 * Find the html elements that map to a specific target line in the editor.
 *
 * If an exact match, returns a single element. If the line is between elements,
 * returns the element prior to and the element after the given line.
 */
function getElementsForSourceLine(targetLine, documentVersion) {
    const lineNumber = Math.floor(targetLine);
    const lines = getCodeLineElements(documentVersion);
    let previous = lines[0] || null;
    for (const entry of lines) {
        if (entry.line === lineNumber) {
            return { previous: entry, next: undefined };
        }
        else if (entry.line > lineNumber) {
            return { previous, next: entry };
        }
        previous = entry;
    }
    return { previous };
}
exports.getElementsForSourceLine = getElementsForSourceLine;
/**
 * Find the html elements that are at a specific pixel offset on the page.
 */
function getLineElementsAtPageOffset(offset, documentVersion) {
    const lines = getCodeLineElements(documentVersion).filter(x => x.isVisible);
    const position = offset - window.scrollY;
    let lo = -1;
    let hi = lines.length - 1;
    while (lo + 1 < hi) {
        const mid = Math.floor((lo + hi) / 2);
        const bounds = getElementBounds(lines[mid]);
        if (bounds.top + bounds.height >= position) {
            hi = mid;
        }
        else {
            lo = mid;
        }
    }
    const hiElement = lines[hi];
    const hiBounds = getElementBounds(hiElement);
    if (hi >= 1 && hiBounds.top > position) {
        const loElement = lines[lo];
        return { previous: loElement, next: hiElement };
    }
    if (hi > 1 && hi < lines.length && hiBounds.top + hiBounds.height > position) {
        return { previous: hiElement, next: lines[hi + 1] };
    }
    return { previous: hiElement };
}
exports.getLineElementsAtPageOffset = getLineElementsAtPageOffset;
function getElementBounds({ element }) {
    const myBounds = element.getBoundingClientRect();
    // Some code line elements may contain other code line elements.
    // In those cases, only take the height up to that child.
    const codeLineChild = element.querySelector(`.${codeLineClass}`);
    if (codeLineChild) {
        const childBounds = codeLineChild.getBoundingClientRect();
        const height = Math.max(1, (childBounds.top - myBounds.top));
        return {
            top: myBounds.top,
            height: height
        };
    }
    return myBounds;
}
/**
 * Attempt to reveal the element for a source line in the editor.
 */
function scrollToRevealSourceLine(line, documentVersion, settingsManager) {
    if (!settingsManager.settings?.scrollPreviewWithEditor) {
        return;
    }
    if (line <= 0) {
        window.scroll(window.scrollX, 0);
        return;
    }
    const { previous, next } = getElementsForSourceLine(line, documentVersion);
    if (!previous) {
        return;
    }
    let scrollTo = 0;
    const rect = getElementBounds(previous);
    const previousTop = rect.top;
    if (next && next.line !== previous.line) {
        // Between two elements. Go to percentage offset between them.
        const betweenProgress = (line - previous.line) / (next.line - previous.line);
        const previousEnd = previousTop + rect.height;
        const betweenHeight = next.element.getBoundingClientRect().top - previousEnd;
        scrollTo = previousEnd + betweenProgress * betweenHeight;
    }
    else {
        const progressInElement = line - Math.floor(line);
        scrollTo = previousTop + (rect.height * progressInElement);
    }
    scrollTo = Math.abs(scrollTo) < 1 ? Math.sign(scrollTo) : scrollTo;
    window.scroll(window.scrollX, Math.max(1, window.scrollY + scrollTo));
}
exports.scrollToRevealSourceLine = scrollToRevealSourceLine;
function getEditorLineNumberForPageOffset(offset, documentVersion) {
    const { previous, next } = getLineElementsAtPageOffset(offset, documentVersion);
    if (previous) {
        if (previous.line < 0) {
            return 0;
        }
        const previousBounds = getElementBounds(previous);
        const offsetFromPrevious = (offset - window.scrollY - previousBounds.top);
        if (next) {
            const progressBetweenElements = offsetFromPrevious / (getElementBounds(next).top - previousBounds.top);
            return previous.line + progressBetweenElements * (next.line - previous.line);
        }
        else {
            const progressWithinElement = offsetFromPrevious / (previousBounds.height);
            return previous.line + progressWithinElement;
        }
    }
    return null;
}
exports.getEditorLineNumberForPageOffset = getEditorLineNumberForPageOffset;
/**
 * Try to find the html element by using a fragment id
 */
function getLineElementForFragment(fragment, documentVersion) {
    return getCodeLineElements(documentVersion).find((element) => {
        return element.element.id === fragment;
    });
}
exports.getLineElementForFragment = getLineElementForFragment;
function* getParentsWithTagName(element, tagName) {
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
        if (parent.tagName === tagName) {
            yield parent;
        }
    }
}
//# sourceMappingURL=scroll-sync.js.map