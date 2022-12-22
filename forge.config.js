module.exports = {
  packagerConfig: {
    appVersion: "1.3.0",
    name: "Sharing GUI",
    appCopyright: "yuanx(yuanx.me@qq.com)",
    icon: "./assets/logo-bg-512x512",
    win32metadata: {
      ProductName: "Sharing GUI",
      CompanyName: "yuanx.me",
      FileDescription: "Sharing GUI for windows",
    },
    asar: true,
    ignore: [
      "\/sharing\-pkg\/easy\-sharing\-linux",
      "\/sharing\-pkg\/easy\-sharing\-win\.exe",
    ],
    // ignore: function ignore(path) {
    //   // console.log("ignore/path", path, process.platform, process);
    //   let ignoreList = [
    //     "/node_modules/.bin",
    //     "/node_modules/electron",
    //     "/node_modules/electron-prebuilt",
    //     "/node_modules/electron-prebuilt-compile",
    //     "/.git",
    //   ];
    //   for (let i = 0; i < ignoreList.length; i++) {
    //     const element = ignoreList[i];
    //     if (path.indexOf(element) === 0) {
    //       return true;
    //     }
    //   }
    //   return false;
    // },
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
