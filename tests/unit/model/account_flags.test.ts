import { AccountFlags, IAccountFlags } from "../../../src/model";
import { AccountFlagsFactory } from "../../../src/model/factories";

describe("constructor & factory", () => {
  const cases: Array<[string, number, IAccountFlags]> = [
    ["000", 0, { authRequired: false, authRevokable: false, authImmutable: false }],
    ["001", 1, { authRequired: true, authRevokable: false, authImmutable: false }],
    ["010", 2, { authRequired: false, authRevokable: true, authImmutable: false }],
    ["011", 3, { authRequired: true, authRevokable: true, authImmutable: false }],
    ["100", 4, { authRequired: false, authRevokable: false, authImmutable: true }],
    ["101", 5, { authRequired: true, authRevokable: false, authImmutable: true }],
    ["110", 6, { authRequired: false, authRevokable: true, authImmutable: true }],
    ["111", 7, { authRequired: true, authRevokable: true, authImmutable: true }]
  ];

  test.each(cases)("Flags binary value: %s", (caseName, value, result) => {
    const subject = AccountFlagsFactory.fromValue(value);

    expect(subject.authImmutable).toEqual(result.authImmutable);
    expect(subject.authRevokable).toEqual(result.authRevokable);
    expect(subject.authRequired).toEqual(result.authRequired);
  });
});

describe("equals()", () => {
  const flagsValue = { authRequired: true, authRevokable: true, authImmutable: false };
  const subject = new AccountFlags(flagsValue);
  let other: AccountFlags;

  describe("when flags are the same", () => {
    it("returns true", () => {
      other = new AccountFlags(flagsValue);
      expect(subject.equals(other)).toBe(true);
    });
  });

  describe("when flags are different", () => {
    it("returns false", () => {
      other = new AccountFlags({ authRequired: true, authRevokable: false, authImmutable: false });
      expect(subject.equals(other)).toBe(false);
    });
  });
});
