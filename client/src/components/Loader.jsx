import { useEffect } from 'react'

export default function Loader({ onFinish }) {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/pace-js@latest/pace.min.js'
    script.onload = () => {
      if (window.Pace) {
        window.Pace.on('done', () => {
          if (onFinish) setTimeout(onFinish, 300)
        })
      }
    }
    document.body.appendChild(script)

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdn.jsdelivr.net/npm/pace-js@latest/pace-theme-default.min.css'
    document.head.appendChild(link)

    return () => {
      document.body.removeChild(script)
      document.head.removeChild(link)
    }
  }, [onFinish])

  return null
}