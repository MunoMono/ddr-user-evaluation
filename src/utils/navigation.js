export function orderPages(group) {
  if (group.label !== 'User guide') return group.pages
  return [...group.pages].sort((a, b) =>
    Number(a.label === 'Troubleshooting') - Number(b.label === 'Troubleshooting'),
  )
}
