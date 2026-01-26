import { spawn } from "bun";

console.log("📝 Grading your submission...");

const proc = spawn(["bun", "test"], {
  stdout: "inherit",
  stderr: "inherit",
});

const exitCode = await proc.exited;

console.log("\n---------------------------------------------------");
if (exitCode === 0) {
  console.log("🎉 All tests passed! You got a 100/100 score.");
  console.log("✅ Submission verified.");
} else {
  console.log("❌ Some tests failed. Please review the errors above.");
  console.log("📉 Score: Partially completed. Keep trying!");
}
console.log("---------------------------------------------------");
