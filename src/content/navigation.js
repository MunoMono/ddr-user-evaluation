import publicIntro from './ddr-public/index.md?raw'
import publicPrerequisites from './ddr-public/prerequisites.md?raw'
import publicGettingStarted from './ddr-public/getting-started.md?raw'
import publicTroubleshooting from './ddr-public/troubleshooting.md?raw'
import example from './ddr-public/example.md?raw'
import findingRecord from './ddr-public/finding-a-record.md?raw'
import exploringRecord from './ddr-public/evaluation-tasks/explore-an-archival-record/task.md?raw'
import aboutEvaluation from './ddr-public/about-the-evaluation.md?raw'
import adminIntro from './ddr-admin/index.md?raw'
import adminTasks from './ddr-admin/evaluation-tasks.md?raw'
import adminInfo from './ddr-admin/evaluation-information.md?raw'
import instrumentIntro from './research-instrument/index.md?raw'
import instrumentTasks from './research-instrument/evaluation-tasks.md?raw'
import instrumentInfo from './research-instrument/evaluation-information.md?raw'
import { orderPages } from '../utils/navigation.js'

export const contentTypes = ['User guide', 'Evaluation tasks', 'Evaluation information']

const sectionDefinitions = [
  {
    label: 'DDR public',
    path: '/ddr-public',
    description: 'Documentation for the public-facing section.',
    groups: [
      {
        label: 'User guide',
        pages: [
          { label: 'Introduction', path: '/ddr-public', content: publicIntro },
          { label: 'Prerequisites', path: '/ddr-public/prerequisites', content: publicPrerequisites },
          { label: 'Getting started', path: '/ddr-public/getting-started', content: publicGettingStarted },
          { label: 'Finding a record in the archive', path: '/ddr-public/user-guide/finding-a-record', content: findingRecord },
          { label: 'Example documentation', path: '/ddr-public/example', content: example, hidden: true },
          { label: 'Troubleshooting', path: '/ddr-public/troubleshooting', content: publicTroubleshooting },
        ],
      },
      {
        label: 'Evaluation tasks',
        pages: [
          { label: 'Explore an archival record', path: '/ddr-public/evaluation-tasks/explore-an-archival-record', content: exploringRecord },
        ],
      },
      {
        label: 'Evaluation information',
        pages: [
          { label: 'About this evaluation', path: '/ddr-public/evaluation-information/about-this-evaluation', content: aboutEvaluation },
        ],
      },
    ],
  },
  {
    label: 'DDR admin',
    path: '/ddr-admin',
    description: 'Documentation for the administration section.',
    groups: [
      { label: 'User guide', pages: [{ label: 'Introduction', path: '/ddr-admin', content: adminIntro }] },
      { label: 'Evaluation tasks', pages: [{ label: 'Introduction', path: '/ddr-admin/evaluation-tasks', content: adminTasks }] },
      { label: 'Evaluation information', pages: [{ label: 'Introduction', path: '/ddr-admin/evaluation-information', content: adminInfo }] },
    ],
  },
  {
    label: 'Research instrument',
    path: '/research-instrument',
    description: 'Documentation for the research instrument section.',
    groups: [
      { label: 'User guide', pages: [{ label: 'Introduction', path: '/research-instrument', content: instrumentIntro }] },
      { label: 'Evaluation tasks', pages: [{ label: 'Introduction', path: '/research-instrument/evaluation-tasks', content: instrumentTasks }] },
      { label: 'Evaluation information', pages: [{ label: 'Introduction', path: '/research-instrument/evaluation-information', content: instrumentInfo }] },
    ],
  },
]

export const sections = sectionDefinitions.map((section) => {
  const groups = section.groups.map((group) => ({ ...group, pages: orderPages(group) }))
  return {
    ...section,
    groups,
    pages: groups.flatMap((group) =>
      group.pages.map((page) => ({
        ...page,
        groupLabel: group.label,
        contentType: group.label === 'Evaluation tasks' ? 'Evaluation task' : group.label,
      })),
    ),
  }
})
