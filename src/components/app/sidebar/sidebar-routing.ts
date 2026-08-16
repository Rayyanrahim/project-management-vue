import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { SidebarConfig, SidebarConfigs, SidebarMatch, SidebarNavItem } from '@/config/navlink'

type RouteLike = Pick<RouteLocationNormalizedLoaded, 'name' | 'path'>

export type ResolvedSidebarContext = Required<Pick<SidebarConfig, 'title'>> & {
  id: string
  sidebarKey: string
  primaryNav: SidebarNavItem[]
  sections: NonNullable<SidebarConfig['sections']>
}

export function matchesSidebarRule(route: RouteLike, match: SidebarMatch) {
  if (match.type === 'route-name') {
    return route.name === match.value
  }

  if (match.type === 'route-names') {
    return route.name != null && match.value.includes(route.name as never)
  }

  return route.path.startsWith(match.value)
}

export function resolveSidebarContext(
  route: RouteLike,
  sidebarConfigs: SidebarConfigs,
): ResolvedSidebarContext {
  const entries = Object.entries(sidebarConfigs)
  const matchedContext = entries
    .flatMap(([sidebarKey, sidebarConfig]) =>
      (sidebarConfig.primaryNav ?? [])
        .filter((navItem) => isSidebarItemActive(route, navItem))
        .map((navItem) => ({
          sidebarKey: navItem.sidebarKey ?? sidebarKey,
        })),
    )
    .find(Boolean)

  if (matchedContext) {
    const sidebarKey = matchedContext.sidebarKey
    const config = sidebarConfigs[sidebarKey]

    if (!config) {
      throw new Error(`Sidebar config "${sidebarKey}" was not found.`)
    }

    return {
      id: sidebarKey,
      sidebarKey,
      title: config.title,
      primaryNav: config.primaryNav ?? [],
      sections: config.sections ?? [],
    }
  }

  const fallbackContext = entries[0]

  if (!fallbackContext) {
    throw new Error('Sidebar configs must include at least one config.')
  }

  const [sidebarKey, config] = fallbackContext
  return {
    id: sidebarKey,
    sidebarKey,
    title: config.title,
    primaryNav: config.primaryNav ?? [],
    sections: config.sections ?? [],
  }
}

export function isSidebarItemActive(route: RouteLike, item: SidebarNavItem) {
  if (item.match) {
    return matchesSidebarRule(route, item.match)
  }

  return route.name === item.to.name
}
