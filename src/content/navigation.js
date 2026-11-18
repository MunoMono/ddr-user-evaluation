import publicIntro from './ddr-public/index.md?raw'
import example from './ddr-public/example.md?raw'
import findingRecord from './ddr-public/finding-a-record.md?raw'
import exploringRecord from './ddr-public/explore-an-archival-record.md?raw'
import aboutEvaluation from './ddr-public/about-the-evaluation.md?raw'
import adminIntro from './ddr-admin/index.md?raw'
import adminTasks from './ddr-admin/evaluation-tasks.md?raw'
import adminInfo from './ddr-admin/evaluation-information.md?raw'
import instrumentIntro from './research-instrument/index.md?raw'
import instrumentTasks from './research-instrument/evaluation-tasks.md?raw'
import instrumentInfo from './research-instrument/evaluation-information.md?raw'

export const contentTypes = ['User Guide', 'Evaluation Tasks', 'Evaluation Information']

const sectionDefinitions = [
  {
    label: 'DDR Public',
    path: '/ddr-public',
    description: 'Documentation for the public-facing section.',
    groups: [
      {
        label: 'User Guide',
        pages: [
          { label: 'Introduction', path: '/ddr-public', content: publicIntro },
          { label: 'Finding a record in the archive', path: '/ddr-public/user-guide/finding-a-record', content: findingRecord },
          { label: 'Example documentation', path: '/ddr-public/example', content: example },
        ],
      },
      {
        label: 'Evaluation Tasks',
        pages: [
          { label: 'Explore an archival record', path: '/ddr-public/evaluation-tasks/explore-an-archival-record', content: exploringRecord },
        ],
      },
      {
        label: 'Evaluation Information',
        pages: [
          { label: 'About this evaluation', path: '/ddr-public/evaluation-information/about-this-evaluation', content: aboutEvaluation },
        ],
      },
    ],
  },
  {
    label: 'DDR Admin',
    path: '/ddr-admin',
    description: 'Documentation for the administration section.',
    groups: [
      { label: 'User Guide', pages: [{ label: 'Introduction', path: '/ddr-admin', content: adminIntro }] },
      { label: 'Evaluation Tasks', pages: [{ label: 'Introduction', path: '/ddr-admin/evaluation-tasks', content: adminTasks }] },
      { label: 'Evaluation Information', pages: [{ label: 'Introduction', path: '/ddr-admin/evaluation-information', content: adminInfo }] },
    ],
  },
  {
    label: 'Research Instrument',
    path: '/research-instrument',
    description: 'Documentation for the research instrument section.',
    groups: [
      { label: 'User Guide', pages: [{ label: 'Introduction', path: '/research-instrument', content: instrumentIntro }] },
      { label: 'Evaluation Tasks', pages: [{ label: 'Introduction', path: '/research-instrument/evaluation-tasks', content: instrumentTasks }] },
      { label: 'Evaluation Information', pages: [{ label: 'Introduction', path: '/research-instrument/evaluation-information', content: instrumentInfo }] },
    ],
  },
]

export const sections = sectionDefinitions.map((section) => ({
  ...section,
  pages: section.groups.flatMap((group) =>
    group.pages.map((page) => ({
      ...page,
      groupLabel: group.label,
      contentType: group.label === 'Evaluation Tasks' ? 'Evaluation Task' : group.label,
    })),
  ),
}))
