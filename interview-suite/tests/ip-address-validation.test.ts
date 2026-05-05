import { describe, expect, test } from "bun:test";
import { restoreIpAddresses, isValidIpPart, isValidIpAddress } from "../src/ip-address-validation";

describe("IP Address Restoration", () => {
  test("should restore IP addresses from digits", () => {
    const result = restoreIpAddresses("25525511135");
    const expected = ["255.255.11.135", "255.255.111.35"];
    expect(result.sort()).toEqual(expected.sort());
  });

  test("should handle all zeros", () => {
    const result = restoreIpAddresses("0000");
    expect(result).toEqual(["0.0.0.0"]);
  });

  test("should handle multiple valid combinations", () => {
    const result = restoreIpAddresses("101023");
    const expected = ["1.0.10.23", "1.0.102.3", "10.1.0.23", "10.10.2.3", "101.0.2.3"];
    expect(result.sort()).toEqual(expected.sort());
  });

  test("should return empty array for invalid input", () => {
    const result = restoreIpAddresses("0011");
    // 0011 can become 0.0.1.1 but 0.0.11 is not valid (leading zero)
    expect(result).toEqual(["0.0.1.1"]);
  });

  test("should handle single valid IP", () => {
    const result = restoreIpAddresses("1111");
    expect(result).toEqual(["1.1.1.1"]);
  });

  test("should not allow leading zeros", () => {
    const result = restoreIpAddresses("010010");
    expect(result).toEqual([]);
  });

  test("should validate max value 255", () => {
    const result = restoreIpAddresses("255255255255");
    expect(result).toEqual(["255.255.255.255"]);
  });

  test("should reject numbers > 255", () => {
    const result = restoreIpAddresses("256256256256");
    expect(result).toEqual([]);
  });

  test("should handle single digit parts", () => {
    const result = restoreIpAddresses("1111");
    expect(result).toEqual(["1.1.1.1"]);
  });
});

describe("IP Address Validation Helpers", () => {
  test("should validate IP parts correctly", () => {
    expect(isValidIpPart("0")).toBe(true);
    expect(isValidIpPart("255")).toBe(true);
    expect(isValidIpPart("192")).toBe(true);
    expect(isValidIpPart("256")).toBe(false);
    expect(isValidIpPart("01")).toBe(false); // leading zero
    expect(isValidIpPart("")).toBe(false);
    expect(isValidIpPart("1234")).toBe(false); // too long
  });

  test("should validate complete IP addresses", () => {
    expect(isValidIpAddress("255.255.255.255")).toBe(true);
    expect(isValidIpAddress("0.0.0.0")).toBe(true);
    expect(isValidIpAddress("192.168.1.1")).toBe(true);
    expect(isValidIpAddress("256.256.256.256")).toBe(false);
    expect(isValidIpAddress("1.1.1")).toBe(false); // not 4 parts
    expect(isValidIpAddress("1.1.1.1.1")).toBe(false); // too many parts
    expect(isValidIpAddress("01.1.1.1")).toBe(false); // leading zero
  });
});
