module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
};

// ignore errors
/* module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': [
      "ts-jest",
      {
        diagnostics: false,
      },
    ],
    "^.+\\.(js|jsx)$": "babel-jest",
  }
}; */
