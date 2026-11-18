import publicIntro from './ddr-public/index.md?raw'
import example from './ddr-public/example.md?raw'
import adminIntro from './ddr-admin/index.md?raw'
import instrumentIntro from './research-instrument/index.md?raw'

export const sections = [
  {
    label: 'DDR Public',
    path: '/ddr-public',
    description: 'Documentation for the public-facing section.',
    pages: [
      { label: 'Introduction', path: '/ddr-public', content: publicIntro },
      { label: 'Example documentation', path: '/ddr-public/example', content: example },
    ],
  },
  {
    label: 'DDR Admin',
    path: '/ddr-admin',
    description: 'Documentation for the administration section.',
    pages: [
      { label: 'Introduction', path: '/ddr-admin', content: adminIntro },
    ],
  },
  {
    label: 'Research Instrument',
    path: '/research-instrument',
    description: 'Documentation for the research instrument section.',
    pages: [
      { label: 'Introduction', path: '/research-instrument', content: instrumentIntro },
    ],
  },
]
