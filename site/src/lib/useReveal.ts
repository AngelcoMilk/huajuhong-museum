import { useEffect } from 'react'

// 滚动进场：data-reveal 元素进入视口时加 .is-in。只播一次，尊重减少动效设置。
export function useReveal() {
  useEffect(() => {
    const pending = () => document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)')

    if (!('IntersectionObserver' in window)) {
      pending().forEach((el) => el.classList.add('is-in'))
      return
    }

    // threshold 0：再高的元素，露出一点就播；不能设比例，比视口高很多的元素会永远够不到
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0 },
    )

    pending().forEach((el) => observer.observe(el))
    // 手风琴、接口返回后才渲染的节点也要接住，否则一直是隐藏态
    const mutations = new MutationObserver(() => pending().forEach((el) => observer.observe(el)))
    mutations.observe(document.body, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
      mutations.disconnect()
    }
  }, [])
}
