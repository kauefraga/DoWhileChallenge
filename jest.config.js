module.exports = {
  clearMocks: true,

  // collectCoverage: true,
  // coverageDirectory: "__tests__/coverage",
  // An array of regexp pattern strings used to skip coverage collection
  // coveragePathIgnorePatterns: [
  //   "/node_modules/"
  // ],
  // coverageProvider: "v8",
  // coverageReporters: [
  //   "json",
  //   "lcov"
  // ],

  preset: 'ts-jest',

  testMatch: [
    "**/?(*.)+(spec|test).ts"
  ]

}
