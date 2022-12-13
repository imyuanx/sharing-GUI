module.exports = {
  packagerConfig: {
    appVersion: "1.2.0",
    name: "Sharing GUI",
    appCopyright: "yuanx(yuanx.me@qq.com)",
    icon: "./assets/logo-bg-512x512",
    win32metadata: {
      ProductName: "Sharing GUI",
      CompanyName: "yuanx.me",
      FileDescription: "Sharing GUI for windows",
    },
    asar: true,
    // platforms: ["darwin"],
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          icon: "/assets/logo-bg-512x512",
        },
      },
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
};
