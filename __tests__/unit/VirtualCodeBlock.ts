import { VirtualCodeBlock } from "./../../src/VirtualCodeBlock";
import { describe, expect } from "@jest/globals";
import { IAction } from "@fullstackcraftllc/codevideo-types";

describe("VirtualCodeBlock", () => {
  describe("applyActions", () => {
    it("should initialize all arrays to empty with an empty intial code", () => {
      const virtualCodeBlock = new VirtualCodeBlock([]);
      expect(virtualCodeBlock.getCodeActionsApplied()).toEqual([]);
      expect(virtualCodeBlock.getCodeLinesHistory()).toEqual([[""]]);
      expect(virtualCodeBlock.getCodeLines()).toEqual([""]);
      expect(virtualCodeBlock.getSpeakActionsApplied()).toEqual([]);
    });

    it("should add space at the beginning of a line", () => {
      const virtualCodeBlock = new VirtualCodeBlock([
        'console.log("Hello World!");',
      ]);
      virtualCodeBlock.applyActions([{ name: "space", value: "1" }]);
      expect(virtualCodeBlock.getCode()).toEqual(
        ' console.log("Hello World!");'
      );
    });

    it("should add space at the end of a line", () => {
      const virtualCodeBlock = new VirtualCodeBlock([
        'console.log("Hello World!");',
      ]);
      virtualCodeBlock.applyActions([
        { name: "command-right", value: "1" },
        { name: "space", value: "1" },
      ]);
      expect(virtualCodeBlock.getCode()).toEqual(
        'console.log("Hello World!"); '
      );
    });

    it("should add space in the middle of a line with character content", () => {
      const virtualCodeBlock = new VirtualCodeBlock([
        'console.log("Hello World!");',
      ]);
      virtualCodeBlock.applyActions([
        { name: "arrow-right", value: "3" },
        { name: "space", value: "1" },
      ]);
      expect(virtualCodeBlock.getCode()).toEqual(
        'con sole.log("Hello World!");'
      );
    });

    it("should create a new empty line at the beginning of a line", () => {
      const virtualCodeBlock = new VirtualCodeBlock([
        'console.log("Hello World!");',
      ]);
      virtualCodeBlock.applyActions([
        { name: "arrow-up", value: "1" },
        { name: "enter", value: "1" },
      ]);
      expect(virtualCodeBlock.getCode()).toEqual(
        '\nconsole.log("Hello World!");'
      );
    });

    it("should split a line with text in the middle when enter is applied", () => {
      const virtualCodeBlock = new VirtualCodeBlock([
        'console.log("Hello World!");',
      ]);
      virtualCodeBlock.applyActions([
        { name: "arrow-right", value: "8" },
        { name: "enter", value: "1" },
      ]);
      expect(virtualCodeBlock.getCode()).toEqual(
        'console.\nlog("Hello World!");'
      );
    });

    // Additional Tests
    it("should handle multiple spaces added consecutively", () => {
      const virtualCodeBlock = new VirtualCodeBlock([
        'console.log("Hello World!");',
      ]);
      virtualCodeBlock.applyActions([{ name: "space", value: "3" }]);
      expect(virtualCodeBlock.getCode()).toEqual(
        '   console.log("Hello World!");'
      );
    });

    it("should handle multiple enter actions", () => {
      const virtualCodeBlock = new VirtualCodeBlock([
        'console.log("Hello World!");',
      ]);
      virtualCodeBlock.applyActions([{ name: "enter", value: "3" }]);
      expect(virtualCodeBlock.getCode()).toEqual(
        '\n\n\nconsole.log("Hello World!");'
      );
    });

    it("should handle arrow-down action at the end of code", () => {
      const virtualCodeBlock = new VirtualCodeBlock([
        'console.log("Hello World!");',
      ]);
      virtualCodeBlock.applyActions([{ name: "arrow-down", value: "1" }]);
      expect(virtualCodeBlock.getCurrentCaretPosition()).toEqual({
        row: 0,
        column: 0,
      });
    });

    it("should handle arrow-up action at the beginning of code", () => {
      const virtualCodeBlock = new VirtualCodeBlock([
        'console.log("Hello World!");',
      ]);
      virtualCodeBlock.applyActions([{ name: "arrow-up", value: "1" }]);
      expect(virtualCodeBlock.getCurrentCaretPosition()).toEqual({
        row: 0,
        column: 0,
      });
    });

    it("should bring the caret to the start of the current line with command-left", () => {
      const virtualCodeBlock = new VirtualCodeBlock([
        'console.log("Hello World!");',
      ]);
      virtualCodeBlock.applyActions([
        { name: "arrow-right", value: "5" },
        { name: "command-left", value: "1" },
      ]);
      expect(virtualCodeBlock.getCurrentCaretPosition().row).toEqual(0);
      expect(virtualCodeBlock.getCurrentCaretPosition().column).toEqual(0);
    });

    it("should bring the caret to the end of the current line with command-right", () => {
      const code = 'console.log("Hello World!");';
      const virtualCodeBlock = new VirtualCodeBlock([code]);
      virtualCodeBlock.applyActions([{ name: "command-right", value: "1" }]);
      expect(virtualCodeBlock.getCurrentCaretPosition()).toEqual({
        row: 0,
        column: code.length,
      });
    });

    it("should handle writing multiple lines, going back up to the top line, entering a few empty spaces, then going back to the top again and writing some comments", () => {
      const virtualCodeBlock = new VirtualCodeBlock([], true);
      virtualCodeBlock.applyActions([
        { name: "type-editor", value: "const someFunction = () => {" },
        { name: "enter", value: "1" },
        { name: "type-editor", value: "    console.log('hello world!')" },
        { name: "enter", value: "1" },
        { name: "type-editor", value: "}" },
        { name: "arrow-up", value: "2" },
        { name: "command-left", value: "1" },
        { name: "enter", value: "3" },
        { name: "arrow-up", value: "2" },
        { name: "type-editor", value: "// This is a comment" },
        { name: "arrow-down", value: "1" },
        { name: "type-editor", value: "// And here is another" },
      ]);
      expect(virtualCodeBlock.getCode()).toEqual(
        `
// This is a comment
// And here is another
const someFunction = () => {
    console.log('hello world!')
}`
      );
    });

    it("should should have all resulting history arrays as expected", () => {
      const virtualCodeBlock = new VirtualCodeBlock([], true);
      const actions: Array<IAction> = [
        { name: "speak-before", value: "Let's get this lesson started" },
        { name: "type-editor", value: "const someFunction = () => {" },
        { name: "enter", value: "1" },
        { name: "type-editor", value: "    console.log('hello world!')" },
        { name: "enter", value: "1" },
        { name: "type-editor", value: "}" },
        { name: "speak-after", value: "In the middle of a lesson!" },
        { name: "arrow-up", value: "2" },
        { name: "command-left", value: "1" },
        { name: "enter", value: "3" },
        { name: "arrow-up", value: "2" },
        { name: "type-editor", value: "// This is a comment" },
        { name: "arrow-down", value: "1" },
        { name: "type-editor", value: "// And here is another" },
        { name: "speak-after", value: "And that's the end of the lesson!" },
      ];
      virtualCodeBlock.applyActions(actions);
      expect(virtualCodeBlock.getActionsApplied()).toEqual(actions);
      expect(virtualCodeBlock.getSpeakActionsApplied()).toEqual([
        { name: "speak-before", value: "Let's get this lesson started" },
        { name: "speak-after", value: "In the middle of a lesson!" },
        { name: "speak-after", value: "And that's the end of the lesson!" },
      ]);
      expect(virtualCodeBlock.getCodeActionsApplied()).toEqual([
        { name: "type-editor", value: "const someFunction = () => {" },
        { name: "enter", value: "1" },
        { name: "type-editor", value: "    console.log('hello world!')" },
        { name: "enter", value: "1" },
        { name: "type-editor", value: "}" },
        { name: "arrow-up", value: "2" },
        { name: "command-left", value: "1" },
        { name: "enter", value: "3" },
        { name: "arrow-up", value: "2" },
        { name: "type-editor", value: "// This is a comment" },
        { name: "arrow-down", value: "1" },
        { name: "type-editor", value: "// And here is another" },
      ]);
    });

    it("should show code history as expected", () => {
      const virtualCodeBlock = new VirtualCodeBlock([], true);
      virtualCodeBlock.applyActions([
        { name: "type-editor", value: "const someFunction = () => {" },
        { name: "enter", value: "1" },
        { name: "type-editor", value: "    console.log('hello world!')" },
        { name: "enter", value: "1" },
        { name: "type-editor", value: "}" },
      ]);
      expect(virtualCodeBlock.getCodeLinesHistory()).toEqual([
        [""],
        ["const someFunction = () => {"],
        ["const someFunction = () => {", ""],
        ["const someFunction = () => {", "    console.log('hello world!')"],
        ["const someFunction = () => {", "    console.log('hello world!')", ""],
        [
          "const someFunction = () => {",
          "    console.log('hello world!')",
          "}",
        ],
      ]);
    });

    it("should have the correct final caret position with a step by step example", () => {
      const virtualCodeBlock = new VirtualCodeBlock([], true);
      virtualCodeBlock.applyAction(
        { name: "type-editor", value: "12345" }
      );
      expect(virtualCodeBlock.getCode()).toEqual("12345");
      expect(virtualCodeBlock.getCurrentCaretPosition()).toEqual({
        row: 0,
        column: 5, 
      });
      virtualCodeBlock.applyAction(
        { name: "arrow-left", value: "3" }
      );
      expect(virtualCodeBlock.getCurrentCaretPosition()).toEqual({
        row: 0,
        column: 2, 
      });
      virtualCodeBlock.applyAction(
        { name: "type-editor", value: "abc" }
      );
      expect(virtualCodeBlock.getCode()).toEqual("12abc345");
      expect(virtualCodeBlock.getCurrentCaretPosition()).toEqual({
        row: 0,
        column: 5, 
      });
    });

    it("should have the correct final caret if we type within the middle of a line", () => {
      const virtualCodeBlock = new VirtualCodeBlock([], true);
      virtualCodeBlock.applyActions([
        { name: "type-editor", value: "12345678910" },
        { name: "arrow-left", value: "5" },
        { name: "type-editor", value: "abc" },
      ]);
      expect(virtualCodeBlock.getCode()).toEqual("123456abc78910");
      expect(virtualCodeBlock.getCurrentCaretPosition()).toEqual({
        row: 0,
        column: 9, 
      });
    });

    it("should have the correct final caret location after some complex steps", () => {
      const virtualCodeBlock = new VirtualCodeBlock([], true);
      virtualCodeBlock.applyActions([
        {
          name: "speak-before",
          value:
            "Let's learn how to use the console.log function in JavaScript!",
        },
        {
          name: "speak-before",
          value:
            "First, to make it clear that this is a JavaScript file, I'll just put a comment here",
        },
        {
          name: "type-editor",
          value: "// index.js",
        },
        {
          name: "enter",
          value: "1",
        },
        {
          name: "speak-before",
          value:
            "For starters, let's just print 'Hello world!' to the console.",
        },
        {
          name: "type-editor",
          value: "console.log('Hello, world!');",
        },
        {
          name: "speak-before",
          value:
            "and if I wanted to write the value of some variable to the console, I could do that like so:",
        },
        {
          name: "backspace",
          value: "29",
        },
        {
          name: "type-editor",
          value: "const myVariable = 5;",
        },
        {
          name: "enter",
          value: "1",
        },
        {
          name: "type-editor",
          value: "console.log(myVariable);",
        },
        {
          name: "speak-before",
          value:
            "Now, when I run this code, I would expect the value of 'myVariable' to be printed to the console. Something like:",
        },
        {
          name: "enter",
          value: "1",
        },
        {
          name: "type-editor",
          value: "// 5",
        },
        {
          name: "speak-before",
          value: "Console logging is simple, yet powerful and very useful!",
        },
      ]);
      expect(virtualCodeBlock.getCurrentCaretPosition()).toEqual({
        row: 3,
        column: 4,
      });
    });
  });
});
