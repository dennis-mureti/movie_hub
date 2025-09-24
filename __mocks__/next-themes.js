const React = require("react");

const mockThemeProvider = ({ children }) => <div>{children}</div>;

module.exports = {
  ThemeProvider: mockThemeProvider,
  useTheme: () => ({
    theme: "light",
    setTheme: jest.fn(),
  }),
};
