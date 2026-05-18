import DefaultTheme from 'vitepress/theme'
import Breadcrumbs from './components/Breadcrumbs.vue'
import Layout from './Layout.vue'
import './style.css'

function initStaggerAnimation() {
  const selectors = ['.VPFeature', '.VPHomeHero']
  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector)
    elements.forEach((el, index) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(20px)'
      el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`
      requestAnimationFrame(() => {
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      })
    })
  })
}

function initScrollAnimation() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  })

  const animatedElements = document.querySelectorAll('.VPFeature, .VPFeatures, .VPHomeContent')
  animatedElements.forEach(el => {
    el.classList.add('scroll-animate')
    observer.observe(el)
  })
}

function initNavbarScroll() {
  const nav = document.querySelector('.VPNav')
  if (!nav) return

  const handleScroll = () => {
    if (window.scrollY > 50) {
      nav.classList.add('is-scrolled')
    } else {
      nav.classList.remove('is-scrolled')
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
}

function applyThemeByPreference() {
  const html = document.documentElement
  const stored = localStorage.getItem('vitepress-theme-appearance')

  if (stored === 'light') {
    html.classList.add('light')
    html.classList.remove('dark')
    html.style.colorScheme = 'light'
  } else if (stored === 'dark') {
    html.classList.add('dark')
    html.classList.remove('light')
    html.style.colorScheme = 'dark'
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      html.classList.add('dark')
      html.classList.remove('light')
      html.style.colorScheme = 'dark'
    } else {
      html.classList.add('light')
      html.classList.remove('dark')
      html.style.colorScheme = 'light'
    }
  }
}

function initMediaQueryListener() {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    const stored = localStorage.getItem('vitepress-theme-appearance')
    if (!stored || stored === 'auto') {
      const html = document.documentElement
      if (e.matches) {
        html.classList.add('dark')
        html.classList.remove('light')
        html.style.colorScheme = 'dark'
      } else {
        html.classList.add('light')
        html.classList.remove('dark')
        html.style.colorScheme = 'light'
      }
    }
  })
}

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app, router, siteData }) {
    // 注册全局组件
    app.component('Breadcrumbs', Breadcrumbs)
    
    if (typeof window !== 'undefined') {
      applyThemeByPreference()
      initMediaQueryListener()

      router.onAfterRouteChanged = () => {
        setTimeout(() => {
          applyThemeByPreference()
          initStaggerAnimation()
          initScrollAnimation()
          initNavbarScroll()
        }, 0)
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          applyThemeByPreference()
          initStaggerAnimation()
          initScrollAnimation()
          initNavbarScroll()
        })
      } else {
        applyThemeByPreference()
        initStaggerAnimation()
        initScrollAnimation()
        initNavbarScroll()
      }
    }
  }
}
