<script setup>
import { useRoute, useRouter } from 'vitepress'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

// 定义路由路径与面包屑的映射关系
const breadcrumbMap = {
  '/guide/': {
    text: '新手指南',
    link: '/guide/getting-started'
  },
  '/server/': {
    text: '服务器介绍',
    link: '/server/basic'
  },
  '/rules/': {
    text: '服务器规则',
    link: '/rules/main-rules'
  }
}

// 计算面包屑导航
const breadcrumbs = computed(() => {
  const items = []
  const path = route.path
  
  // 始终添加首页
  items.push({
    text: '首页',
    link: '/'
  })
  
  // 根据当前路径匹配对应的分类
  for (const [prefix, info] of Object.entries(breadcrumbMap)) {
    if (path.startsWith(prefix)) {
      items.push(info)
      break
    }
  }
  
  // 获取当前页面的标题（从路由元数据或路径推断）
  const currentPath = path.replace(/\.html$/, '')
  const segments = currentPath.split('/').filter(Boolean)
  
  if (segments.length > 0) {
    const lastSegment = segments[segments.length - 1]
    // 将路径转换为可读文本
    const pageTitle = lastSegment
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    // 如果不是分类首页，则添加当前页
    const isCategoryHome = [
      '/guide/getting-started',
      '/server/basic', 
      '/rules/main-rules'
    ].includes(path)
    
    if (!isCategoryHome && !items.find(item => item.text === pageTitle)) {
      items.push({
        text: pageTitle,
        link: path
      })
    }
  }
  
  return items
})

// 判断是否显示面包屑（首页不显示）
const showBreadcrumbs = computed(() => {
  return route.path !== '/' && breadcrumbs.value.length > 1
})
</script>

<template>
  <nav v-if="showBreadcrumbs" class="breadcrumb-nav" aria-label="面包屑导航">
    <ol class="breadcrumb-list">
      <li 
        v-for="(item, index) in breadcrumbs" 
        :key="index"
        class="breadcrumb-item"
        :class="{ active: index === breadcrumbs.length - 1 }"
      >
        <template v-if="index < breadcrumbs.length - 1">
          <a :href="item.link" class="breadcrumb-link">{{ item.text }}</a>
          <span class="breadcrumb-separator">/</span>
        </template>
        <template v-else>
          <span class="breadcrumb-current">{{ item.text }}</span>
        </template>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumb-nav {
  margin-bottom: 1.5rem;
  padding: 0.75rem 0;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.875rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  color: var(--vp-c-text-3);
}

.breadcrumb-link {
  color: var(--sky-blue);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.breadcrumb-link:hover {
  color: var(--sky-blue-light);
  text-decoration: underline;
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: var(--vp-c-text-3);
  user-select: none;
}

.breadcrumb-current {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.breadcrumb-item.active .breadcrumb-current {
  color: var(--vp-c-brand);
}

@media (max-width: 768px) {
  .breadcrumb-list {
    font-size: 0.8125rem;
  }
  
  .breadcrumb-separator {
    margin: 0 0.375rem;
  }
}
</style>
