import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Problem from "../models/Problem.js";
import { clearCache } from "../services/cache.js";

dotenv.config();

const starterCode = {
  Java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        // Read stdin and print only the required answer.
    }
}
`,
  JS: `const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim();

// Parse input and print only the required answer.
`,
  Python: `import sys

data = sys.stdin.read().strip()
# Parse input and print only the required answer.
`,
  "C++": `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // Read stdin and print only the required answer.
    return 0;
}
`
};

const curatedProblems = [
  {
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    description:
      "Given an array of integers nums and an integer target, print the indices of the two numbers that add up to target. Exactly one valid answer exists. Print the two indices in ascending order separated by one space.",
    constraints: ["2 <= n <= 10000", "-100000 <= nums[i] <= 100000", "Exactly one valid pair exists"],
    publicTestCases: [
      {
        input: "4\n2 7 11 15\n9",
        expectedOutput: "0 1",
        explanation: "nums[0] + nums[1] = 9."
      },
      {
        input: "3\n3 2 4\n6",
        expectedOutput: "1 2"
      }
    ],
    hiddenTestCases: [
      { input: "2\n3 3\n6", expectedOutput: "0 1" },
      { input: "5\n-3 4 3 90 11\n0", expectedOutput: "0 2" }
    ],
    starterCode
  },
  {
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    difficulty: "Easy",
    tags: ["String", "Stack"],
    description:
      "Given a string containing only parentheses characters '(', ')', '{', '}', '[' and ']', print true if the input string is valid, otherwise print false.",
    constraints: ["1 <= s.length <= 10000", "s contains only bracket characters"],
    publicTestCases: [
      { input: "()[]{}", expectedOutput: "true" },
      { input: "(]", expectedOutput: "false" }
    ],
    hiddenTestCases: [
      { input: "{[]}", expectedOutput: "true" },
      { input: "([)]", expectedOutput: "false" }
    ],
    starterCode
  },
  {
    title: "Palindrome Number",
    slug: "palindrome-number",
    difficulty: "Easy",
    tags: ["Math"],
    description:
      "Given an integer x, print true if x reads the same backward as forward, otherwise print false.",
    constraints: ["-2^31 <= x <= 2^31 - 1"],
    publicTestCases: [
      { input: "121", expectedOutput: "true" },
      { input: "-121", expectedOutput: "false" }
    ],
    hiddenTestCases: [
      { input: "10", expectedOutput: "false" },
      { input: "0", expectedOutput: "true" }
    ],
    starterCode
  },
  {
    title: "Merge Sorted Array",
    slug: "merge-sorted-array",
    difficulty: "Easy",
    tags: ["Array", "Two Pointers"],
    description:
      "Given two sorted integer arrays, print one sorted merged array. Input format: n, then n integers, then m, then m integers. Print the merged values separated by one space.",
    constraints: ["0 <= n, m <= 10000", "-100000 <= value <= 100000", "Both arrays are sorted in nondecreasing order"],
    publicTestCases: [
      { input: "3\n1 2 3\n3\n2 5 6", expectedOutput: "1 2 2 3 5 6" },
      { input: "1\n1\n0", expectedOutput: "1" }
    ],
    hiddenTestCases: [
      { input: "0\n\n3\n1 2 3", expectedOutput: "1 2 3" },
      { input: "4\n-5 -1 3 9\n4\n-2 0 3 10", expectedOutput: "-5 -2 -1 0 3 3 9 10" }
    ],
    starterCode
  },
  {
    title: "Binary Search",
    slug: "binary-search",
    difficulty: "Easy",
    tags: ["Array", "Binary Search"],
    description:
      "Given a sorted array of distinct integers and a target, print the index of target. Print -1 if target is not present. Input format: n, n integers, target.",
    constraints: ["1 <= n <= 100000", "Array is sorted in ascending order", "All values are distinct"],
    publicTestCases: [
      { input: "6\n-1 0 3 5 9 12\n9", expectedOutput: "4" },
      { input: "6\n-1 0 3 5 9 12\n2", expectedOutput: "-1" }
    ],
    hiddenTestCases: [
      { input: "1\n5\n5", expectedOutput: "0" },
      { input: "5\n1 2 3 4 5\n6", expectedOutput: "-1" }
    ],
    starterCode
  },
  {
    title: "3Sum",
    slug: "3sum",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers", "Sorting"],
    description:
      "Given an integer array nums, print all unique triplets a b c such that a + b + c = 0. Sort values inside each triplet, sort triplets lexicographically, and print one triplet per line. Print None if no triplet exists.",
    constraints: ["3 <= n <= 3000", "-100000 <= nums[i] <= 100000"],
    publicTestCases: [
      { input: "6\n-1 0 1 2 -1 -4", expectedOutput: "-1 -1 2\n-1 0 1" },
      { input: "3\n0 1 1", expectedOutput: "None" }
    ],
    hiddenTestCases: [
      { input: "5\n0 0 0 0 0", expectedOutput: "0 0 0" },
      { input: "6\n-2 0 1 1 2 -1", expectedOutput: "-2 0 2\n-2 1 1\n-1 0 1" }
    ],
    starterCode
  },
  {
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    difficulty: "Medium",
    tags: ["String", "Sliding Window"],
    description:
      "Given a string s, print the length of the longest substring without repeating characters.",
    constraints: ["1 <= s.length <= 50000", "s may contain letters, digits, symbols, and spaces"],
    publicTestCases: [
      { input: "abcabcbb", expectedOutput: "3" },
      { input: "bbbbb", expectedOutput: "1" }
    ],
    hiddenTestCases: [
      { input: "pwwkew", expectedOutput: "3" },
      { input: "dvdf", expectedOutput: "3" }
    ],
    starterCode
  },
  {
    title: "Container With Most Water",
    slug: "container-with-most-water",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers"],
    description:
      "Given n nonnegative heights, choose two lines that with the x-axis contain the most water. Print the maximum area.",
    constraints: ["2 <= n <= 100000", "0 <= height[i] <= 100000"],
    publicTestCases: [
      { input: "9\n1 8 6 2 5 4 8 3 7", expectedOutput: "49" },
      { input: "2\n1 1", expectedOutput: "1" }
    ],
    hiddenTestCases: [
      { input: "5\n4 3 2 1 4", expectedOutput: "16" },
      { input: "4\n1 2 1 3", expectedOutput: "4" }
    ],
    starterCode
  },
  {
    title: "Search in Rotated Sorted Array",
    slug: "search-in-rotated-sorted-array",
    difficulty: "Medium",
    tags: ["Array", "Binary Search"],
    description:
      "Given a rotated sorted array of distinct integers and a target, print the index of target, or -1 if it is not present. Input format: n, n integers, target.",
    constraints: ["1 <= n <= 100000", "All values are distinct", "Expected O(log n) time"],
    publicTestCases: [
      { input: "7\n4 5 6 7 0 1 2\n0", expectedOutput: "4" },
      { input: "7\n4 5 6 7 0 1 2\n3", expectedOutput: "-1" }
    ],
    hiddenTestCases: [
      { input: "1\n1\n0", expectedOutput: "-1" },
      { input: "5\n3 4 5 1 2\n5", expectedOutput: "2" }
    ],
    starterCode
  },
  {
    title: "Coin Change",
    slug: "coin-change",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "BFS"],
    description:
      "Given an amount and coin denominations, print the fewest number of coins needed to make the amount. Print -1 if the amount cannot be made. Input format: amount, n, n coin values.",
    constraints: ["0 <= amount <= 10000", "1 <= n <= 50", "1 <= coin <= 10000"],
    publicTestCases: [
      { input: "11\n3\n1 2 5", expectedOutput: "3" },
      { input: "3\n1\n2", expectedOutput: "-1" }
    ],
    hiddenTestCases: [
      { input: "0\n3\n1 2 5", expectedOutput: "0" },
      { input: "27\n3\n2 5 10", expectedOutput: "4" }
    ],
    starterCode
  },
  {
    title: "Merge K Sorted Lists",
    slug: "merge-k-sorted-lists",
    difficulty: "Hard",
    tags: ["Linked List", "Heap", "Divide and Conquer"],
    description:
      "Given k sorted integer lists, merge them into one sorted list. Input format: k, then k lines. Each list line starts with its length followed by its sorted values. Print the merged values separated by one space. Print an empty line for no values.",
    constraints: ["0 <= k <= 1000", "0 <= total values <= 100000", "Each list is sorted in nondecreasing order"],
    publicTestCases: [
      { input: "3\n3 1 4 5\n3 1 3 4\n2 2 6", expectedOutput: "1 1 2 3 4 4 5 6" },
      { input: "1\n0", expectedOutput: "" }
    ],
    hiddenTestCases: [
      { input: "0", expectedOutput: "" },
      { input: "4\n2 -3 2\n3 -2 0 2\n1 4\n2 1 1", expectedOutput: "-3 -2 0 1 1 2 2 4" }
    ],
    starterCode
  },
  {
    title: "Median of Two Sorted Arrays",
    slug: "median-of-two-sorted-arrays",
    difficulty: "Hard",
    tags: ["Array", "Binary Search"],
    description:
      "Given two sorted arrays nums1 and nums2, print the median of the combined sorted values. Input format: n, n integers, m, m integers. Print one decimal place, for example 2.0 or 2.5.",
    constraints: ["0 <= n, m <= 100000", "1 <= n + m", "Expected O(log(n + m)) time for full-credit solutions"],
    publicTestCases: [
      { input: "2\n1 3\n1\n2", expectedOutput: "2.0" },
      { input: "2\n1 2\n2\n3 4", expectedOutput: "2.5" }
    ],
    hiddenTestCases: [
      { input: "0\n\n1\n1", expectedOutput: "1.0" },
      { input: "3\n1 2 100\n4\n3 4 5 6", expectedOutput: "4.0" }
    ],
    starterCode
  },
  {
    title: "Trapping Rain Water",
    slug: "trapping-rain-water",
    difficulty: "Hard",
    tags: ["Array", "Two Pointers", "Stack"],
    description:
      "Given n nonnegative heights representing an elevation map, print how much water can be trapped after raining.",
    constraints: ["1 <= n <= 100000", "0 <= height[i] <= 100000"],
    publicTestCases: [
      { input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", expectedOutput: "6" },
      { input: "6\n4 2 0 3 2 5", expectedOutput: "9" }
    ],
    hiddenTestCases: [
      { input: "3\n1 2 3", expectedOutput: "0" },
      { input: "5\n5 4 1 2 3", expectedOutput: "3" }
    ],
    starterCode
  }
];

function numberLine(values) {
  return values.join(" ");
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function seededArray(seed, length, options = {}) {
  const min = options.min ?? -20;
  const range = options.range ?? 45;
  const step = options.step ?? 7;
  return Array.from({ length }, (_, index) => ((seed * 17 + index * step + (options.offset ?? 0)) % range) + min);
}

function positiveArray(seed, length, max = 25) {
  return Array.from({ length }, (_, index) => ((seed * 11 + index * 5) % max) + 1);
}

function uniqueSorted(seed, length) {
  const values = Array.from({ length }, (_, index) => seed * 3 + index * 4 - 20);
  return values;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function bool(value) {
  return value ? "true" : "false";
}

function arrayCase(values, expectedOutput, explanation = "") {
  return {
    input: `${values.length}\n${numberLine(values)}`,
    expectedOutput: String(expectedOutput),
    explanation
  };
}

function longestIncreasingRun(values) {
  let best = 0;
  let current = 0;

  for (let index = 0; index < values.length; index += 1) {
    if (index === 0 || values[index] > values[index - 1]) {
      current += 1;
    } else {
      current = 1;
    }
    best = Math.max(best, current);
  }

  return best;
}

function maxSubarray(values) {
  let best = values[0];
  let current = values[0];

  for (let index = 1; index < values.length; index += 1) {
    current = Math.max(values[index], current + values[index]);
    best = Math.max(best, current);
  }

  return best;
}

function twoSumCase(values, target) {
  for (let i = 0; i < values.length; i += 1) {
    for (let j = i + 1; j < values.length; j += 1) {
      if (values[i] + values[j] === target) {
        return {
          input: `${values.length}\n${numberLine(values)}\n${target}`,
          expectedOutput: `${i} ${j}`
        };
      }
    }
  }

  throw new Error("Generated two-sum case without a solution");
}

function missingNumberCase(n, missing) {
  const values = [];
  for (let value = 0; value <= n; value += 1) {
    if (value !== missing) values.push(value);
  }

  return {
    input: `${n}\n${numberLine(values)}`,
    expectedOutput: String(missing)
  };
}

function validAnagramCase(first, second) {
  const normalize = (value) => value.split("").sort().join("");
  return {
    input: `${first}\n${second}`,
    expectedOutput: bool(normalize(first) === normalize(second))
  };
}

function productExceptSelf(values) {
  return values.map((_, index) => {
    let product = 1;
    for (let j = 0; j < values.length; j += 1) {
      if (index !== j) product *= values[j];
    }
    return product;
  });
}

function subarraySumCount(values, target) {
  let count = 0;
  for (let start = 0; start < values.length; start += 1) {
    let total = 0;
    for (let end = start; end < values.length; end += 1) {
      total += values[end];
      if (total === target) count += 1;
    }
  }
  return count;
}

function longestConsecutive(values) {
  const set = new Set(values);
  let best = 0;

  for (const value of set) {
    if (set.has(value - 1)) continue;
    let current = value;
    let length = 1;
    while (set.has(current + 1)) {
      current += 1;
      length += 1;
    }
    best = Math.max(best, length);
  }

  return best;
}

function topKFrequent(values, k) {
  const counts = new Map();
  for (const value of values) {
    counts.set(value, (counts.get(value) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .slice(0, k)
    .map(([value]) => value);
}

function kthLargest(values, k) {
  return [...values].sort((a, b) => b - a)[k - 1];
}

function dailyTemperatures(values) {
  const answer = Array(values.length).fill(0);
  const stack = [];

  for (let index = 0; index < values.length; index += 1) {
    while (stack.length > 0 && values[index] > values[stack[stack.length - 1]]) {
      const previous = stack.pop();
      answer[previous] = index - previous;
    }
    stack.push(index);
  }

  return answer;
}

function minimumSizeSubarray(target, values) {
  let left = 0;
  let total = 0;
  let best = Infinity;

  for (let right = 0; right < values.length; right += 1) {
    total += values[right];
    while (total >= target) {
      best = Math.min(best, right - left + 1);
      total -= values[left];
      left += 1;
    }
  }

  return best === Infinity ? 0 : best;
}

function houseRobber(values) {
  let previous = 0;
  let current = 0;

  for (const value of values) {
    const next = Math.max(current, previous + value);
    previous = current;
    current = next;
  }

  return current;
}

function decodeWays(value) {
  if (!value || value[0] === "0") return 0;
  const dp = Array(value.length + 1).fill(0);
  dp[0] = 1;
  dp[1] = 1;

  for (let index = 2; index <= value.length; index += 1) {
    const one = Number(value.slice(index - 1, index));
    const two = Number(value.slice(index - 2, index));
    if (one >= 1) dp[index] += dp[index - 1];
    if (two >= 10 && two <= 26) dp[index] += dp[index - 2];
  }

  return dp[value.length];
}

function spiralOrder(matrix) {
  const result = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let column = left; column <= right; column += 1) result.push(matrix[top][column]);
    top += 1;
    for (let row = top; row <= bottom; row += 1) result.push(matrix[row][right]);
    right -= 1;
    if (top <= bottom) {
      for (let column = right; column >= left; column -= 1) result.push(matrix[bottom][column]);
      bottom -= 1;
    }
    if (left <= right) {
      for (let row = bottom; row >= top; row -= 1) result.push(matrix[row][left]);
      left += 1;
    }
  }

  return result;
}

function largestRectangle(heights) {
  const stack = [];
  let best = 0;

  for (let index = 0; index <= heights.length; index += 1) {
    const current = index === heights.length ? 0 : heights[index];
    while (stack.length > 0 && current < heights[stack[stack.length - 1]]) {
      const height = heights[stack.pop()];
      const width = stack.length === 0 ? index : index - stack[stack.length - 1] - 1;
      best = Math.max(best, height * width);
    }
    stack.push(index);
  }

  return best;
}

function editDistance(first, second) {
  const dp = Array.from({ length: first.length + 1 }, () => Array(second.length + 1).fill(0));

  for (let i = 0; i <= first.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= second.length; j += 1) dp[0][j] = j;

  for (let i = 1; i <= first.length; i += 1) {
    for (let j = 1; j <= second.length; j += 1) {
      if (first[i - 1] === second[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[first.length][second.length];
}

function minimumWindow(source, target) {
  const need = new Map();
  for (const char of target) {
    need.set(char, (need.get(char) || 0) + 1);
  }

  const window = new Map();
  let formed = 0;
  let left = 0;
  let best = "";

  for (let right = 0; right < source.length; right += 1) {
    const char = source[right];
    window.set(char, (window.get(char) || 0) + 1);
    if (need.has(char) && window.get(char) === need.get(char)) {
      formed += 1;
    }

    while (formed === need.size) {
      const candidate = source.slice(left, right + 1);
      if (!best || candidate.length < best.length) best = candidate;
      const leftChar = source[left];
      window.set(leftChar, window.get(leftChar) - 1);
      if (need.has(leftChar) && window.get(leftChar) < need.get(leftChar)) {
        formed -= 1;
      }
      left += 1;
    }
  }

  return best || "None";
}

function distinctSubsequences(source, target) {
  const dp = Array(target.length + 1).fill(0);
  dp[0] = 1;

  for (const char of source) {
    for (let index = target.length - 1; index >= 0; index -= 1) {
      if (target[index] === char) {
        dp[index + 1] += dp[index];
      }
    }
  }

  return dp[target.length];
}

function maximalRectangle(matrix) {
  const heights = Array(matrix[0].length).fill(0);
  let best = 0;

  for (const row of matrix) {
    for (let column = 0; column < row.length; column += 1) {
      heights[column] = row[column] === "1" ? heights[column] + 1 : 0;
    }
    best = Math.max(best, largestRectangle(heights));
  }

  return best;
}

function burstBalloons(values) {
  const nums = [1, ...values, 1];
  const dp = Array.from({ length: nums.length }, () => Array(nums.length).fill(0));

  for (let length = 2; length < nums.length; length += 1) {
    for (let left = 0; left + length < nums.length; left += 1) {
      const right = left + length;
      for (let pivot = left + 1; pivot < right; pivot += 1) {
        dp[left][right] = Math.max(
          dp[left][right],
          nums[left] * nums[pivot] * nums[right] + dp[left][pivot] + dp[pivot][right]
        );
      }
    }
  }

  return dp[0][nums.length - 1];
}

function matrixInput(matrix) {
  return `${matrix.length} ${matrix[0].length}\n${matrix.map((row) => row.join(" ")).join("\n")}`;
}

const practiceFamilies = [
  {
    title: "Find Maximum Element",
    difficulty: "Easy",
    tags: ["Array"],
    description: "Given n integers, print the largest value in the array.",
    constraints: ["1 <= n <= 100000", "-100000 <= value <= 100000"],
    makeCases(seed) {
      const first = seededArray(seed, 6, { min: -15, range: 38 });
      const second = seededArray(seed + 3, 7, { min: -30, range: 70, step: 11 });
      const third = seededArray(seed + 7, 5, { min: -9, range: 20, step: 4 });
      const fourth = seededArray(seed + 11, 8, { min: -50, range: 120, step: 13 });
      return {
        publicTestCases: [arrayCase(first, Math.max(...first)), arrayCase(second, Math.max(...second))],
        hiddenTestCases: [arrayCase(third, Math.max(...third)), arrayCase(fourth, Math.max(...fourth))]
      };
    }
  },
  {
    title: "Sum of Array",
    difficulty: "Easy",
    tags: ["Array", "Math"],
    description: "Given n integers, print the sum of all values.",
    constraints: ["1 <= n <= 100000", "-100000 <= value <= 100000", "The answer fits in a signed 64-bit integer"],
    makeCases(seed) {
      const first = seededArray(seed, 5);
      const second = seededArray(seed + 5, 8, { min: -12, range: 30 });
      const third = seededArray(seed + 9, 4, { min: -100, range: 200 });
      const fourth = seededArray(seed + 13, 9, { min: 0, range: 25 });
      return {
        publicTestCases: [arrayCase(first, sum(first)), arrayCase(second, sum(second))],
        hiddenTestCases: [arrayCase(third, sum(third)), arrayCase(fourth, sum(fourth))]
      };
    }
  },
  {
    title: "Count Even Numbers",
    difficulty: "Easy",
    tags: ["Array", "Math"],
    description: "Given n integers, print how many values are even.",
    constraints: ["1 <= n <= 100000", "-100000 <= value <= 100000"],
    makeCases(seed) {
      const first = seededArray(seed, 7, { min: 0, range: 30 });
      const second = seededArray(seed + 2, 6, { min: -10, range: 35 });
      const third = seededArray(seed + 4, 8, { min: 1, range: 50 });
      const fourth = seededArray(seed + 6, 5, { min: -25, range: 45 });
      const countEven = (values) => values.filter((value) => value % 2 === 0).length;
      return {
        publicTestCases: [arrayCase(first, countEven(first)), arrayCase(second, countEven(second))],
        hiddenTestCases: [arrayCase(third, countEven(third)), arrayCase(fourth, countEven(fourth))]
      };
    }
  },
  {
    title: "Reverse String",
    difficulty: "Easy",
    tags: ["String"],
    description: "Given one lowercase string, print the string in reverse order.",
    constraints: ["1 <= s.length <= 100000", "s contains lowercase English letters"],
    makeCases(seed) {
      const words = ["algorithm", "dynamic", "compiler", "practice", "backend", "frontend", "database", "terminal", "function", "variable"];
      const pick = (offset) => words[(seed + offset) % words.length];
      const reverse = (value) => value.split("").reverse().join("");
      return {
        publicTestCases: [
          { input: pick(0), expectedOutput: reverse(pick(0)) },
          { input: pick(2), expectedOutput: reverse(pick(2)) }
        ],
        hiddenTestCases: [
          { input: pick(4), expectedOutput: reverse(pick(4)) },
          { input: pick(6), expectedOutput: reverse(pick(6)) }
        ]
      };
    }
  },
  {
    title: "First Unique Character",
    difficulty: "Easy",
    tags: ["String", "Hash Table"],
    description: "Given a lowercase string s, print the index of the first non-repeating character. Print -1 if every character repeats.",
    constraints: ["1 <= s.length <= 100000", "s contains lowercase English letters"],
    makeCases(seed) {
      const values = ["leetcode", "aabb", "swiss", "redivider", "aabbcdd", "zzxyzz", "programming", "xxyyzz"];
      const firstUnique = (value) => {
        for (let index = 0; index < value.length; index += 1) {
          if (value.indexOf(value[index]) === value.lastIndexOf(value[index])) return index;
        }
        return -1;
      };
      const pick = (offset) => values[(seed + offset) % values.length];
      return {
        publicTestCases: [
          { input: pick(0), expectedOutput: String(firstUnique(pick(0))) },
          { input: pick(1), expectedOutput: String(firstUnique(pick(1))) }
        ],
        hiddenTestCases: [
          { input: pick(3), expectedOutput: String(firstUnique(pick(3))) },
          { input: pick(5), expectedOutput: String(firstUnique(pick(5))) }
        ]
      };
    }
  },
  {
    title: "Count Vowels",
    difficulty: "Easy",
    tags: ["String"],
    description: "Given one lowercase string, print the number of vowels in it. The vowels are a, e, i, o, and u.",
    constraints: ["1 <= s.length <= 100000", "s contains lowercase English letters"],
    makeCases(seed) {
      const values = ["education", "rhythm", "subsequence", "datastructure", "queueing", "crypt", "iteration", "monotonic"];
      const count = (value) => value.split("").filter((char) => "aeiou".includes(char)).length;
      const pick = (offset) => values[(seed + offset) % values.length];
      return {
        publicTestCases: [
          { input: pick(0), expectedOutput: String(count(pick(0))) },
          { input: pick(2), expectedOutput: String(count(pick(2))) }
        ],
        hiddenTestCases: [
          { input: pick(4), expectedOutput: String(count(pick(4))) },
          { input: pick(6), expectedOutput: String(count(pick(6))) }
        ]
      };
    }
  },
  {
    title: "Valid Anagram Check",
    difficulty: "Easy",
    tags: ["String", "Hash Table", "Sorting"],
    description: "Given two lowercase strings on separate lines, print true if they are anagrams of each other, otherwise print false.",
    constraints: ["1 <= s.length, t.length <= 100000", "Strings contain lowercase English letters"],
    makeCases(seed) {
      const pairs = [
        ["listen", "silent"],
        ["rat", "car"],
        ["triangle", "integral"],
        ["binary", "brainy"],
        ["apple", "papel"],
        ["hello", "bello"],
        ["state", "taste"],
        ["night", "thing"]
      ];
      const pick = (offset) => pairs[(seed + offset) % pairs.length];
      return {
        publicTestCases: [validAnagramCase(...pick(0)), validAnagramCase(...pick(1))],
        hiddenTestCases: [validAnagramCase(...pick(3)), validAnagramCase(...pick(5))]
      };
    }
  },
  {
    title: "Running Sum",
    difficulty: "Easy",
    tags: ["Array", "Prefix Sum"],
    description: "Given n integers, print the running prefix sums separated by one space.",
    constraints: ["1 <= n <= 100000", "-100000 <= value <= 100000"],
    makeCases(seed) {
      const build = (values) => arrayCase(
        values,
        numberLine(values.map((_, index) => sum(values.slice(0, index + 1))))
      );
      return {
        publicTestCases: [build(seededArray(seed, 5, { min: -5, range: 16 })), build(seededArray(seed + 4, 6, { min: 0, range: 12 }))],
        hiddenTestCases: [build(seededArray(seed + 8, 7, { min: -10, range: 22 })), build(seededArray(seed + 12, 4, { min: -20, range: 40 }))]
      };
    }
  },
  {
    title: "Missing Number",
    difficulty: "Easy",
    tags: ["Array", "Math"],
    description: "Given n and then n distinct numbers from the range 0 to n with exactly one missing, print the missing number.",
    constraints: ["1 <= n <= 100000", "0 <= nums[i] <= n", "Exactly one number is missing"],
    makeCases(seed) {
      return {
        publicTestCases: [missingNumberCase(5 + (seed % 3), seed % (6 + (seed % 3))), missingNumberCase(7, (seed + 3) % 8)],
        hiddenTestCases: [missingNumberCase(9, (seed + 5) % 10), missingNumberCase(12, (seed + 7) % 13)]
      };
    }
  },
  {
    title: "Longest Increasing Run",
    difficulty: "Easy",
    tags: ["Array"],
    description: "Given n integers, print the length of the longest contiguous run where every next value is strictly larger than the previous value.",
    constraints: ["1 <= n <= 100000", "-100000 <= value <= 100000"],
    makeCases(seed) {
      const first = [seed, seed + 1, seed + 3, seed - 2, seed - 1, seed + 5];
      const second = seededArray(seed, 8, { min: 1, range: 18, step: 3 });
      const third = [5, 4, 3, 2, 1, seed];
      const fourth = [1, 2, 2, 3, 4, 1, 2, 3, 4, 5].map((value) => value + (seed % 2));
      return {
        publicTestCases: [arrayCase(first, longestIncreasingRun(first)), arrayCase(second, longestIncreasingRun(second))],
        hiddenTestCases: [arrayCase(third, longestIncreasingRun(third)), arrayCase(fourth, longestIncreasingRun(fourth))]
      };
    }
  },
  {
    title: "Two Sum Index Pair",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    description: "Given n integers and a target, print the indices of the first pair that sums to target. Print the lower index first.",
    constraints: ["2 <= n <= 100000", "-100000 <= value, target <= 100000", "Exactly one valid answer exists"],
    makeCases(seed) {
      return {
        publicTestCases: [
          twoSumCase([seed, 4, 9, 12, 15], seed + 12),
          twoSumCase([2, 7 + seed, 11, 15, 3], 18 + seed)
        ],
        hiddenTestCases: [
          twoSumCase([5, seed + 1, -3, 8, 13], seed - 2),
          twoSumCase([10, -4, seed, 6, 20], seed + 16)
        ]
      };
    }
  },
  {
    title: "Maximum Subarray Sum",
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming"],
    description: "Given n integers, print the maximum possible sum of a non-empty contiguous subarray.",
    constraints: ["1 <= n <= 100000", "-100000 <= value <= 100000"],
    makeCases(seed) {
      const first = [-2, 1 + seed, -3, 4, -1, 2, 1, -5, 4];
      const second = seededArray(seed, 8, { min: -9, range: 20, step: 5 });
      const third = seededArray(seed + 5, 6, { min: -15, range: 30, step: 9 });
      const fourth = [seed, -1, seed + 2, -8, 3, 4, -2];
      return {
        publicTestCases: [arrayCase(first, maxSubarray(first)), arrayCase(second, maxSubarray(second))],
        hiddenTestCases: [arrayCase(third, maxSubarray(third)), arrayCase(fourth, maxSubarray(fourth))]
      };
    }
  },
  {
    title: "Product Except Self",
    difficulty: "Medium",
    tags: ["Array", "Prefix Product"],
    description: "Given n integers, print an array where each position contains the product of every input value except the value at that position.",
    constraints: ["2 <= n <= 100000", "-20 <= value <= 20", "The generated answers fit in a signed 64-bit integer"],
    makeCases(seed) {
      const build = (values) => arrayCase(values, numberLine(productExceptSelf(values)));
      return {
        publicTestCases: [build([1, 2 + (seed % 3), 3, 4]), build([2, 3, 0, 5 + (seed % 2)])],
        hiddenTestCases: [build([seed % 5 + 1, -1, 2, -3, 4]), build([0, 0, 2 + (seed % 4), 5])]
      };
    }
  },
  {
    title: "Subarray Sum Equals K",
    difficulty: "Medium",
    tags: ["Array", "Hash Table", "Prefix Sum"],
    description: "Given n integers and an integer k, print how many contiguous subarrays have sum exactly k.",
    constraints: ["1 <= n <= 100000", "-1000 <= value, k <= 1000"],
    makeCases(seed) {
      const build = (values, target) => ({
        input: `${values.length}\n${numberLine(values)}\n${target}`,
        expectedOutput: String(subarraySumCount(values, target))
      });
      return {
        publicTestCases: [build([1, 1, 1, seed % 3], 2), build([1, 2, 3, -1, 2], 3)],
        hiddenTestCases: [build([3, 4, 7, 2, -3, 1, 4, 2], 7), build(seededArray(seed, 7, { min: -3, range: 8 }), seed % 4)]
      };
    }
  },
  {
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    tags: ["Array", "Hash Table"],
    description: "Given n integers, print the length of the longest set of consecutive values.",
    constraints: ["1 <= n <= 100000", "-100000 <= value <= 100000", "Expected O(n) time for full-credit solutions"],
    makeCases(seed) {
      const build = (values) => arrayCase(values, longestConsecutive(values));
      return {
        publicTestCases: [build([100, 4, 200, 1, 3, 2 + (seed % 2)]), build([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])],
        hiddenTestCases: [build([seed, seed + 2, seed + 1, 50, 51, 53]), build(seededArray(seed, 9, { min: -5, range: 15 }))]
      };
    }
  },
  {
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    tags: ["Array", "Hash Table", "Heap", "Sorting"],
    description: "Given n integers and k, print the k most frequent values. Sort by frequency descending, breaking ties by smaller value.",
    constraints: ["1 <= k <= number of distinct values", "1 <= n <= 100000"],
    makeCases(seed) {
      const build = (values, k) => ({
        input: `${values.length}\n${numberLine(values)}\n${k}`,
        expectedOutput: numberLine(topKFrequent(values, k))
      });
      return {
        publicTestCases: [build([1, 1, 1, 2, 2, 3, seed % 3], 2), build([4, 4, 5, 5, 5, 6, 7], 2)],
        hiddenTestCases: [build([9, 9, 8, 8, 7, 7, 7, 6, 6, seed], 3), build([1, 2, 3, 1, 2, 1, 4, 4, 4], 2)]
      };
    }
  },
  {
    title: "Kth Largest Element",
    difficulty: "Medium",
    tags: ["Array", "Heap", "Quickselect"],
    description: "Given n integers and k, print the kth largest value in the array.",
    constraints: ["1 <= k <= n <= 100000", "-100000 <= value <= 100000"],
    makeCases(seed) {
      const build = (values, k) => ({
        input: `${values.length}\n${numberLine(values)}\n${k}`,
        expectedOutput: String(kthLargest(values, k))
      });
      return {
        publicTestCases: [build([3, 2, 1, 5, 6, 4 + seed], 2), build([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)],
        hiddenTestCases: [build(seededArray(seed, 8, { min: -10, range: 35 }), 3), build([seed, seed + 1, seed - 1, 100, -100], 1)]
      };
    }
  },
  {
    title: "Daily Temperatures",
    difficulty: "Medium",
    tags: ["Array", "Stack"],
    description: "Given daily temperatures, print for each day how many days you must wait for a warmer temperature. Print 0 when none exists.",
    constraints: ["1 <= n <= 100000", "0 <= temperature <= 100"],
    makeCases(seed) {
      const build = (values) => arrayCase(values, numberLine(dailyTemperatures(values)));
      return {
        publicTestCases: [build([73, 74, 75, 71, 69, 72, 76, 73]), build([30, 40, 50, 60])],
        hiddenTestCases: [build([30, 60, 90, 50 + (seed % 5)]), build([70, 69, 68, 71, 72, 65, 80])]
      };
    }
  },
  {
    title: "Minimum Size Subarray Sum",
    difficulty: "Medium",
    tags: ["Array", "Sliding Window"],
    description: "Given target and n positive integers, print the minimal length of a contiguous subarray whose sum is at least target. Print 0 if no such subarray exists.",
    constraints: ["1 <= n <= 100000", "1 <= value, target <= 100000"],
    makeCases(seed) {
      const build = (target, values) => ({
        input: `${target}\n${values.length}\n${numberLine(values)}`,
        expectedOutput: String(minimumSizeSubarray(target, values))
      });
      return {
        publicTestCases: [build(7, [2, 3, 1, 2, 4, 3]), build(4 + (seed % 3), [1, 4, 4])],
        hiddenTestCases: [build(11, [1, 1, 1, 1, 1, 1, 1, 1]), build(15, positiveArray(seed, 8, 9))]
      };
    }
  },
  {
    title: "House Robber",
    difficulty: "Medium",
    tags: ["Array", "Dynamic Programming"],
    description: "Given nonnegative house values in a row, print the maximum amount you can rob without robbing adjacent houses.",
    constraints: ["1 <= n <= 100000", "0 <= value <= 100000"],
    makeCases(seed) {
      const build = (values) => arrayCase(values, houseRobber(values));
      return {
        publicTestCases: [build([1, 2, 3, 1 + (seed % 2)]), build([2, 7, 9, 3, 1])],
        hiddenTestCases: [build(positiveArray(seed, 7, 20)), build([10, 1, 1, 10, 1, 1, 10])]
      };
    }
  },
  {
    title: "Decode Ways",
    difficulty: "Medium",
    tags: ["String", "Dynamic Programming"],
    description: "Given a digit string, print how many ways it can be decoded where A=1 through Z=26.",
    constraints: ["1 <= s.length <= 100", "s contains only digits"],
    makeCases(seed) {
      const values = ["12", "226", "06", "11106", "2611055971756562", "27", "1212", "101"];
      const pick = (offset) => values[(seed + offset) % values.length];
      return {
        publicTestCases: [
          { input: pick(0), expectedOutput: String(decodeWays(pick(0))) },
          { input: pick(1), expectedOutput: String(decodeWays(pick(1))) }
        ],
        hiddenTestCases: [
          { input: pick(3), expectedOutput: String(decodeWays(pick(3))) },
          { input: pick(5), expectedOutput: String(decodeWays(pick(5))) }
        ]
      };
    }
  },
  {
    title: "Spiral Matrix",
    difficulty: "Medium",
    tags: ["Array", "Matrix", "Simulation"],
    description: "Given an r by c matrix, print its values in clockwise spiral order separated by one space.",
    constraints: ["1 <= r, c <= 100", "-100000 <= value <= 100000"],
    makeCases(seed) {
      const build = (matrix) => ({
        input: matrixInput(matrix),
        expectedOutput: numberLine(spiralOrder(matrix))
      });
      return {
        publicTestCases: [build([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), build([[1, 2, 3, 4], [5, 6, 7, 8]])],
        hiddenTestCases: [
          build([[seed, seed + 1], [seed + 2, seed + 3], [seed + 4, seed + 5]]),
          build([[1, 2], [3, 4], [5, 6], [7, 8]])
        ]
      };
    }
  },
  {
    title: "Largest Rectangle in Histogram",
    difficulty: "Hard",
    tags: ["Array", "Stack"],
    description: "Given histogram bar heights, print the area of the largest rectangle that can be formed.",
    constraints: ["1 <= n <= 100000", "0 <= height <= 100000"],
    makeCases(seed) {
      const build = (values) => arrayCase(values, largestRectangle(values));
      return {
        publicTestCases: [build([2, 1, 5, 6, 2, 3]), build([2, 4 + (seed % 3)])],
        hiddenTestCases: [build([6, 2, 5, 4, 5, 1, 6]), build(positiveArray(seed, 8, 10))]
      };
    }
  },
  {
    title: "Edit Distance",
    difficulty: "Hard",
    tags: ["String", "Dynamic Programming"],
    description: "Given two words on separate lines, print the minimum number of insertions, deletions, or replacements needed to transform the first word into the second.",
    constraints: ["0 <= word.length <= 500", "Words contain lowercase English letters"],
    makeCases(seed) {
      const pairs = [
        ["horse", "ros"],
        ["intention", "execution"],
        ["kitten", "sitting"],
        ["algorithm", "altruistic"],
        ["distance", "editing"],
        ["abc", "yabd"]
      ];
      const build = ([first, second]) => ({ input: `${first}\n${second}`, expectedOutput: String(editDistance(first, second)) });
      return {
        publicTestCases: [build(pairs[seed % pairs.length]), build(pairs[(seed + 1) % pairs.length])],
        hiddenTestCases: [build(pairs[(seed + 3) % pairs.length]), build(pairs[(seed + 5) % pairs.length])]
      };
    }
  },
  {
    title: "Minimum Window Substring",
    difficulty: "Hard",
    tags: ["String", "Hash Table", "Sliding Window"],
    description: "Given source string s and target string t, print the smallest substring of s that contains every character of t with matching multiplicity. Print None if no such window exists.",
    constraints: ["1 <= s.length, t.length <= 100000", "Strings contain English letters"],
    makeCases(seed) {
      const pairs = [
        ["ADOBECODEBANC", "ABC"],
        ["a", "aa"],
        ["ab", "b"],
        ["thisisateststring", "tist"],
        ["figehaeci", "aei"],
        ["aaabdabcefaecbef", "abc"]
      ];
      const build = ([source, target]) => ({ input: `${source}\n${target}`, expectedOutput: minimumWindow(source, target) });
      return {
        publicTestCases: [build(pairs[seed % pairs.length]), build(pairs[(seed + 1) % pairs.length])],
        hiddenTestCases: [build(pairs[(seed + 3) % pairs.length]), build(pairs[(seed + 5) % pairs.length])]
      };
    }
  },
  {
    title: "Distinct Subsequences",
    difficulty: "Hard",
    tags: ["String", "Dynamic Programming"],
    description: "Given strings s and t on separate lines, print how many distinct subsequences of s equal t.",
    constraints: ["1 <= s.length, t.length <= 1000", "The generated answer fits in a signed 64-bit integer"],
    makeCases(seed) {
      const pairs = [
        ["rabbbit", "rabbit"],
        ["babgbag", "bag"],
        ["aaaaa", "aa"],
        ["programming", "ping"],
        ["subsequence", "sue"],
        ["banana", "ban"]
      ];
      const build = ([source, target]) => ({ input: `${source}\n${target}`, expectedOutput: String(distinctSubsequences(source, target)) });
      return {
        publicTestCases: [build(pairs[seed % pairs.length]), build(pairs[(seed + 1) % pairs.length])],
        hiddenTestCases: [build(pairs[(seed + 3) % pairs.length]), build(pairs[(seed + 5) % pairs.length])]
      };
    }
  },
  {
    title: "Maximal Rectangle",
    difficulty: "Hard",
    tags: ["Array", "Matrix", "Stack", "Dynamic Programming"],
    description: "Given a binary matrix, print the area of the largest rectangle containing only 1 values.",
    constraints: ["1 <= rows, cols <= 200", "Each cell is 0 or 1"],
    makeCases(seed) {
      const build = (matrix) => ({
        input: `${matrix.length} ${matrix[0].length}\n${matrix.map((row) => row.join("")).join("\n")}`,
        expectedOutput: String(maximalRectangle(matrix))
      });
      const shifted = seed % 2 === 0 ? [["1", "0", "1"], ["1", "1", "1"], ["1", "1", "0"]] : [["1", "1", "0"], ["1", "1", "1"], ["0", "1", "1"]];
      return {
        publicTestCases: [
          build([["1", "0", "1", "0", "0"], ["1", "0", "1", "1", "1"], ["1", "1", "1", "1", "1"], ["1", "0", "0", "1", "0"]]),
          build([["0"]])
        ],
        hiddenTestCases: [build(shifted), build([["1", "1", "1", "1"], ["1", "1", "1", "1"]])]
      };
    }
  },
  {
    title: "Burst Balloons",
    difficulty: "Hard",
    tags: ["Array", "Dynamic Programming"],
    description: "Given balloon values, print the maximum coins obtainable by bursting balloons in the best order. Bursting balloon i earns left * nums[i] * right using the nearest remaining neighbors, with virtual 1 values at both ends.",
    constraints: ["1 <= n <= 300", "1 <= nums[i] <= 100"],
    makeCases(seed) {
      const build = (values) => arrayCase(values, burstBalloons(values));
      return {
        publicTestCases: [build([3, 1, 5, 8]), build([1, 5 + (seed % 3)])],
        hiddenTestCases: [build([2, 4, 3, 5]), build(positiveArray(seed, 5, 8))]
      };
    }
  }
];

function createPracticeProblem(family, setNumber) {
  const cases = family.makeCases(setNumber);

  return {
    title: `${family.title} ${setNumber}`,
    slug: `${slugify(family.title)}-${setNumber}`,
    difficulty: family.difficulty,
    tags: family.tags,
    description: `${family.description}\n\nPractice set ${setNumber}. Read from standard input and print only the required answer.`,
    constraints: family.constraints,
    publicTestCases: cases.publicTestCases,
    hiddenTestCases: cases.hiddenTestCases,
    starterCode
  };
}

function buildPracticeProblems() {
  const generated = [];
  const setsPerFamily = 10;

  for (const family of practiceFamilies) {
    for (let setNumber = 1; setNumber <= setsPerFamily; setNumber += 1) {
      generated.push(createPracticeProblem(family, setNumber));
    }
  }

  return generated;
}

const problems = [...curatedProblems, ...buildPracticeProblems()];

async function seed() {
  await connectDB(process.env.MONGODB_URI);

  for (const problem of problems) {
    await Problem.findOneAndUpdate(
      { slug: problem.slug },
      { $set: problem },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  clearCache();
  console.log(`Seeded ${problems.length} problems`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
