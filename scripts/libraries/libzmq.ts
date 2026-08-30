import { join } from 'path'

import { defineLib } from '../utils/lib'
import { appleSdkEnv } from '../utils/platforms'

export const libzmq = defineLib({
  name: 'libzmq',
  cacheTag: '0',

  // 4.3.5 (upstream wants 4.2.0)
  url: 'https://github.com/zeromq/libzmq.git',
  hash: '622fc6dde99ee172ebaa9c8628d85a7a1995a21d',

  build: async (build, platform, prefixPath) => {
    build.exportEnv({ ...platform.tools })

    build.exportEnv({
      ...platform.tools,
      PKG_CONFIG_PATH: join(prefixPath, 'lib/pkgconfig')
    })
    const sdkEnv = appleSdkEnv(platform)
    if (sdkEnv != null) build.exportEnv(sdkEnv)
    // Apple clang 21 treats -Wmissing-braces as error under libzmq's -Werror.
    const werror = '-Wno-error=missing-braces'
    build.exportEnv({
      CFLAGS: `${build.env.CFLAGS ?? ''} ${werror}`.trim(),
      CXXFLAGS: `${build.env.CXXFLAGS ?? ''} ${werror}`.trim()
    })

    await build.exec('./autogen.sh')
    await build.exec('./configure', [
      '--enable-static',
      '--disable-shared',
      `--host=${platform.triple}`,
      `--prefix=${prefixPath}`
    ])
    await build.exec('make', [])
    await build.exec('make', ['install'])
  }
})
